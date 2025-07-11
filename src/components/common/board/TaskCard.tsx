import BoardLabelManagementModal from '@/components/admin/BoardLabelManagementModal';
import { useBoardContextProvider } from '@/components/common/board/BoardTable';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import EditableText from '@/components/common/input/EditableText';
import { TaskPriorityColor, type TaskPriority } from '@/constants/constants';
import type { Label, Task } from '@/interfaces/interfaces';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { IconDots, IconTag, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

const TaskCard: React.FC<{
    task: Task;
    columnId?: string;
}> = React.memo(({ task, columnId = '' }) => {
    const {
        columns,
        labels,
        onUpdateTask,
        onRemoveTask,
        onAddLabel,
        onUpdateLabel,
        onRemoveLabel,
        onToggleLabel,
    } = useBoardContextProvider();

    const [openLabelManagementModal, setOpenLabelManagementModal] =
        useState(false);
    const [openRemoveConfirmation, setOpenRemoveConfirmation] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRemoveTask = () => {
        handleClose(); // close the menu first

        onRemoveTask(task.id, columnId);
    };

    const handleUpdateTask = (
        type: 'title' | 'description' | 'priority',
        value: string | TaskPriority,
    ) => {
        const columnIndex = columns.findIndex((c) => c.id === columnId);

        let updatedTask: Task | undefined = columns[columnIndex]?.tasks.find(
            (t) => t.id === task.id,
        );
        if (!updatedTask) return;

        updatedTask = { ...updatedTask, [type]: value };

        onUpdateTask(updatedTask, columnId);
    };

    const handleAddLabel = (label: Label) => {
        onAddLabel(label);
    };

    const handleRemoveLabel = (labelId: string) => {
        onRemoveLabel(labelId);
    };

    const handleUpdateLabel = (updatedLabel: Label) => {
        onUpdateLabel(updatedLabel);
    };

    const handleToggleLabel = (labelId: string) => {
        onToggleLabel(columnId, task.id, labelId);
    };

    return (
        <>
            <BoardLabelManagementModal
                open={openLabelManagementModal}
                onClose={() => setOpenLabelManagementModal(false)}
                onAdd={(label) => handleAddLabel(label)}
                onToggle={(labelId) => handleToggleLabel(labelId)}
                onRemove={(labelId) => handleRemoveLabel(labelId)}
                onUpdate={(label) => handleUpdateLabel(label)}
                labels={labels}
                taskLabelIds={task.labels.map((l) => l.id)}
            />

            <ConfirmationDialog
                open={openRemoveConfirmation}
                onClose={() => setOpenRemoveConfirmation(false)}
                onConfirm={handleRemoveTask}
                title="Are you sure to remove this task?"
                description="This will remove this task from the column. There is no undo."
            />

            <div className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-3">
                <div className="flex max-w-full items-center justify-between">
                    <EditableText
                        value={task.title}
                        placeholder="Task title"
                        className="text-sm font-semibold"
                        onSave={(newTitle) =>
                            handleUpdateTask('title', newTitle)
                        }
                    />

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
                                onClick={() => {
                                    setOpenLabelManagementModal(true);
                                    handleClose();
                                }}>
                                <IconTag className="size-5" />
                                <span className="text-sm">Manage Labels</span>
                            </MenuItem>
                            <MenuItem
                                className="space-x-2 duration-300"
                                onClick={() => setOpenRemoveConfirmation(true)}>
                                <IconTrash className="size-5" />
                                <span className="text-sm">Remove Task</span>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>

                <EditableText
                    value={task.description}
                    placeholder="Task description"
                    className="mt-1 text-xs text-gray-600"
                    onSave={(newDescription) =>
                        handleUpdateTask('description', newDescription)
                    }
                    isArea
                />
                <div className="mt-3 mb-2 flex items-center gap-4">
                    <Select
                        value={task.priority}
                        onChange={(e) =>
                            handleUpdateTask('priority', e.target.value)
                        }
                        variant="standard"
                        disableUnderline
                        className={`${TaskPriorityColor[task.priority]} h-6 rounded-xl px-3 pt-0.5 text-xs font-medium`}>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </Select>

                    <p className="text-xs">
                        <span className="font-medium">Due: </span>
                        {task.dueDate && dayjs(task.dueDate).fromNow()}
                    </p>
                </div>

                <div className="flex flex-wrap items-start gap-2">
                    <AnimatePresence mode="sync">
                        {task.labels.map((tl) => (
                            <motion.div
                                key={tl.id}
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
                                transition={{ duration: 0.15 }}>
                                <div
                                    className="h-6 rounded-lg px-3 pt-0.5 text-center text-xs font-medium text-gray-50"
                                    style={{ backgroundColor: tl.color }}>
                                    {tl.name}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
});

export default TaskCard;
