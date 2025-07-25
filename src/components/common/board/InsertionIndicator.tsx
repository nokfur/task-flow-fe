import { useBoardContextProvider } from '@/components/common/board/BoardTable';
import type { Column } from '@/interfaces/interfaces';
import { motion } from 'framer-motion';

interface IndicatorProps {
    index: number;
    columnId: Column['id'];
}

const InsertionIndicator: React.FC<IndicatorProps> = ({ index, columnId }) => {
    const { taskDragState } = useBoardContextProvider();

    // If the task is being dragged within the same column (`fromColumn === columnId`)
    // and the current index is after its original position,
    // we decrement the index by 1 to account for the temporary "gap"
    // left behind by the dragged item.
    //
    // This ensures that when inserting a visual drop indicator or placeholder,
    // we don't misplace it due to the drag displacement effect.
    if (
        taskDragState.fromColumn === columnId &&
        index > (taskDragState.originalIndex || 0)
    )
        index--;

    // Show indicator at the target index if:
    // - The dragged task is currently over this column
    // - The insertion index matches this index
    // - Either moving to a different column, or moving within the same column but to a different position
    const shouldShow =
        taskDragState.overColumn === columnId &&
        taskDragState.insertionIndex === index &&
        (taskDragState.fromColumn !== columnId ||
            taskDragState.originalIndex !== index);

    return (
        shouldShow && (
            <motion.div
                className="h-26 w-full rounded-xl border-2 border-dashed border-violet-300 bg-violet-100"
                data-index={index}
                data-column={columnId}
                transition={{ duration: 0.15 }}
            />
        )
    );
};

export default InsertionIndicator;
