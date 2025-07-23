import { useBoardContextProvider } from '@/components/common/board/BoardTable';
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
import React, { useState } from 'react';

const ColumnCard: React.FC<{
    column: Column;
}> = React.memo(({ column }) => {
    const {
        onUpdateColumn,
        onRemoveColumn,
        onAddTask,
        onRemoveAllTasks,

        taskDragState,
        taskRefs,
        onDragTask,
        onDragTaskEnd,
        onDragTaskStart,
    } = useBoardContextProvider();

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

    const InsertionIndicator = ({
        index,
        columnId,
    }: {
        index: number;
        columnId: string;
    }) => {
        if (
            taskDragState.fromColumn === columnId &&
            index > (taskDragState.originalIndex || 0)
        )
            index--;

        // show at index if task is over this column, and index is not original index if moving in original column
        const shouldShow =
            taskDragState.overColumn === columnId &&
            taskDragState.insertionIndex === index &&
            (taskDragState.fromColumn !== columnId ||
                taskDragState.originalIndex !== index);

        return (
            <AnimatePresence mode="wait">
                {shouldShow && (
                    <motion.div
                        layoutId={`task-indicator`}
                        transition={{ duration: 0.15 }}>
                        <div className="relative z-40 h-26 w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-100"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
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
                className="h-full">
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

                        <div className="space-y-2 overflow-y-auto p-2">
                            <AnimatePresence mode="sync">
                                <div className="flex flex-col gap-2">
                                    {column.tasks.map((task, index) => (
                                        <motion.div
                                            key={`${column.id}-${task.id}`}
                                            className="space-y-2"
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
                                            <InsertionIndicator
                                                index={index}
                                                columnId={column.id}
                                            />

                                            <motion.div
                                                className="relative"
                                                ref={(el: HTMLDivElement) => {
                                                    taskRefs.current[task.id] =
                                                        el;
                                                }}
                                                layoutId={task.id}
                                                animate={{
                                                    scale: 1,
                                                    x: 0,
                                                    y: 0,
                                                    // zIndex: 0,
                                                    // zIndex causes modal error
                                                }}
                                                drag
                                                dragSnapToOrigin
                                                whileDrag={{
                                                    scale: 1.05,
                                                    zIndex: 50,
                                                }}
                                                onDragStart={() =>
                                                    onDragTaskStart(
                                                        task,
                                                        column.id,
                                                        index,
                                                    )
                                                }
                                                onDrag={onDragTask}
                                                onDragEnd={onDragTaskEnd}>
                                                <TaskCard
                                                    task={task}
                                                    columnId={column.id}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>

                                <InsertionIndicator
                                    key={`indicator-${column.id}`}
                                    index={column.tasks.length}
                                    columnId={column.id}
                                />
                            </AnimatePresence>
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
