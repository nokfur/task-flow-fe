import type { DueDateFilter, FilterKey } from '@/constants/constants';
import useModalTransition from '@/hooks/useModalTransition';
import type { Label } from '@/interfaces/interfaces';
import IconButton from '@mui/material/IconButton';
import {
    IconCalendarWeek,
    IconClock,
    IconClockHour1,
    IconClockX,
    IconTag,
    IconX,
} from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';

const dueDateFilterOptions: Record<
    DueDateFilter,
    { label: string; icon: React.ReactNode; iconWrapperColor: string }
> = {
    noDue: {
        label: 'No dates',
        icon: <IconCalendarWeek className="size-4 text-gray-500" />,
        iconWrapperColor: 'bg-gray-200',
    },
    overdue: {
        label: 'Overdue',
        icon: <IconClockX className="size-4 text-gray-700" />,
        iconWrapperColor: 'bg-red-300',
    },
    nextDay: {
        label: 'Due in the next day',
        icon: <IconClockHour1 className="size-4 text-gray-500" />,
        iconWrapperColor: 'bg-yellow-200',
    },
    nextWeek: {
        label: 'Due in the next week',
        icon: <IconClock className="size-4 text-gray-500" />,
        iconWrapperColor: 'bg-gray-200',
    },
};

const BoardFilter: React.FC<{
    open?: boolean;
    onClose?: () => void;
    labels?: Label[];
}> = ({ open = false, onClose = () => {}, labels = [] }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, handleClose] = useModalTransition(open, onClose, 300);

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

    const handleFilterChange = (
        filterKey: FilterKey,
        value: string,
        checked: boolean,
    ) => {
        let filters = searchParams.getAll(filterKey);

        if (!checked) filters = filters.filter((v) => v !== value);
        else filters.push(value);

        searchParams.delete(filterKey);
        filters.forEach((v) => searchParams.append(filterKey, v));

        setSearchParams(searchParams, { replace: true });
    };

    const isFilterActive = (filterKey: FilterKey, value: string): boolean => {
        return searchParams.getAll(filterKey).includes(value);
    };

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
                        Filter
                    </h2>
                </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-[70vh] overflow-y-auto px-3 py-3">
                {/* Due date filter */}
                <div>
                    <span className="text-xs font-medium">Due date</span>
                    <div className="ml-2 flex flex-col gap-2 pt-2">
                        {Object.entries(dueDateFilterOptions).map(
                            ([key, option]) => (
                                <label
                                    className="flex cursor-pointer items-center gap-4"
                                    key={key}>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600"
                                        checked={isFilterActive('due', key)}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                'due',
                                                key,
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <div className="flex items-center gap-1">
                                        <div
                                            className={`rounded-full p-1 ${option.iconWrapperColor}`}>
                                            {option.icon}
                                        </div>
                                        <span className="text-sm">
                                            {option.label}
                                        </span>
                                    </div>
                                </label>
                            ),
                        )}
                    </div>
                </div>

                {/* Label filter */}
                <div>
                    <span className="text-xs font-medium">Labels</span>
                    <div className="ml-2 flex flex-col gap-1.5 pt-2">
                        <label className="flex cursor-pointer items-center gap-4">
                            <input
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600"
                                checked={isFilterActive('label', 'none')}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'label',
                                        'none',
                                        e.target.checked,
                                    )
                                }
                            />
                            <div className="flex items-center gap-1">
                                <div className={`rounded-full bg-gray-200 p-1`}>
                                    <IconTag className="size-4 text-gray-500" />
                                </div>
                                <span className="text-sm">No labels</span>
                            </div>
                        </label>

                        {labels.map((label) => (
                            <label
                                className="flex cursor-pointer items-center gap-4"
                                key={label.id}>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-blue-600"
                                    checked={isFilterActive(
                                        'label',
                                        label.name,
                                    )}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'label',
                                            label.name,
                                            e.target.checked,
                                        )
                                    }
                                />
                                <div
                                    className="w-full rounded-sm px-2 py-1.5 text-sm text-gray-100"
                                    style={{
                                        backgroundColor: label.color,
                                    }}>
                                    {label.name}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default BoardFilter;
