import useModalTransition from '@/hooks/useModalTransition';
import IconButton from '@mui/material/IconButton';
import { IconX } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';
import { createPortal } from 'react-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const TaskDatePickerModal: React.FC<{
    open?: boolean;
    onClose?: () => void;
    onConfirm?: (date: Date | null) => void;
    currentDate?: Date | null;
}> = ({
    open = false,
    onClose = () => {},
    onConfirm = () => {},
    currentDate,
}) => {
    const [isVisible, handleClose] = useModalTransition(open, onClose, 300);

    const handleChange = (newDate: Dayjs | null) => {
        if (!newDate) return;
        // If the current date is the same as the new date, we clear it
        onConfirm(
            currentDate && dayjs(currentDate).isSame(newDate, 'day')
                ? null
                : newDate.toDate(),
        );
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
                onClick={handleClose}></div>

            <div
                className={`relative max-h-[90vh] max-w-xs overflow-y-auto rounded-xl bg-white shadow-2xl duration-300 ${isVisible ? 'scale-100' : 'scale-0'}`}>
                {/* Modal Header */}
                <div className="relative flex items-center justify-center border-b border-gray-200 px-4 py-3">
                    <IconButton
                        onClick={handleClose}
                        className="absolute top-1/2 right-4 -translate-y-1/2">
                        <IconX className="size-5 text-gray-400" />
                    </IconButton>

                    <div>
                        <h2 className="text-center font-semibold text-gray-900">
                            Select Task Date
                        </h2>
                    </div>
                </div>

                {/* Modal Content */}
                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={currentDate ? dayjs(currentDate) : null}
                            onChange={handleChange}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default TaskDatePickerModal;
