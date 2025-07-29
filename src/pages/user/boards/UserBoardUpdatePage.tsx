import BoardHeading from '@/components/common/board/board-heading/BoardHeading';
import { BoardTable } from '@/components/common/board/BoardTable';
import useBoardUpdaters from '@/hooks/board-updaters';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { Board, Column, Label, Task } from '@/interfaces/interfaces';
import type {
    ColumnPositionUpdateRequest,
    TaskReorderUpdateRequest,
} from '@/interfaces/requestInterfaces';
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
