import useModalTransition from '@/hooks/useModalTransition';
import Button from '@mui/material/Button';
import { createPortal } from 'react-dom';

const ConfirmationDialog: React.FC<{
    open: boolean;
    onConfirm?: () => void;
    onClose: () => void;
    title?: string;
    description?: string;
}> = ({
    open,
    onConfirm = () => {},
    onClose = () => {},
    title,
    description,
}) => {
    const [isVisible, handleClose] = useModalTransition(open, onClose, 300);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-center justify-center"
            onPointerDownCapture={(e: React.PointerEvent) =>
                e.stopPropagation()
            }>
            <div
                className={`absolute inset-0 bg-black/50 duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div
                className={`max-h-[90vh] w-md overflow-y-auto rounded-xl bg-white shadow-2xl duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                {/* Modal Header */}
                <div className="relative flex items-center justify-center px-4 py-3">
                    <div>
                        <h2 className="text-center text-lg font-semibold text-gray-900">
                            {title || 'Confirm Action'}
                        </h2>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="px-4 py-3">
                    <div className="text-gray-700">
                        {description || 'Are you sure you want to proceed?'}
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end p-4">
                    <Button
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 normal-case hover:bg-gray-50"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white normal-case transition-colors hover:bg-blue-700"
                        onClick={handleConfirm}>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default ConfirmationDialog;
