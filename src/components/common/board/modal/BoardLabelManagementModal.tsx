import InputField from '@/components/common/input/InputField';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
    IconCheck,
    IconEdit,
    IconPlus,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import useModalTransition from '@/hooks/useModalTransition';
import { createPortal } from 'react-dom';

interface LabelTemplate {
    id: string;
    name: string;
    color: string;
}

const LabelCard: React.FC<{
    label: LabelTemplate;
    taskLabelIds?: string[];
    onRemove?: (labelId: string) => void;
    onToggle?: (labelId: string) => void;
    onUpdate?: (label: LabelTemplate) => void;
}> = ({
    label,
    taskLabelIds = [],
    onRemove = () => {},
    onToggle = () => {},
    onUpdate = () => {},
}) => {
    const [updatedLabel, setUpdatedLabel] = useState<LabelTemplate>(label);

    const [openEdit, setOpenEdit] = useState(false);
    const [editVisible, setEditVisible] = useState(false);

    const [openRemoveConfirmation, setOpenRemoveConfirmation] = useState(false);

    useEffect(() => {
        if (openEdit) {
            setTimeout(() => {
                setEditVisible(true);
            }, 10);
        }
    }, [openEdit]);

    const handleCloseEdit = () => {
        setEditVisible(false);
        setTimeout(() => {
            setOpenEdit(false);
        }, 300);
    };

    const handleUpdate = () => {
        onUpdate(updatedLabel);
        handleCloseEdit();
    };

    return (
        <>
            <ConfirmationDialog
                open={openRemoveConfirmation}
                onClose={() => setOpenRemoveConfirmation(false)}
                onConfirm={() => onRemove(label.id)}
                title="Are you sure to remove this label?"
                description="This will remove this label from all cards. There is no undo."
            />

            <div className="flex items-center justify-center gap-2">
                <label className="flex w-full cursor-pointer items-center gap-2">
                    <Checkbox
                        className="size-4"
                        checked={taskLabelIds.includes(label.id)}
                        onChange={() => onToggle(label.id)}
                    />

                    <div
                        className={`h-6 w-full rounded-sm px-3 pt-0.5 text-center text-xs font-medium text-gray-50`}
                        style={{
                            backgroundColor: label.color,
                        }}>
                        {label.name}
                    </div>
                </label>

                <div className="flex items-center justify-center gap-1">
                    <Tooltip title="Edit label">
                        <IconButton
                            className="rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                            onClick={() => setOpenEdit(true)}>
                            <IconEdit className="size-4" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Remove label">
                        <IconButton
                            className="rounded-lg border border-gray-200 bg-red-500 text-gray-50 hover:bg-red-600"
                            onClick={() => setOpenRemoveConfirmation(true)}>
                            <IconTrash className="size-4" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            {openEdit && (
                <div
                    className={`mt-2 flex items-center gap-2 duration-300 ${editVisible ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    <InputField
                        placeholder="Enter label name..."
                        className="py-1 text-sm"
                        value={updatedLabel.name}
                        onChange={(e) =>
                            setUpdatedLabel((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />

                    <input
                        className="h-10 w-34"
                        type="color"
                        value={updatedLabel.color}
                        onChange={(e) =>
                            setUpdatedLabel((prev) => ({
                                ...prev,
                                color: e.target.value,
                            }))
                        }
                    />

                    <div className="flex items-center gap-1">
                        <Tooltip title="Save">
                            <span>
                                <IconButton
                                    className="rounded-lg bg-blue-600 text-gray-50 normal-case hover:bg-blue-700 disabled:pointer-events-none disabled:bg-gray-300"
                                    disabled={
                                        !updatedLabel.name ||
                                        !updatedLabel.color
                                    }
                                    onClick={handleUpdate}>
                                    <IconCheck className="size-4" />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Tooltip title="Cancel">
                            <span>
                                <IconButton
                                    className="rounded-lg border border-gray-200 bg-gray-50 text-gray-500 normal-case hover:bg-gray-100"
                                    onClick={handleCloseEdit}>
                                    <IconX className="size-4" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </div>
                </div>
            )}
        </>
    );
};

const BoardLabelManagementModal: React.FC<{
    open?: boolean;
    onClose?: () => void;
    onAdd?: (label: LabelTemplate) => void;
    onRemove?: (labelId: string) => void;
    onToggle?: (labelId: string) => void;
    onUpdate?: (label: LabelTemplate) => void;
    labels?: LabelTemplate[];
    taskLabelIds?: string[];
}> = ({
    open = false,
    onClose = () => {},
    onAdd = () => {},
    onRemove = () => {},
    onToggle = () => {},
    onUpdate = () => {},
    labels = [],
    taskLabelIds = [],
}) => {
    const [isVisible, handleClose] = useModalTransition(open, onClose, 300);

    const [label, setLabel] = useState<LabelTemplate>({
        id: crypto.randomUUID(),
        name: '',
        color: '#000000',
    });

    const handleAdd = () => {
        onAdd(label);

        // Reset label inputs
        setLabel((prev) => ({ ...prev, id: crypto.randomUUID(), name: '' }));
    };

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-2000 flex items-center justify-center"
            onPointerDownCapture={(e: React.PointerEvent) =>
                e.stopPropagation()
            }>
            <div
                className={`absolute inset-0 bg-black/50 duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div
                className={`relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl bg-white shadow-2xl duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                {/* Modal Header */}
                <div className="relative flex items-center justify-center border-b border-gray-200 px-4 py-3">
                    <IconButton
                        onClick={handleClose}
                        className="absolute top-1/2 right-4 -translate-y-1/2">
                        <IconX className="size-5 text-gray-400" />
                    </IconButton>

                    <div>
                        <h2 className="text-center text-lg font-semibold text-gray-900">
                            Manage Labels
                        </h2>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="space-y-6 p-6 pt-3">
                    {labels.length > 0 && (
                        <div className="grid grid-cols-1 gap-2">
                            <AnimatePresence mode="sync">
                                {labels.map((label) => (
                                    <motion.div
                                        key={label.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{
                                            opacity: 1,
                                            height: 'auto',
                                        }}
                                        exit={{ opacity: 0, height: 0 }}>
                                        <LabelCard
                                            label={label}
                                            onRemove={onRemove}
                                            onToggle={onToggle}
                                            onUpdate={onUpdate}
                                            taskLabelIds={taskLabelIds}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <InputField
                            placeholder="Enter label name..."
                            className="text-sm"
                            value={label.name}
                            onChange={(e) =>
                                setLabel((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                        />

                        <input
                            className="h-10 w-26"
                            type="color"
                            value={label.color}
                            onChange={(e) =>
                                setLabel((prev) => ({
                                    ...prev,
                                    color: e.target.value,
                                }))
                            }
                        />

                        <Tooltip title="Add a new label">
                            <span>
                                <IconButton
                                    className="rounded-lg bg-blue-600 text-gray-50 normal-case hover:bg-blue-700 disabled:pointer-events-none disabled:bg-gray-300"
                                    disabled={!label.name || !label.color}
                                    onClick={handleAdd}>
                                    <IconPlus className="size-4" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default BoardLabelManagementModal;
