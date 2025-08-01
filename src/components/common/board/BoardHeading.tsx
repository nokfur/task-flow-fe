import BoardDescription from '@/components/common/board/modal/BoardDescription';
import BoardFilter from '@/components/common/board/modal/BoardFilter';
import MemberAddModal from '@/components/common/board/modal/MemberAddModal';
import EditableText from '@/components/common/input/EditableText';
import type { Board } from '@/interfaces/interfaces';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { IconFilter, IconInfoCircle, IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';

const BoardHeading: React.FC<{
    board: Board;
    loading?: boolean;
    onUpdateBoard?: (val: string, type: 'title' | 'description') => void;
}> = ({ board, loading, onUpdateBoard = () => {} }) => {
    const [openDescription, setOpenDescription] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openMemberAdd, setOpenMemberAdd] = useState(false);

    return (
        <>
            <BoardDescription
                open={openDescription}
                onClose={() => setOpenDescription(false)}
                onUpdate={(value) => onUpdateBoard(value, 'description')}
                description={board.description}
            />

            <BoardFilter
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                labels={board.labels}
            />

            <MemberAddModal
                open={openMemberAdd}
                onClose={() => setOpenMemberAdd(false)}
            />

            <div className="w-full bg-white/50 backdrop-blur-sm">
                <div className="border-b border-gray-200 px-8 py-2">
                    <div className="flex items-center justify-between">
                        <div>
                            {loading ? (
                                <Skeleton className="h-10 w-36" />
                            ) : (
                                <div className="w-fit rounded-md duration-200 hover:bg-gray-200">
                                    <EditableText
                                        placeholder="Board title (e.g, Website Redesign Project)"
                                        value={board.title}
                                        onSave={(val) =>
                                            onUpdateBoard(val, 'title')
                                        }
                                        className="px-3! py-1! text-lg! font-medium"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <Tooltip title="Filter tasks">
                                <IconButton
                                    className="rounded-md hover:bg-gray-200"
                                    onClick={() => setOpenFilter(true)}>
                                    <IconFilter className="size-5" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="About this board">
                                <IconButton
                                    className="rounded-md hover:bg-gray-200"
                                    onClick={() => setOpenDescription(true)}>
                                    <IconInfoCircle className="size-5" />
                                </IconButton>
                            </Tooltip>

                            <Button
                                className="bg-violet-600 px-4 py-1 font-medium text-gray-50 normal-case transition duration-200 hover:bg-violet-700 hover:shadow-md"
                                startIcon={<IconUserPlus className="size-5" />}
                                onClick={() => setOpenMemberAdd(true)}>
                                Share
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BoardHeading;
