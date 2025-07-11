import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { BoardGeneral } from '@/interfaces/interfaces';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import {
    IconChecklist,
    IconTableColumn,
    IconTablePlus,
    IconTag,
    IconTrash,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BoardCard: React.FC<{
    board: BoardGeneral;
    onRemove?: (boardId: string) => void;
    isRemoving?: boolean;
}> = ({ board, onRemove = () => {}, isRemoving = false }) => {
    const navigate = useNavigate();

    const [openRemoveConfirmation, setOpenRemoveConfirmation] = useState(false);

    const colors = [
        'before:bg-blue-600',
        'before:bg-green-600',
        'before:bg-red-600',
        'before:bg-orange-600',
        'before:bg-yellow-600',
        'before:bg-violet-600',
        'before:bg-fuchsia-600',
    ];

    return (
        <>
            <ConfirmationDialog
                open={openRemoveConfirmation}
                onClose={() => setOpenRemoveConfirmation(false)}
                onConfirm={() => onRemove(board.id)}
                title="Are you sure to remove this template?"
                description="There is no undo!"
            />

            <div
                className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-blue-200 bg-white px-6 pt-5 pb-7 duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => navigate(board.id)}>
                <div
                    className={`before:absolute before:top-0 before:right-0 before:h-1 before:w-full ${colors[Math.floor(Math.random() * colors.length)]} before:content-[""]`}>
                    <div className="flex items-start justify-between">
                        <h6 className="text-lg font-semibold">{board.title}</h6>

                        <Tooltip
                            title="Remove template"
                            onClick={(e) => e.stopPropagation()}>
                            {isRemoving ? (
                                <div className="cursor-default text-gray-500">
                                    <SpinningCircle
                                        loading={isRemoving}
                                        size={4.5}
                                    />
                                </div>
                            ) : (
                                <IconButton
                                    className="text-red-500 hover:text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenRemoveConfirmation(true);
                                    }}>
                                    <IconTrash className="size-4.5" />
                                </IconButton>
                            )}
                        </Tooltip>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {board.description}
                    </p>

                    <div className="my-4 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <IconTableColumn className="size-4 text-orange-500" />
                            <span className="text-sm text-gray-600">
                                {board.columnCount} Lists
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <IconChecklist className="size-4 text-green-500" />
                            <span className="text-sm text-gray-600">
                                {board.taskCount} Tasks
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <IconTag className="size-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                                {board.labelCount} Labels
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs text-gray-600">
                            Created {dayjs(board.createdAt).fromNow()}
                        </span>

                        <span className="text-xs text-gray-600">
                            Updated {dayjs(board.updatedAt).fromNow()}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

const BoardCardSkeleton: React.FC = () => {
    return (
        <div className="relative flex h-full cursor-pointer flex-col justify-center overflow-hidden rounded-xl border border-blue-200 bg-white px-6 pt-5 pb-7 duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="bg-gray200 before:absolute before:top-0 before:right-0 before:h-1 before:w-full before:content-['']">
                <h6 className="text-lg font-semibold">
                    <Skeleton />
                </h6>
                <p className="mt-3 text-sm text-gray-600">
                    <Skeleton />
                </p>

                <div className="my-4 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Skeleton variant="circular" className="size-4" />
                        <span className="text-sm text-gray-600">
                            <Skeleton width={30} />
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Skeleton variant="circular" className="size-4" />
                        <span className="text-sm text-gray-600">
                            <Skeleton width={30} />
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Skeleton variant="circular" className="size-4" />
                        <span className="text-sm text-gray-600">
                            <Skeleton width={30} />
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                        <Skeleton width={70} />
                    </span>
                </div>
            </div>
        </div>
    );
};

const TemplateBoardManagementPage = () => {
    const apiEndPoints = useApiEndpoints();

    const [boards, setBoards] = useState<BoardGeneral[]>([]);
    const [loading, setLoading] = useState(false);

    const [removingBoardId, setRemovingBoardId] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        apiEndPoints.boards.admin
            .getTemplates()
            .then(({ data }: { data: BoardGeneral[] }) => {
                setBoards(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleRemoveBoard = (boardId: string) => {
        setRemovingBoardId(boardId);
        apiEndPoints.boards
            .delete(boardId)
            .then(() => {
                setBoards((prev) => prev.filter((b) => b.id !== boardId));
            })
            .finally(() => {
                setRemovingBoardId(null);
            });
    };

    const getCardMotionProps = (index: number) => ({
        initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
        transition: { delay: index * 0.1, duration: 0.4 },
    });

    return (
        <div>
            <div>
                <div className="flex items-center justify-between">
                    <h1 className="mb-4 text-2xl font-bold">
                        Template Board Management
                    </h1>

                    <Button
                        className="bg-blue-600 px-4 text-gray-50 normal-case duration-300 hover:bg-blue-700"
                        startIcon={<IconTablePlus />}
                        component={Link}
                        to="create">
                        Create Template
                    </Button>
                </div>
                <p className="mb-6 text-gray-700">
                    Manage your template boards here.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence mode="sync">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, index) => (
                                <motion.div
                                    layout
                                    key={`skeleton-${index}`}
                                    {...getCardMotionProps(index)}>
                                    <BoardCardSkeleton />
                                </motion.div>
                            ))
                        ) : boards.length > 0 ? (
                            boards.map((board, index) => (
                                <motion.div
                                    layout
                                    key={board.id}
                                    {...getCardMotionProps(index)}>
                                    <BoardCard
                                        board={board}
                                        onRemove={handleRemoveBoard}
                                        isRemoving={
                                            board.id === removingBoardId
                                        }
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="text-center font-medium"
                                key="no-boards"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}>
                                There aren't any templates
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TemplateBoardManagementPage;
