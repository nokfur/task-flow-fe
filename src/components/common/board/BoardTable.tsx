import ColumnCard from '@/components/common/board/ColumnCard';
import type { Column, Label, Task } from '@/interfaces/interfaces';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { IconColumnInsertLeft } from '@tabler/icons-react';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import React, { createContext, useContext, useRef, useState } from 'react';

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
    taskRefs: React.RefObject<Record<string, HTMLDivElement>>;
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

    const columnRefs = useRef<Record<string, HTMLDivElement>>({});
    const taskRefs = useRef<Record<string, HTMLDivElement>>({});

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
        setTaskDragState((prev) => ({
            ...prev,
            overColumn: overColumnId,
            insertionIndex: insertIndex,
        }));
    };

    const handleDragTaskEnd: BoardContextType['onDragTaskEnd'] = () => {
        if (
            !taskDragState.draggedItem ||
            !taskDragState.fromColumn ||
            !taskDragState.overColumn ||
            taskDragState.insertionIndex === null
        )
            return;

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
                taskRefs: taskRefs,
            }}>
            <div className="relative grow">
                <div className="absolute inset-0 flex overflow-x-auto">
                    <div className="flex grow px-8 pt-4 pb-8">
                        <Reorder.Group
                            axis="x"
                            as="div"
                            className="flex h-full items-start gap-4"
                            values={columns}
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
                                    : columns.map((column) => (
                                          <motion.div
                                              key={column.id}
                                              layout
                                              {...getCardMotionProps()}
                                              className="flex h-full">
                                              <Reorder.Item
                                                  layout
                                                  ref={(el) => {
                                                      columnRefs.current[
                                                          column.id
                                                      ] = el;
                                                  }}
                                                  as="div"
                                                  className="grow"
                                                  value={column}
                                                  key={column.id} // Prefer stable ID
                                                  drag>
                                                  <ColumnCard column={column} />
                                              </Reorder.Item>
                                          </motion.div>
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
