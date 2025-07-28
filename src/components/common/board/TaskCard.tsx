import BoardLabelManagementModal from '@/components/common/board/modal/BoardLabelManagementModal';
import TaskDatePickerModal from '@/components/common/board/modal/TaskDatePickerModal';
import { useBoardContextProvider } from '@/components/common/board/BoardTable';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import EditableText from '@/components/common/input/EditableText';
import { TaskPriorityColor, type TaskPriority } from '@/constants/constants';
import type { Label, Task } from '@/interfaces/interfaces';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import {
    IconClockHour5,
    IconDots,
    IconTag,
    IconTrash,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const TaskCard: React.FC<{
    task: Task;
    columnId?: string;
}> = React.memo(({ task, columnId = '' }) => {
    const {
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
    const [openDueDatePicker, setOpenDueDatePicker] = useState(false);

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
        type: 'title' | 'description' | 'priority' | 'dueDate',
        value: string | TaskPriority | Date | null,
    ) => {
        const updatedTask = { ...task, [type]: value };

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

            <TaskDatePickerModal
                open={openDueDatePicker}
                onClose={() => setOpenDueDatePicker(false)}
                onConfirm={(date) => {
                    handleUpdateTask('dueDate', date);
                }}
                currentDate={task.dueDate}
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
                                    setOpenDueDatePicker(true);
                                }}>
                                <IconClockHour5 className="size-5" />
                                <span className="text-sm">Pick Due Date</span>
                            </MenuItem>

                            <MenuItem
                                className="space-x-2 duration-300"
                                onClick={() => {
                                    setOpenLabelManagementModal(true);
                                }}>
                                <IconTag className="size-5" />
                                <span className="text-sm">Manage Labels</span>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                className="space-x-2 duration-300"
                                onClick={() => {
                                    setOpenRemoveConfirmation(true);
                                    handleClose();
                                }}>
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

                    {task.dueDate &&
                        (() => {
                            const isOverdue = dayjs(task.dueDate).isBefore(
                                dayjs(),
                            );
                            const fromNow = dayjs(task.dueDate).fromNow();
                            return (
                                <Tooltip
                                    title={
                                        isOverdue
                                            ? `Overdue ${fromNow}`
                                            : `Due ${fromNow}`
                                    }>
                                    <div
                                        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        <IconClockHour5 className="size-5" />
                                        <span>
                                            {dayjs(task.dueDate).format(
                                                'MMM D, YYYY',
                                            )}
                                        </span>
                                    </div>
                                </Tooltip>
                            );
                        })()}
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
