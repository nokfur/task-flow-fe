import type { BoardItem } from '@/interfaces/interfaces';
import { getFirstLetterOfFirst2Word } from '@/utilities/utils';
import AvatarGroup from '@mui/material/AvatarGroup';
import ButtonBase from '@mui/material/ButtonBase';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Avatar from '@mui/material/Avatar';
import {
    IconChecklist,
    IconTableColumn,
    IconTablePlus,
    IconTag,
} from '@tabler/icons-react';
import Button from '@mui/material/Button';

dayjs.extend(relativeTime);

const BoardCard: React.FC<{ board: BoardItem }> = ({ board }) => {
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
        <div className="relative cursor-pointer overflow-hidden rounded-xl border border-blue-200 bg-white px-6 pt-5 pb-7 duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div
                className={`before:absolute before:top-0 before:right-0 before:h-1 before:w-full ${colors[Math.floor(Math.random() * colors.length)]} before:content-[""]`}>
                <h6 className="text-lg font-semibold">{board.title}</h6>
                <p className="my-3 text-sm text-gray-600">
                    {board.description}
                </p>

                <div className="flex items-center gap-4">
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

                <div className="mt-3 flex items-center justify-between">
                    <AvatarGroup
                        max={4}
                        slotProps={{
                            surplus: {
                                className:
                                    'size-6 text-xs bg-gradient-to-br from-blue-500 to-purple-800 text-white',
                            },
                        }}>
                        {board.members.map((name, index) => (
                            <Avatar
                                key={index}
                                className="size-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 text-xs text-white"
                                alt={name}>
                                {getFirstLetterOfFirst2Word(name)}
                            </Avatar>
                        ))}
                    </AvatarGroup>

                    <span className="text-xs text-gray-600">
                        Updated {dayjs(board.updatedAt).fromNow()}
                    </span>
                </div>
            </div>
        </div>
    );
};

const mockBoards: BoardItem[] = [
    {
        id: 'aa',
        title: 'Website Redesign Project',
        description:
            'Complete redesign of the company website with modern UI/UX principles and responsive design.',
        columnCount: 4,
        taskCount: 14,
        labelCount: 8,
        createdAt: '1747909051438',
        updatedAt: '1747909051438',
        members: ['Ngue A', 'Hu He', 'H C', 'M L', 'H E'],
    },
];

const UserBoardsPage = () => {
    const [boards, setBoards] = useState<BoardItem[]>([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        setBoards(mockBoards);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-12 lg:px-24">
            <h1 className="text-3xl font-bold">My Boards</h1>
            <p className="mt-2">
                Organize your projects and collaborate with your team
            </p>

            <div className="mt-8 inline-block space-x-1 rounded-md bg-slate-200/50 p-1">
                <Button
                    className={`text-sm normal-case ${activeTab === 0 ? 'bg-white text-blue-500 shadow-md' : 'text-gray-600'}`}
                    onClick={() => setActiveTab(0)}>
                    All
                </Button>
                <Button
                    className={`text-sm normal-case ${activeTab === 1 ? 'bg-white text-blue-500 shadow-md' : 'text-gray-600'}`}
                    onClick={() => setActiveTab(1)}>
                    My Boards
                </Button>
                <Button
                    className={`text-sm normal-case ${activeTab === 2 ? 'bg-white text-blue-500 shadow-md' : 'text-gray-600'}`}
                    onClick={() => setActiveTab(2)}>
                    Collaborate Boards
                </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ButtonBase className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 px-3 py-9 duration-300 hover:border-blue-300 hover:bg-blue-50">
                    <div className="rounded-full bg-slate-200 px-3 py-3 text-slate-500 duration-300 group-hover:bg-blue-500 group-hover:text-slate-200">
                        <IconTablePlus className="duration-300" />
                    </div>
                    <p className="text-lg font-medium">Create new board</p>
                    <p>Start a new project or organize your tasks</p>
                </ButtonBase>

                {boards.length > 0 &&
                    boards.map((board) => (
                        <BoardCard board={board} key={board.id} />
                    ))}
            </div>
        </div>
    );
};

export default UserBoardsPage;
