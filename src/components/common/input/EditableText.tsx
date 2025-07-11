import InputField, {
    type InputProps,
} from '@/components/common/input/InputField';
import type React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props extends InputProps {
    onSave: (text: string) => void;
}

const EditableText: React.FC<Props> = (props) => {
    const { value = '', className, onSave, placeholder } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    useEffect(() => {
        if (isEditing) setText(value);
    }, [isEditing, value]);

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
            setIsEditing(false);
            setText(value);
        }
    };

    return (
        <AnimatePresence initial={false} mode="wait">
            <motion.div
                key={isEditing ? 'editing' : 'viewing'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>
                {isEditing || !value ? (
                    <InputField
                        {...props}
                        value={text}
                        placeholder={placeholder || 'Enter text...'}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={handleSave}
                        onKeyPress={handleKeyDown}
                        autoFocus
                        onFocus={(
                            e: React.FocusEvent<
                                HTMLInputElement | HTMLTextAreaElement
                            >,
                        ) => e.target.select()}
                    />
                ) : (
                    <p
                        className={`cursor-pointer break-words ${className}`}
                        onClick={() => setIsEditing(true)}>
                        {value}
                    </p>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default EditableText;
