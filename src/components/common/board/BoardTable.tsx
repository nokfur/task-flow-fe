import ColumnCard from '@/components/common/board/ColumnCard';
import type { DueDateFilter, FilterKey } from '@/constants/constants';
import type { Column, Label, Task } from '@/interfaces/interfaces';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { IconColumnInsertLeft } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ColumnSkeleton: React.FC<{ id: React.Key }> = ({ id }) => (
    <motion.div
        key={id}
        initial={{
            opacity: 0,
            width: 0,
            height: 0,
        }}
        animate={{
            opacity: 1,
            width: 'auto',
            height: 'auto',
        }}
        exit={{
            opacity: 0,
            width: 0,
            height: 0,
        }}>
        <div className="w-xs rounded-xl border border-gray-200 bg-white">
            <div className="rounded-t-xl bg-slate-100 px-4 py-2">
                <Skeleton className="h-12 w-full" />
            </div>

            <div className="flex flex-col gap-2 p-2">
                {Array.from({
                    length: 4,
                }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}>
                        <div className="rounded-lg border border-gray-200 bg-white px-3 py-3">
                            <Skeleton className="w-30" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </motion.div>
);

interface TaskDragState {
    draggedItem: Task | null;
    fromColumn: string | null;
    overColumn: string | null;
    insertionIndex: number | null;
    originalIndex: number | null;
}

interface BoardContextType {
    onDragTaskStart: (item: Task, fromColumnId: string, index: number) => void;
    onDragTaskEnd: () => void;
    onDragTask: (overColumnId: string, insertIndex: number) => void;

    onUpdateColumn: (updatedColumn: Column) => void;
    onRemoveColumn: (columnId: string) => void;

    onAddTask: (columnId: string, newTask: Task) => void;
    onUpdateTask: (updatedTask: Task, columnId: string) => void;
    onRemoveTask: (taskId: string, columnId: string) => void;
    onRemoveAllTasks: (columnId: string) => void;
    onToggleLabel: (columnId: string, taskId: string, labelId: string) => void;

    onAddLabel: (newLabel: Label) => void;
    onUpdateLabel: (updatedLabel: Label) => void;
    onRemoveLabel: (labelId: string) => void;

    columns: Column[];
    labels: Label[];

    taskDragState: TaskDragState;
}

const BoardContext = createContext<BoardContextType | null>(null);

const BoardTable: React.FC<{
    loading?: boolean;
    columns: Column[];
    labels: Label[];

    onReorderColumn: (newOrder: Column[]) => void;

    onAddColumn: (newColumn: Column) => void;
    onUpdateColumn: BoardContextType['onUpdateColumn'];
    onRemoveColumn: BoardContextType['onRemoveColumn'];

    onAddTask: BoardContextType['onAddTask'];
    onUpdateTask: BoardContextType['onUpdateTask'];
    onRemoveTask: BoardContextType['onRemoveTask'];
    onRemoveAllTasks: BoardContextType['onRemoveAllTasks'];
    onToggleLabel: BoardContextType['onToggleLabel'];
    onReorderTask: (
        task: Task,
        sourceColumnId: string,
        targetColumnId: string,
        targetIndex: number,
    ) => void;

    onAddLabel: BoardContextType['onAddLabel'];
    onUpdateLabel: BoardContextType['onUpdateLabel'];
    onRemoveLabel: BoardContextType['onRemoveLabel'];
}> = (props) => {
    const {
        columns,
        onAddColumn,
        onReorderColumn,
        onReorderTask,
        loading = false,
    } = props;

    const [taskDragState, setTaskDragState] = useState<TaskDragState>({
        draggedItem: null,
        fromColumn: null,
        overColumn: null,
        insertionIndex: null,
        originalIndex: null,
    });

    const [searchParams] = useSearchParams();

    const filteredColumns = useMemo(() => {
        const filter: Record<
            FilterKey,
            (task: Task, value: string) => boolean
        > = {
            due: (task: Task, value: string) => {
                const today = dayjs();
                const taskDueDate = dayjs(task.dueDate);

                switch (value as DueDateFilter) {
                    case 'noDue':
                        return !task.dueDate;
                    case 'overdue':
                        return taskDueDate.isBefore(today, 'day');
                    case 'nextDay':
                        return (
                            taskDueDate.isAfter(today, 'day') &&
                            taskDueDate.isBefore(today.add(1, 'day'), 'day')
                        );
                    case 'nextWeek':
                        return (
                            taskDueDate.isAfter(today, 'day') &&
                            taskDueDate.isBefore(today.add(7, 'day'), 'day')
                        );
                    default:
                        return false;
                }
            },
            label: (task: Task, name?: string) => {
                if (name === 'none') {
                    return task.labels.length === 0;
                }
                return task.labels.some((label) => label.name === name);
            },
        };

        let filteredColumns = columns;

        (['due', 'label'] as FilterKey[]).forEach((filterKey) => {
            const filterValues = searchParams.getAll(filterKey);
            if (filterValues.length === 0) return;

            filteredColumns = filteredColumns.map((column) => ({
                ...column,
                tasks: column.tasks.filter((task) =>
                    filterValues.some((value) =>
                        filter[filterKey]?.(task, value),
                    ),
                ),
            }));
        });

        return filteredColumns;
    }, [columns, searchParams]);

    const handleDragTaskStart: BoardContextType['onDragTaskStart'] = (
        item,
        fromColumnId,
        index,
    ) => {
        setTaskDragState({
            draggedItem: item,
            fromColumn: fromColumnId,
            overColumn: fromColumnId,
            insertionIndex: index,
            originalIndex: index,
        });
    };

    const handleDragTask: BoardContextType['onDragTask'] = (
        overColumnId,
        insertIndex,
    ) => {
        if (taskDragState.draggedItem === null) return;

        setTaskDragState((prev) => ({
            ...prev,
            overColumn: overColumnId,
            insertionIndex: insertIndex,
        }));
    };

    const handleDragTaskEnd: BoardContextType['onDragTaskEnd'] = () => {
        if (
            taskDragState.draggedItem &&
            taskDragState.fromColumn &&
            taskDragState.overColumn &&
            taskDragState.insertionIndex !== null
        )
            onReorderTask(
                taskDragState.draggedItem,
                taskDragState.fromColumn,
                taskDragState.overColumn,
                taskDragState.insertionIndex,
            );

        // Reset drag state
        setTaskDragState({
            draggedItem: null,
            fromColumn: null,
            overColumn: null,
            insertionIndex: null,
            originalIndex: null,
        });
    };

    const handleAddColumn = () => {
        const newColumn: Column = {
            id: crypto.randomUUID(),
            title: 'New Column',
            tasks: [],
        };
        onAddColumn(newColumn);
    };

    const getCardMotionProps = () => ({
        initial: { opacity: 0, width: 0, filter: 'blur(4px)' },
        animate: { opacity: 1, width: 'auto', filter: 'blur(0px)' },
        exit: { opacity: 0, width: 0, filter: 'blur(4px)' },
    });

    return (
        <BoardContext.Provider
            value={{
                ...props,

                onDragTaskStart: handleDragTaskStart,
                onDragTaskEnd: handleDragTaskEnd,
                onDragTask: handleDragTask,

                taskDragState: taskDragState,
            }}>
            <div className="relative grow">
                <div className="absolute inset-0 flex overflow-x-auto">
                    <div className="flex grow px-8 pt-4 pb-8">
                        <Reorder.Group
                            axis="x"
                            as="div"
                            className="flex h-full items-start gap-4"
                            values={filteredColumns}
                            onReorder={onReorderColumn}>
                            <AnimatePresence mode="sync">
                                {loading
                                    ? Array.from({ length: 6 }).map(
                                          (_, index) => (
                                              <motion.div
                                                  layout
                                                  key={index}
                                                  {...getCardMotionProps()}>
                                                  <ColumnSkeleton
                                                      key={index}
                                                      id={index}
                                                  />
                                              </motion.div>
                                          ),
                                      )
                                    : filteredColumns.map((column) => (
                                          <Reorder.Item
                                              as="div"
                                              className="flex h-full"
                                              value={column}
                                              key={column.id} // Prefer stable ID
                                              drag
                                              {...getCardMotionProps()}>
                                              <ColumnCard column={column} />
                                          </Reorder.Item>
                                      ))}
                            </AnimatePresence>

                            <Button
                                className="w-xs shrink-0 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-gray-500 normal-case hover:bg-gray-100"
                                startIcon={<IconColumnInsertLeft />}
                                onClick={handleAddColumn}>
                                Add column
                            </Button>
                        </Reorder.Group>
                    </div>
                </div>
            </div>
        </BoardContext.Provider>
    );
};

const useBoardContextProvider = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error(
            'useBoardContextProvider must be used within an BoardContextProvider',
        );
    }
    return context;
};

export { BoardTable, useBoardContextProvider };
