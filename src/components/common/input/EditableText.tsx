import InputField, {
    type InputProps,
} from '@/components/common/input/InputField';
import type React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@mui/material/Button';

interface Props extends InputProps {
    onSave: (text: string) => void;
    hasActions?: boolean;
    editNotAllow?: boolean;
}

const EditableText: React.FC<Props> = (props) => {
    const {
        value = '',
        className,
        onSave,
        placeholder,
        hasActions = false,
        editNotAllow = false,
    } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    useEffect(() => {
        if (isEditing) setText(value);
    }, [isEditing, value]);

    const handleCancel = () => {
        setIsEditing(false);
        setText(value);
    };

    const handleSave = () => {
        // Reset to original value if input is empty
        if (!text.trim()) {
            setText(value);
        } else {
            onSave?.(text.trim());
        }

        setIsEditing(false);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        if (e.key === 'Enter') {
            handleSave();
        }

        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <AnimatePresence initial={false} mode="wait">
            <motion.div
                key={isEditing ? 'editing' : 'viewing'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full">
                {!editNotAllow && (isEditing || !value) ? (
                    <>
                        <InputField
                            {...props}
                            value={text}
                            placeholder={placeholder || 'Enter text...'}
                            onChange={(e) => setText(e.target.value)}
                            onBlur={!hasActions ? handleSave : undefined}
                            onKeyPress={!hasActions ? handleKeyDown : undefined}
                            autoFocus
                            onFocus={(
                                e: React.FocusEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >,
                            ) => e.target.select()}
                        />

                        {hasActions && (
                            <div className="mt-2 flex items-center gap-2">
                                <Button
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white normal-case transition-colors hover:bg-blue-700"
                                    onClick={handleSave}>
                                    Save
                                </Button>
                                <Button
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 normal-case hover:bg-gray-50"
                                    onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <p
                        className={`${className} cursor-pointer break-words whitespace-pre-line`}
                        onClick={() => !editNotAllow && setIsEditing(true)}>
                        {value}
                    </p>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default EditableText;
