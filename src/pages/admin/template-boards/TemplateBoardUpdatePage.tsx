import { BoardTable } from '@/components/common/board/BoardTable';
import EditableText from '@/components/common/input/EditableText';
import useBoardUpdaters from '@/hooks/useBoardUpdaters';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { Board, Column, Label, Task } from '@/interfaces/interfaces';
import type {
    ColumnPositionUpdateRequest,
    TaskReorderUpdateRequest,
} from '@/interfaces/requestInterfaces';
import Skeleton from '@mui/material/Skeleton';
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
    }, [boardId]);

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
        <div className="-mx-6 -my-8 flex grow bg-slate-50 md:-mx-12">
            <div className="flex grow flex-col">
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

                <BoardTable
                    loading={loading}
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
            </div>
        </div>
    );
};

export default TemplateBoardUpdatePage;
