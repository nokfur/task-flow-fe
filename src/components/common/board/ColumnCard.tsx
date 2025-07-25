import { useBoardContextProvider } from '@/components/common/board/BoardTable';
import InsertionIndicator from '@/components/common/board/InsertionIndicator';
import TaskCard from '@/components/common/board/TaskCard';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import EditableText from '@/components/common/input/EditableText';
import type { Column, Task } from '@/interfaces/interfaces';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import {
    IconArrowsDiagonalMinimize,
    IconArrowsMoveHorizontal,
    IconCheckupList,
    IconDots,
    IconTrash,
    IconTrashX,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

const ColumnCard: React.FC<{
    column: Column;
}> = React.memo(({ column }) => {
    const {
        onUpdateColumn,
        onRemoveColumn,
        onAddTask,
        onRemoveAllTasks,
        taskDragState,
        onDragTask,
        onDragTaskEnd,
        onDragTaskStart,
    } = useBoardContextProvider();

    const taskRefs = useRef<Record<string, HTMLDivElement>>({});

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openRemoveConfirmation, setOpenRemoveConfirmation] = useState(false);
    const [openRemoveAllTaskConfirmation, setOpenRemoveAllTaskConfirmation] =
        useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRemoveColumn = () => {
        handleClose(); // close the menu first

        onRemoveColumn(column.id);
    };

    const handleUpdateColumnTitle = (newTitle: string) => {
        onUpdateColumn({ ...column, title: newTitle });
    };

    const handleAddTask = () => {
        const random = Math.random();

        const newTask: Task = {
            id: crypto.randomUUID(),
            title: 'New Task',
            description: 'Example of how tasks appear',
            priority: random > 0.7 ? 'High' : random > 0.4 ? 'Medium' : 'Low',
            labels: [],
        };

        onAddTask(column.id, newTask);
    };

    const handleRemoveAllTasks = () => {
        onRemoveAllTasks(column.id);
    };

    const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();

        const visibleTasks = column.tasks.filter(
            (t) => t.id !== taskDragState.draggedItem?.id,
        );

        let insertIndex = visibleTasks.length; // Default to end

        visibleTasks.forEach((task, index) => {
            const taskElement = taskRefs.current[task.id];
            if (taskElement) {
                const taskRect = taskElement.getBoundingClientRect();
                const taskMiddle =
                    window.scrollY + taskRect.top + taskRect.height / 2;

                // Get smallest index where current pointer is less than task position
                if (event.clientY < taskMiddle && index < insertIndex) {
                    insertIndex = index;
                }
            }
        });

        onDragTask(column.id, insertIndex);
    };

    const handleDrop = () => {
        onDragTaskEnd();
    };

    const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();
        // onDragTaskLeave();
    };

    return (
        <>
            <ConfirmationDialog
                open={openRemoveConfirmation}
                onClose={() => setOpenRemoveConfirmation(false)}
                onConfirm={handleRemoveColumn}
                title="Are you sure to remove this column?"
                description="This will remove this column from the board. There is no undo."
            />

            <ConfirmationDialog
                open={openRemoveAllTaskConfirmation}
                onClose={() => setOpenRemoveAllTaskConfirmation(false)}
                onConfirm={handleRemoveAllTasks}
                title="Are you sure to remove all the tasks this column?"
                description="This will remove all the tasks from this column from the board. There is no undo."
            />

            <motion.div
                animate={{ width: isCollapsed ? 56 : 'auto' }}
                className="h-full"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}>
                {isCollapsed ? (
                    <div
                        className="flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 pb-4"
                        style={{ writingMode: 'vertical-rl' }}>
                        <IconButton
                            className="rounded-lg"
                            onClick={() => setIsCollapsed(false)}>
                            <Tooltip title="Expand column">
                                <IconArrowsMoveHorizontal className="size-4.5" />
                            </Tooltip>
                        </IconButton>
                        <p className="text-sm font-semibold">{column.title}</p>
                        <p className="text-sm">{column.tasks.length}</p>
                    </div>
                ) : (
                    <div className="flex max-h-full w-xs cursor-pointer flex-col rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center justify-between rounded-t-xl bg-slate-100 px-4 py-2">
                            <EditableText
                                value={column.title}
                                placeholder="Column title (e.g, To Do, In Progress, Done)"
                                className="font-semibold"
                                onSave={handleUpdateColumnTitle}
                            />

                            <div className="flex items-center gap-2">
                                <IconButton
                                    className="rounded-lg"
                                    onClick={() => setIsCollapsed(true)}>
                                    <Tooltip title="Collapse column">
                                        <IconArrowsDiagonalMinimize className="size-4.5" />
                                    </Tooltip>
                                </IconButton>

                                <div>
                                    <IconButton
                                        className="rounded-lg"
                                        onClick={handleClick}>
                                        <IconDots className="size-4.5" />
                                    </IconButton>

                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        transformOrigin={{
                                            horizontal: 'right',
                                            vertical: 'top',
                                        }}
                                        anchorOrigin={{
                                            horizontal: 'right',
                                            vertical: 'bottom',
                                        }}>
                                        <MenuItem
                                            className="space-x-2 duration-300"
                                            onClick={handleAddTask}>
                                            <IconCheckupList className="size-5" />
                                            <span className="text-sm">
                                                Add Task
                                            </span>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem
                                            className="space-x-2 duration-300"
                                            onClick={() =>
                                                setOpenRemoveConfirmation(true)
                                            }>
                                            <IconTrash className="size-5" />
                                            <span className="text-sm">
                                                Remove Column
                                            </span>
                                        </MenuItem>
                                        <MenuItem
                                            className="space-x-2 duration-300"
                                            onClick={() =>
                                                setOpenRemoveAllTaskConfirmation(
                                                    true,
                                                )
                                            }>
                                            <IconTrashX className="size-5" />
                                            <span className="text-sm">
                                                Clear All Tasks
                                            </span>
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-hidden overflow-y-auto p-2">
                            <div className="relative flex flex-col gap-2">
                                <AnimatePresence mode="sync">
                                    {column.tasks.map((task, index) => (
                                        <motion.div
                                            key={`${task.id}`}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="relative flex flex-col gap-2">
                                            <InsertionIndicator
                                                index={index}
                                                columnId={column.id}
                                            />

                                            <motion.div
                                                layoutId={task.id}
                                                ref={(el: HTMLDivElement) => {
                                                    taskRefs.current[task.id] =
                                                        el;
                                                }}
                                                draggable
                                                onPointerDownCapture={(
                                                    e: React.PointerEvent,
                                                ) => e.stopPropagation()}
                                                onDragStart={() =>
                                                    onDragTaskStart(
                                                        task,
                                                        column.id,
                                                        index,
                                                    )
                                                }>
                                                <TaskCard
                                                    task={task}
                                                    columnId={column.id}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    ))}

                                    <InsertionIndicator
                                        index={column.tasks.length}
                                        columnId={column.id}
                                    />
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="p-2 pt-0">
                            <Button
                                className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 px-4 py-6 text-gray-500 normal-case hover:bg-gray-100/50"
                                startIcon={<IconCheckupList />}
                                onClick={handleAddTask}>
                                Add task
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    );
});

export default ColumnCard;
