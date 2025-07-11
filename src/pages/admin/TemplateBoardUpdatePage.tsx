import { BoardTable } from '@/components/common/board/BoardTable';
import EditableText from '@/components/common/input/EditableText';
import useBoardUpdaters from '@/hooks/board-updaters';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { Board, Column, Label, Task } from '@/interfaces/interfaces';
import type {
    ColumnPositionUpdateRequest,
    TaskReorderUpdateRequest,
} from '@/interfaces/requestInterfaces';
import Skeleton from '@mui/material/Skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TemplateBoardUpdatePage = () => {
    const apiEndPoints = useApiEndpoints();
    const { boardId = '' } = useParams();

    const [board, setBoard] = useState<Board>({
        id: '',
        title: '',
        description: '',
        columns: [],
        labels: [],
    });

    const [loading, setLoading] = useState(false);

    const boardUpdaters = useBoardUpdaters(setBoard);

    useEffect(() => {
        setLoading(true);
        apiEndPoints.boards
            .getDetail(boardId)
            .then(({ data }: { data: Board }) => {
                setBoard(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleUpdateBoard = (val: string, type: 'title' | 'description') => {
        const updated: Board = { ...board, [type]: val };
        apiEndPoints.boards.update(boardId, updated).then(() => {
            setBoard(updated);
        });
    };

    const handleAddColumn = (newColumn: Column) => {
        apiEndPoints.columns
            .add(boardId, newColumn)
            .then(({ data }: { data: Column }) => {
                boardUpdaters.addColumn(data);
            });
    };

    const handleUpdateColumn = (updatedColumn: Column) => {
        apiEndPoints.columns
            .update(updatedColumn.id, updatedColumn)
            .then(() => {
                boardUpdaters.updateColumn(updatedColumn);
            });
    };

    const handleRemoveColumn = (id: string) => {
        apiEndPoints.columns.delete(id).then(() => {
            boardUpdaters.removeColumn(id);
        });
    };

    const handleAddTask = (columnId: string, newTask: Task) => {
        apiEndPoints.tasks
            .add(columnId, newTask)
            .then(({ data }: { data: Task }) => {
                boardUpdaters.addTask(columnId, data);
            });
    };

    const handleUpdateTask = (updatedTask: Task, columnId: string) => {
        apiEndPoints.tasks.update(updatedTask.id, updatedTask).then(() => {
            boardUpdaters.updateTask(updatedTask, columnId);
        });
    };

    const handleRemoveTask = (taskId: string, columnId: string) => {
        apiEndPoints.tasks.delete(taskId).then(() => {
            boardUpdaters.removeTask(taskId, columnId);
        });
    };

    const handleRemoveAllTasks = (columnId: string) => {
        apiEndPoints.tasks.deleteAll(columnId).then(() => {
            boardUpdaters.removeAllTasks(columnId);
        });
    };

    const handleAddLabel = (label: Label) => {
        apiEndPoints.labels
            .add(boardId, label)
            .then(({ data }: { data: Label }) => {
                boardUpdaters.addLabel(data);
            });
    };

    const handleUpdateLabel = (updatedLabel: Label) => {
        apiEndPoints.labels.update(updatedLabel.id, updatedLabel).then(() => {
            boardUpdaters.updateLabel(updatedLabel);
        });
    };

    const handleRemoveLabel = (labelId: string) => {
        apiEndPoints.labels.delete(labelId).then(() => {
            boardUpdaters.removeLabel(labelId);
        });
    };

    const handleToggleLabel = (
        columnId: string,
        taskId: string,
        labelId: string,
    ) => {
        apiEndPoints.tasks.toggleLabel(taskId, labelId).then(() => {
            boardUpdaters.toggleLabel(columnId, taskId, labelId);
        });
    };

    const handleReorderColumns = (newOrder: Column[]) => {
        const payload: ColumnPositionUpdateRequest[] = newOrder.map((c, i) => ({
            id: c.id,
            position: i,
        }));

        apiEndPoints.columns.updatePositions(payload).then(() => {
            boardUpdaters.reorderColumn(newOrder);
        });
    };

    const handleReorderTask = (
        task: Task,
        sourceColumnId: string,
        targetColumnId: string,
        targetIndex: number,
    ) => {
        const payload: TaskReorderUpdateRequest = {
            taskId: task.id,
            sourceColumnId,
            targetColumnId,
            targetIndex,
        };

        apiEndPoints.tasks.reorder(payload).then(() => {
            boardUpdaters.reorderTask(
                task,
                sourceColumnId,
                targetColumnId,
                targetIndex,
            );
        });
    };

    return (
        <div className="-mx-6 -my-8 min-h-screen bg-slate-50 md:-mx-12">
            <div className="space-y-4">
                <div className="w-full bg-white">
                    <div className="border-b border-gray-200 px-8 py-4">
                        <h1 className="text-3xl font-bold">
                            Manage Board Template
                        </h1>

                        <div className="mt-4 w-full space-y-4 ps-8">
                            {loading ? (
                                <>
                                    <Skeleton className="m-0 h-10 w-36" />
                                    <Skeleton className="h-16 w-full" />
                                </>
                            ) : (
                                <>
                                    <div className="mb-1 max-w-84">
                                        <EditableText
                                            placeholder="Board title (e.g, Website Redesign Project)"
                                            value={board.title}
                                            onSave={(val) =>
                                                handleUpdateBoard(val, 'title')
                                            }
                                            className="text-lg font-medium"
                                        />
                                    </div>

                                    <EditableText
                                        placeholder="Explain when and how teams should use this template..."
                                        value={board.description}
                                        onSave={(val) =>
                                            handleUpdateBoard(
                                                val,
                                                'description',
                                            )
                                        }
                                        isArea
                                        className="text-sm"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="min-h-screen overflow-x-auto px-8 pt-4">
                    <div className="flex min-w-max items-start gap-4">
                        {loading ? (
                            <div className="flex items-start gap-4">
                                <AnimatePresence mode="sync">
                                    {Array.from({ length: 4 }).map(
                                        (_, index) => (
                                            <motion.div
                                                key={index}
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
                                        ),
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <BoardTable
                                columns={board.columns}
                                labels={board.labels}
                                onReorderColumn={handleReorderColumns}
                                onAddColumn={handleAddColumn}
                                onUpdateColumn={handleUpdateColumn}
                                onRemoveColumn={handleRemoveColumn}
                                onAddTask={handleAddTask}
                                onUpdateTask={handleUpdateTask}
                                onRemoveTask={handleRemoveTask}
                                onRemoveAllTasks={handleRemoveAllTasks}
                                onToggleLabel={handleToggleLabel}
                                onReorderTask={handleReorderTask}
                                onAddLabel={handleAddLabel}
                                onUpdateLabel={handleUpdateLabel}
                                onRemoveLabel={handleRemoveLabel}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateBoardUpdatePage;
