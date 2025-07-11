import ColumnCard from '@/components/common/board/ColumnCard';
import type { Column, Label, Task } from '@/interfaces/interfaces';
import Button from '@mui/material/Button';
import { IconColumnInsertLeft } from '@tabler/icons-react';
import {
    AnimatePresence,
    Reorder,
    type PanInfo,
    type Point,
} from 'framer-motion';
import { createContext, useContext, useRef, useState } from 'react';

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
    onDragTask: (
        _: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
    ) => void;

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
    const { columns, onAddColumn, onReorderColumn, onReorderTask } = props;

    const [taskDragState, setTaskDragState] = useState<TaskDragState>({
        draggedItem: null,
        fromColumn: null,
        overColumn: null,
        insertionIndex: null,
        originalIndex: null,
    });

    const columnRefs = useRef<Record<string, HTMLDivElement>>({});
    const taskRefs = useRef<Record<string, HTMLDivElement>>({});

    const handleDragTaskStart = (
        item: Task,
        fromColumnId: string,
        index: number,
    ) => {
        setTaskDragState({
            draggedItem: item,
            fromColumn: fromColumnId,
            overColumn: fromColumnId,
            insertionIndex: index,
            originalIndex: index,
        });
    };

    const handleDragTask = (
        _: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo,
    ) => {
        if (!taskDragState.draggedItem) return;

        // Get the drop target column
        const dropInfo = getDropTargetInfo(info.point);

        setTaskDragState((prev) => ({
            ...prev,
            overColumn: dropInfo.columnId,
            insertionIndex: dropInfo.insertIndex,
        }));
    };

    const handleDragTaskEnd = () => {
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

    const getDropTargetInfo = (
        point: Point,
    ): { columnId: string | null; insertIndex: number } => {
        for (const [columnId, columnRef] of Object.entries(
            columnRefs.current,
        )) {
            if (!columnRef) continue;

            const columnRect = columnRef.getBoundingClientRect();
            const buffer = 0;

            if (
                point.x >= columnRect.left - buffer &&
                point.x <= columnRect.right + buffer
            ) {
                // Find the insertion index within this column
                const column = columns.find((c) => c.id === columnId);
                if (!column) return { columnId, insertIndex: 0 };

                const visibleTasks = column.tasks.filter(
                    (t) => t.id !== taskDragState.draggedItem?.id,
                );

                let insertIndex = visibleTasks.length; // Default to end

                // Check each task's position to find insertion point
                visibleTasks.forEach((task, index) => {
                    const taskElement = taskRefs.current[task.id];
                    if (taskElement) {
                        const taskRect = taskElement.getBoundingClientRect();
                        const taskMiddle =
                            window.scrollY + taskRect.top + taskRect.height / 2;

                        // Get smallest index where current pointer is less than task position
                        if (point.y < taskMiddle && index < insertIndex) {
                            insertIndex = index;
                        }
                    }
                });

                return { columnId, insertIndex };
            }
        }
        return { columnId: null, insertIndex: 0 };
    };

    const handleAddColumn = () => {
        const newColumn: Column = {
            id: crypto.randomUUID(),
            title: 'New Column',
            tasks: [],
        };
        onAddColumn(newColumn);
    };

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
            <Reorder.Group
                axis="x"
                as="div"
                values={columns}
                onReorder={onReorderColumn}>
                <div className="flex items-start gap-4">
                    <AnimatePresence mode="sync">
                        {columns.map((column) => (
                            <Reorder.Item
                                ref={(el) =>
                                    (columnRefs.current[column.id] = el)
                                }
                                as="div"
                                value={column}
                                key={column.id} // Prefer stable ID
                                initial={{
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    width: 'auto',
                                    height: 'auto',
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    width: 0,
                                    height: 0,
                                }}
                                drag
                                whileDrag={{
                                    scale: 1.05,
                                }}>
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
                </div>
            </Reorder.Group>
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
