import { BoardTable } from '@/components/common/board/BoardTable';
import EditableText from '@/components/common/input/EditableText';
import useBoardUpdaters from '@/hooks/board-updaters';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { Board, Column, Label, Task } from '@/interfaces/interfaces';
import type {
    ColumnPositionUpdateRequest,
    TaskReorderUpdateRequest,
} from '@/interfaces/requestInterfaces';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { IconFilter, IconInfoCircle, IconUserPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserBoardUpdatePage = () => {
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
        <div className="flex grow flex-col bg-slate-50">
            <div className="w-full bg-white/50 backdrop-blur-sm">
                <div className="border-b border-gray-200 px-8 py-2">
                    <div className="flex items-center justify-between">
                        <div>
                            {loading ? (
                                <Skeleton className="h-10 w-36" />
                            ) : (
                                <div className="w-fit rounded-md duration-200 hover:bg-gray-200">
                                    <EditableText
                                        placeholder="Board title (e.g, Website Redesign Project)"
                                        value={board.title}
                                        onSave={(val) =>
                                            handleUpdateBoard(val, 'title')
                                        }
                                        className="px-3! py-1! text-lg! font-medium"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <Tooltip title="Filter tasks">
                                <IconButton className="rounded-md hover:bg-gray-200">
                                    <IconFilter className="size-5" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="About this board">
                                <IconButton className="rounded-md hover:bg-gray-200">
                                    <IconInfoCircle className="size-5" />
                                </IconButton>
                            </Tooltip>

                            <Button
                                className="bg-violet-600 px-4 py-1 font-medium text-gray-50 normal-case transition duration-200 hover:bg-violet-700 hover:shadow-md"
                                startIcon={<IconUserPlus className="size-5" />}>
                                Share
                            </Button>
                        </div>
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
    );
};

export default UserBoardUpdatePage;
