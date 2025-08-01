import type { Board, Column, Label, Task } from '@/interfaces/interfaces';
import type { SetStateAction } from 'react';

function useBoardUpdaters(setBoard: React.Dispatch<SetStateAction<Board>>) {
    return {
        addColumn: (newColumn: Column) => {
            setBoard((prev) => ({
                ...prev,
                columns: [...prev.columns, { ...newColumn }],
            }));
        },

        updateColumn: (updatedColumn: Column) => {
            setBoard((prev) => {
                const updatedColumns = prev.columns.map((c) =>
                    c.id === updatedColumn.id ? { ...updatedColumn } : c,
                );

                return { ...prev, columns: updatedColumns };
            });
        },

        removeColumn: (id: string) => {
            setBoard((prev) => ({
                ...prev,
                columns: prev.columns.filter((c) => c.id !== id),
            }));
        },

        addTask: (columnId: string, newTask: Task) => {
            setBoard((prev) => {
                const updatedColumns = [...prev.columns];
                const columnIndex = updatedColumns.findIndex(
                    (c) => c.id === columnId,
                );

                if (columnIndex !== -1) {
                    updatedColumns[columnIndex] = {
                        ...updatedColumns[columnIndex],
                        tasks: [
                            ...updatedColumns[columnIndex].tasks,
                            { ...newTask },
                        ],
                    };
                }

                return { ...prev, columns: updatedColumns };
            });
        },

        updateTask: (updatedTask: Task, columnId: string) => {
            setBoard((prev) => {
                const updatedColumns = [...prev.columns];
                const columnIndex = updatedColumns.findIndex(
                    (c) => c.id === columnId,
                );
                if (columnIndex === -1) return prev;

                const taskIndex = updatedColumns[columnIndex].tasks.findIndex(
                    (t) => t.id === updatedTask.id,
                );
                if (taskIndex === -1) return prev;

                updatedColumns[columnIndex].tasks[taskIndex] = {
                    ...updatedTask,
                };

                return { ...prev, columns: updatedColumns };
            });
        },

        removeTask: (taskId: string, columnId: string) => {
            setBoard((prev) => {
                const updatedColumns = [...prev.columns];
                const columnIndex = updatedColumns.findIndex(
                    (c) => c.id === columnId,
                );

                if (columnIndex !== -1) {
                    updatedColumns[columnIndex].tasks = updatedColumns[
                        columnIndex
                    ].tasks.filter((t) => t.id !== taskId);
                }

                return { ...prev, columns: updatedColumns };
            });
        },

        removeAllTasks: (columnId: string) => {
            setBoard((prev) => {
                const updatedColumns = [...prev.columns];
                const columnIndex = updatedColumns.findIndex(
                    (c) => c.id === columnId,
                );

                if (updatedColumns[columnIndex]) {
                    updatedColumns[columnIndex].tasks = [];
                }

                return { ...prev, columns: updatedColumns };
            });
        },

        addLabel: (label: Label) => {
            setBoard((prev) => {
                return { ...prev, labels: [...prev.labels, { ...label }] };
            });
        },

        updateLabel: (updatedLabel: Label) => {
            setBoard((prev) => {
                const updatedLabels = prev.labels.map((l) =>
                    l.id === updatedLabel.id ? updatedLabel : l,
                );

                const updatedColumns = prev.columns.map((column) => ({
                    ...column,
                    tasks: column.tasks.map((task) => ({
                        ...task,
                        labels: task.labels.map((l) =>
                            l.id === updatedLabel.id ? updatedLabel : l,
                        ),
                    })),
                }));

                return {
                    ...prev,
                    columns: updatedColumns,
                    labels: updatedLabels,
                };
            });
        },

        removeLabel: (labelId: string) => {
            setBoard((prev) => {
                const updatedLabels = prev.labels.filter(
                    (l) => l.id !== labelId,
                );

                const updatedColumns = prev.columns.map((column) => ({
                    ...column,
                    tasks: column.tasks.map((task) => ({
                        ...task,
                        labels: task.labels.filter(
                            (label) => label.id !== labelId,
                        ),
                    })),
                }));

                return {
                    ...prev,
                    columns: updatedColumns,
                    labels: updatedLabels,
                };
            });
        },

        toggleLabel: (columnId: string, taskId: string, labelId: string) => {
            setBoard((prev) => {
                const label = prev.labels.find((l) => l.id === labelId);
                if (!label) return prev;

                const updatedColumns = prev.columns.map((column) => ({
                    ...column,
                    tasks:
                        column.id === columnId
                            ? column.tasks.map((task) =>
                                  task.id === taskId
                                      ? {
                                            ...task,
                                            labels: task.labels.some(
                                                (l) => l.id === labelId,
                                            )
                                                ? task.labels.filter(
                                                      (l) => l.id !== labelId,
                                                  )
                                                : [...task.labels, label].sort(
                                                      (a, b) =>
                                                          a.name.localeCompare(
                                                              b.name,
                                                          ),
                                                  ),
                                        }
                                      : task,
                              )
                            : column.tasks,
                }));

                return { ...prev, columns: updatedColumns };
            });
        },

        reorderColumn: (newOrder: Column[]) => {
            setBoard((prev) => ({ ...prev, columns: newOrder }));
        },

        reorderTask: (
            task: Task,
            sourceColumnId: string,
            targetColumnId: string,
            targetIndex: number,
        ) => {
            setBoard((prev) => {
                const updatedColumns = prev.columns.map((column) => {
                    let updatedTasks = [...column.tasks];

                    if (column.id === sourceColumnId) {
                        updatedTasks = updatedTasks.filter(
                            (t) => t.id !== task.id,
                        );

                        // Reassign positions
                        updatedTasks.forEach((t, i) => (t.position = i));
                    }

                    if (column.id === targetColumnId) {
                        updatedTasks.splice(targetIndex, 0, { ...task });

                        // Reassign positions
                        updatedTasks.forEach((t, i) => (t.position = i));
                    }

                    return { ...column, tasks: updatedTasks };
                });

                return { ...prev, columns: updatedColumns };
            });
        },
    };
}

export default useBoardUpdaters;
