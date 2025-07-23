import type { BoardGeneral } from '@/interfaces/interfaces';
import { getFirstLetterOfFirst2Word } from '@/utilities/utils';
import AvatarGroup from '@mui/material/AvatarGroup';
import ButtonBase from '@mui/material/ButtonBase';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Avatar from '@mui/material/Avatar';
import {
    IconChecklist,
    IconTableColumn,
    IconTablePlus,
    IconTag,
    IconTrash,
} from '@tabler/icons-react';
import Button from '@mui/material/Button';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import Skeleton from '@mui/material/Skeleton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Tooltip from '@mui/material/Tooltip';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import IconButton from '@mui/material/IconButton';

dayjs.extend(relativeTime);

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
                title="Are you sure to remove this board?"
                description="There is no undo!"
            />

            <div
                className="relative flex h-full cursor-pointer flex-col justify-center overflow-hidden rounded-xl border border-blue-200 bg-white px-6 pt-5 pb-7 duration-300 hover:-translate-y-0.5 hover:shadow-lg"
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
                    <p className="mt-3 text-sm text-gray-600">
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

                    <div className="flex items-center justify-between">
                        <AvatarGroup
                            max={4}
                            slotProps={{
                                surplus: {
                                    className:
                                        'size-6 text-xs bg-gradient-to-br from-blue-500 to-purple-800 text-white',
                                },
                            }}>
                            {board.members.map((member, index) => (
                                <Avatar
                                    key={index}
                                    className="size-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 text-xs text-white"
                                    alt={member.name}>
                                    {getFirstLetterOfFirst2Word(member.name)}
                                </Avatar>
                            ))}
                        </AvatarGroup>

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
                    <AvatarGroup
                        max={4}
                        slotProps={{
                            surplus: {
                                className:
                                    'size-6 text-xs bg-gradient-to-br from-blue-500 to-purple-800 text-white',
                            },
                        }}>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="circular"
                                className="size-6"
                            />
                        ))}
                    </AvatarGroup>

                    <span className="text-xs text-gray-600">
                        <Skeleton width={70} />
                    </span>
                </div>
            </div>
        </div>
    );
};

const UserBoardsPage = () => {
    const apiEndPoints = useApiEndpoints();

    const [boards, setBoards] = useState<BoardGeneral[]>([]);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [removingBoardId, setRemovingBoardId] = useState<string | null>(null);

    const [sortName, setSortName] = useState<'update' | 'name'>('update');
    const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        setLoading(true);
        apiEndPoints.boards
            .getOwns()
            .then(({ data }: { data: BoardGeneral[] }) => {
                setBoards(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const { filteredBoards } = useMemo(() => {
        let filteredBoards = boards;

        filteredBoards = filteredBoards.filter((board) => {
            // All filter
            if (activeTab === 0) return true;

            // Own board filter
            if (activeTab === 1) return board.isOwn;

            // member of board filter
            return !board.isOwn;
        });

        // sort
        filteredBoards = filteredBoards.sort((a, b) => {
            const multiplier = sortType === 'asc' ? 1 : -1;
            if (sortName === 'update')
                return (
                    (new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()) *
                    multiplier
                );
            return a.title.localeCompare(b.title) * multiplier;
        });

        return { filteredBoards };
    }, [activeTab, boards, sortName, sortType]);

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
        <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-12 lg:px-24">
            <h1 className="text-3xl font-bold">My Boards</h1>
            <p className="mt-2">
                Organize your projects and collaborate with your team
            </p>

            <div className="mt-8 flex items-center justify-between">
                <div className="inline-block space-x-1 rounded-md bg-slate-200/50 p-1">
                    {['All', 'My Boards', 'Team Boards'].map((tab, index) => (
                        <Button
                            key={index}
                            className={`z-0 bg-transparent text-sm font-semibold normal-case ${activeTab === index ? 'text-blue-500' : 'text-gray-600'}`}
                            onClick={() => setActiveTab(index)}>
                            {tab}
                            {activeTab === index && (
                                <motion.div
                                    layoutId="tab-indicator"
                                    className="absolute inset-0 -z-10 rounded-md bg-white shadow-md"
                                    transition={{
                                        type: 'spring',
                                        bounce: 0.3,
                                        duration: 0.5,
                                    }}
                                />
                            )}
                        </Button>
                    ))}
                </div>

                <div className="space-x-4">
                    <Select
                        value={sortName}
                        onChange={(event) => setSortName(event.target.value)}
                        className="w-36 rounded-sm bg-white px-3 py-1 text-sm shadow-md"
                        variant="standard"
                        disableUnderline>
                        <MenuItem value="update" className="text-sm">
                            Last updated
                        </MenuItem>
                        <MenuItem value="name" className="text-sm">
                            Name
                        </MenuItem>
                    </Select>

                    <Select
                        value={sortType}
                        onChange={(event) => setSortType(event.target.value)}
                        className="w-36 rounded-sm bg-white px-3 py-1 text-sm shadow-md"
                        variant="standard"
                        disableUnderline>
                        <MenuItem value="asc" className="text-sm">
                            Ascending
                        </MenuItem>
                        <MenuItem value="desc" className="text-sm">
                            Descending
                        </MenuItem>
                    </Select>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {activeTab !== 2 && (
                    <ButtonBase
                        className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 px-3 py-9 duration-300 hover:border-blue-300 hover:bg-blue-50"
                        component={Link}
                        to="create">
                        <div className="rounded-full bg-slate-200 px-3 py-3 text-slate-500 duration-300 group-hover:bg-blue-500 group-hover:text-slate-200">
                            <IconTablePlus className="duration-300" />
                        </div>
                        <p className="text-lg font-medium">Create new board</p>
                        <p>Start a new project and organize your tasks</p>
                    </ButtonBase>
                )}

                <AnimatePresence mode="sync">
                    {loading
                        ? Array.from({ length: 6 }).map((_, index) => (
                              <motion.div
                                  layout
                                  key={index}
                                  {...getCardMotionProps(index)}>
                                  <BoardCardSkeleton />
                              </motion.div>
                          ))
                        : filteredBoards.length > 0
                          ? filteredBoards.map((board, index) => (
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
                          : activeTab === 2 && (
                                <motion.div
                                    layout="position"
                                    key={'no-boards'}
                                    className="text-center font-medium"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}>
                                    You don't have any boards
                                </motion.div>
                            )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserBoardsPage;
