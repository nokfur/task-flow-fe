import BoardHeading from '@/components/common/board/BoardHeading';
import { BoardTable } from '@/components/common/board/BoardTable';
import useBoardUpdaters from '@/hooks/useBoardUpdaters';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { Board, Column, Label, Task } from '@/interfaces/interfaces';
import type {
    ColumnPositionUpdateRequest,
    TaskReorderUpdateRequest,
} from '@/interfaces/requestInterfaces';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useBoardSignalR from '@/hooks/useBoardSignalR';

const UserBoardUpdatePage = () => {
    const navigate = useNavigate();
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

    const fetchBoard = useCallback(
        (loadingRequired: boolean) => {
            if (loadingRequired) setLoading(true);

            apiEndPoints.boards
                .getDetail(boardId)
                .then(({ data }: { data: Board }) => {
                    setBoard(data);
                })
                .catch((error) => {
                    if (error.status === 403) return navigate('/');
                })
                .finally(() => setLoading(false));
        },
        [boardId],
    );

    useEffect(() => {
        fetchBoard(true);
    }, [boardId, fetchBoard]);

    const boardConnection = useBoardSignalR(boardId, () => {
        fetchBoard(false);
    });

    const notifyBoardUpdated = () => {
        boardConnection
            ?.invoke('NotifyBoardUpdated', board.id)
            .catch((err) => console.error('Notify failed', err));
    };

    const handleUpdateBoard = (val: string, type: 'title' | 'description') => {
        const updated: Board = { ...board, [type]: val };
        apiEndPoints.boards.update(boardId, updated).then(() => {
            setBoard(updated);
            notifyBoardUpdated();
        });
    };

    const handleAddColumn = (newColumn: Column) => {
        apiEndPoints.columns
            .add(boardId, newColumn)
            .then(({ data }: { data: Column }) => {
                boardUpdaters.addColumn(data);
                notifyBoardUpdated();
            });
    };

    const handleUpdateColumn = (updatedColumn: Column) => {
        apiEndPoints.columns
            .update(updatedColumn.id, updatedColumn)
            .then(() => {
                boardUpdaters.updateColumn(updatedColumn);
                notifyBoardUpdated();
            });
    };

    const handleRemoveColumn = (id: string) => {
        apiEndPoints.columns.delete(id).then(() => {
            boardUpdaters.removeColumn(id);
            notifyBoardUpdated();
        });
    };

    const handleAddTask = (columnId: string, newTask: Task) => {
        apiEndPoints.tasks
            .add(columnId, newTask)
            .then(({ data }: { data: Task }) => {
                boardUpdaters.addTask(columnId, data);
                notifyBoardUpdated();
            });
    };

    const handleUpdateTask = (updatedTask: Task, columnId: string) => {
        apiEndPoints.tasks.update(updatedTask.id, updatedTask).then(() => {
            boardUpdaters.updateTask(updatedTask, columnId);
            notifyBoardUpdated();
        });
    };

    const handleRemoveTask = (taskId: string, columnId: string) => {
        apiEndPoints.tasks.delete(taskId).then(() => {
            boardUpdaters.removeTask(taskId, columnId);
            notifyBoardUpdated();
        });
    };

    const handleRemoveAllTasks = (columnId: string) => {
        apiEndPoints.tasks.deleteAll(columnId).then(() => {
            boardUpdaters.removeAllTasks(columnId);
            notifyBoardUpdated();
        });
    };

    const handleAddLabel = (label: Label) => {
        apiEndPoints.labels
            .add(boardId, label)
            .then(({ data }: { data: Label }) => {
                boardUpdaters.addLabel(data);
                notifyBoardUpdated();
            });
    };

    const handleUpdateLabel = (updatedLabel: Label) => {
        apiEndPoints.labels.update(updatedLabel.id, updatedLabel).then(() => {
            boardUpdaters.updateLabel(updatedLabel);
            notifyBoardUpdated();
        });
    };

    const handleRemoveLabel = (labelId: string) => {
        apiEndPoints.labels.delete(labelId).then(() => {
            boardUpdaters.removeLabel(labelId);
            notifyBoardUpdated();
        });
    };

    const handleToggleLabel = (
        columnId: string,
        taskId: string,
        labelId: string,
    ) => {
        apiEndPoints.tasks.toggleLabel(taskId, labelId).then(() => {
            boardUpdaters.toggleLabel(columnId, taskId, labelId);
            notifyBoardUpdated();
        });
    };

    const handleReorderColumns = (newOrder: Column[]) => {
        const payload: ColumnPositionUpdateRequest[] = newOrder.map((c, i) => ({
            id: c.id,
            position: i,
        }));

        apiEndPoints.columns.updatePositions(payload).then(() => {
            boardUpdaters.reorderColumn(newOrder);
            notifyBoardUpdated();
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
            notifyBoardUpdated();
        });
    };

    return (
        <div className="flex grow flex-col bg-slate-50">
            <BoardHeading
                board={board}
                loading={loading}
                onUpdateBoard={handleUpdateBoard}
            />

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
