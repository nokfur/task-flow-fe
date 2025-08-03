import EditableText from '@/components/common/input/EditableText';
import useModalTransition from '@/hooks/useModalTransition';
import IconButton from '@mui/material/IconButton';
import { IconAlignJustified, IconX } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const BoardDescription: React.FC<{
    open?: boolean;
    onClose?: () => void;
    onUpdate?: (value: string) => void;
    description?: string;
    editNotAllow?: boolean;
}> = ({
    open = false,
    onClose = () => {},
    onUpdate = () => {},
    description = '',
    editNotAllow = false,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, handleClose] = useModalTransition(open, onClose, 300);

    const handleChange = (newValue: string) => {
        onUpdate(newValue);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClose]);

    if (!open) return null;
    return createPortal(
        <div
            className={`fixed top-24 right-8 z-100 min-h-1/3 w-xs origin-top-right rounded-xl bg-white shadow-xl duration-300 ${isVisible ? 'scale-100' : 'scale-0'}`}
            ref={ref}>
            {/* Modal Header */}
            <div className="relative flex items-center justify-center border-b border-gray-200 px-4 py-3">
                <IconButton
                    onClick={handleClose}
                    className="absolute top-1/2 right-4 -translate-y-1/2">
                    <IconX className="size-4 text-gray-400" />
                </IconButton>

                <div>
                    <h2 className="text-center text-sm font-semibold text-gray-900">
                        About this board
                    </h2>
                </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-[70vh] overflow-y-auto px-4 py-3">
                <div className="mb-3 flex items-center gap-2">
                    <IconAlignJustified className="size-6" />
                    <span className="font-medium">Description</span>
                </div>

                <EditableText
                    placeholder="Add a description to let your teammates know what this board is about used for. You'll get bonus points if you add instructions for how to collaborate!"
                    value={description}
                    onSave={handleChange}
                    className="field-sizing-content text-sm!"
                    isArea
                    hasActions
                    editNotAllow={editNotAllow}
                />
            </div>
        </div>,
        document.body,
    );
};

export default BoardDescription;
