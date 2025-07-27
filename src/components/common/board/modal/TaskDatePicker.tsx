import useModalTransition from '@/hooks/useModalTransition';
import IconButton from '@mui/material/IconButton';
import { IconX } from '@tabler/icons-react';

const TaskDatePicker: React.FC<{
    open?: boolean;
    onClose?: () => void;
}> = ({ open = false, onClose = () => {} }) => {
    const [isVisible, handleClose] = useModalTransition(open, onClose, 300);

    if (!isVisible) return null;
    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center"
            onPointerDownCapture={(e: React.PointerEvent) =>
                e.stopPropagation()
            }>
            <div
                className={`absolute inset-0 bg-black/50 duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}></div>

            <div
                className={`relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl bg-white shadow-2xl duration-300 ${isVisible ? 'scale-100' : 'scale-0'}`}>
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
            </div>
        </div>
    );
};

export default TaskDatePicker;
