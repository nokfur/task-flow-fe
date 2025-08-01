import InputField from '@/components/common/input/InputField';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import { BoardMemberRole } from '@/constants/constants';
import { useAuthProvider } from '@/contexts/AuthContext';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import useDebounce from '@/hooks/useDebounce';
import useModalTransition from '@/hooks/useModalTransition';
import type { BoardMember, UserSearch } from '@/interfaces/interfaces';
import { getFirstLetterOfFirst2Word } from '@/utilities/utils';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { IconMail, IconTrash, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const MemberCard: React.FC<{
    member: BoardMember;
    isSelf?: boolean;
    onDelete?: (id: string) => void;
    onUpdateRole?: (id: string, role: BoardMemberRole) => void;
    isRemoving?: boolean;
}> = ({
    member,
    isSelf,
    onDelete = () => {},
    onUpdateRole = () => {},
    isRemoving = false,
}) => {
    const roles: Partial<BoardMemberRole[]> = ['Member', 'Admin'];
    return (
        <div className="flex items-center justify-between rounded-lg bg-gray-100/70 px-4 py-2">
            <div className="flex items-center gap-3">
                <Avatar
                    className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 text-xs text-white"
                    alt={member.name}>
                    {getFirstLetterOfFirst2Word(member.name)}
                </Avatar>

                <div className="-space-y-1">
                    <h5 className="text-sm font-medium">
                        {member.name} {isSelf && '(You)'}
                    </h5>
                    <span className="text-xs text-gray-600">
                        {member.email}
                    </span>
                </div>
            </div>

            <div className="text-sm font-medium text-gray-700">
                {member.role === 'Owner' ? (
                    member.role
                ) : (
                    <div className="flex items-center gap-1">
                        <Select
                            value={member.role}
                            onChange={(e) =>
                                onUpdateRole(member.id, e.target.value)
                            }
                            variant="standard"
                            disableUnderline
                            className="text-sm font-medium text-gray-700">
                            {roles.map((role) => (
                                <MenuItem
                                    value={role}
                                    className="text-sm font-medium text-gray-700">
                                    {
                                        BoardMemberRole[
                                            role as keyof typeof BoardMemberRole
                                        ]
                                    }
                                </MenuItem>
                            ))}
                        </Select>
                        <Tooltip title="Remove member">
                            <IconButton
                                className="text-red-500 hover:text-red-600"
                                onClick={() => onDelete(member.id)}>
                                {isRemoving ? (
                                    <SpinningCircle loading />
                                ) : (
                                    <IconTrash className="size-5" />
                                )}
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    );
};

const MemberAddModal: React.FC<{
    open?: boolean;
    onClose?: () => void;
}> = ({ open = false, onClose = () => {} }) => {
    const apiEndpoints = useApiEndpoints();
    const { user } = useAuthProvider();
    const { boardId = '' } = useParams<{ boardId: string }>();

    const [members, setMembers] = useState<BoardMember[]>([]);
    const [isVisible, handleClose] = useModalTransition(open, onClose, 300);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [role, setRole] = useState<BoardMemberRole>('Member');
    const [selectedMembers, setSelectedMembers] = useState<BoardMember[]>([]);

    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [searchResults, setSearchResults] = useState<UserSearch[]>([]);

    const [removingMemberId, setRemovingMemberId] = useState<string | null>(
        null,
    );

    const debounce = useDebounce(email, 500);

    useEffect(() => {
        if (debounce) {
            setIsSearching(true);

            apiEndpoints.users
                .search(
                    debounce,
                    members.map((m) => m.id),
                )
                .then(({ data }: { data: UserSearch[] }) => {
                    setSearchResults(data);
                })
                .finally(() => setIsSearching(false));
        } else {
            setSearchResults([]);
        }
    }, [debounce]);

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            apiEndpoints.users
                .getBoardMembers(boardId)
                .then(({ data }: { data: BoardMember[] }) => {
                    setMembers(data);
                })
                .finally(() => setIsLoading(false));
        }
    }, [open, boardId]);

    const handleInvite = () => {
        if (!email) return;

        setIsAdding(true);
        apiEndpoints.users
            .addBoardMember(boardId, { email, role })
            .then(({ data }: { data: BoardMember }) => {
                toast.success('Member added successfully');

                setMembers((prev) => [...prev, data]);
                setSearchResults([]);
                setEmail('');
            })
            .finally(() => setIsAdding(false));
    };

    const handleRemoveMember = (id: string) => {
        setRemovingMemberId(id);
        apiEndpoints.users
            .deleteBoardMember(boardId, id)
            .then(() => {
                toast.success('Member removed successfully');
                setMembers((prev) => prev.filter((m) => m.id !== id));
            })
            .finally(() => {
                setRemovingMemberId(null);
            });
    };

    const handleSelectMember = (member: UserSearch) => {
        setSelectedMembers((prev) => [...prev, { ...member, role }]);
        setEmail('');
        setSearchResults([]);
    };

    const handleUpdateMemberRole = (id: string, role: BoardMemberRole) => {};

    if (!open) return null;
    return createPortal(
        <div
            className="fixed inset-0 z-1300 flex items-start justify-center py-12"
            onPointerDownCapture={(e: React.PointerEvent) =>
                e.stopPropagation()
            }>
            <div
                className={`absolute inset-0 bg-black/50 duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}></div>

            <div
                className={`flex max-h-[90vh] w-lg flex-col rounded-xl bg-white shadow-2xl duration-300 ${isVisible ? 'scale-100' : 'scale-0'}`}>
                {/* Modal Header */}
                <div className="relative flex items-center justify-center border-b border-gray-200 px-4 py-3">
                    <IconButton
                        onClick={handleClose}
                        className="absolute top-1/2 right-4 -translate-y-1/2">
                        <IconX className="size-5 text-gray-400" />
                    </IconButton>

                    <div>
                        <h2 className="text-center font-semibold text-gray-900">
                            Share board
                        </h2>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex flex-col gap-2">
                    {/* Email Input with Search results */}
                    <div className="relative mx-4 mt-2">
                        {/* Email input and role selection */}
                        <div className="flex items-center gap-2">
                            <div className="flex grow flex-wrap rounded-lg border border-gray-300 p-2">
                                {selectedMembers.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center justify-center gap-1 rounded-md bg-gray-100 px-1 py-0.5">
                                        <span className="text-sm font-medium text-gray-500">
                                            {member.name}
                                        </span>
                                        <IconButton className="rounded-sm p-0.5">
                                            <IconX className="size-4 text-gray-500" />
                                        </IconButton>
                                    </div>
                                ))}

                                <InputField
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Enter email address or name"
                                    startIcon={<IconMail />}
                                    className="border-none! shadow-none!"
                                />
                            </div>

                            <Select
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value as BoardMemberRole)
                                }
                                variant="standard"
                                disableUnderline
                                className="rounded-md border border-gray-300 px-2 py-0.5 text-sm text-gray-700">
                                {(
                                    [
                                        'Member',
                                        'Admin',
                                    ] as Partial<BoardMemberRole>[]
                                ).map((role) => (
                                    <MenuItem
                                        value={role}
                                        className="text-sm text-gray-700">
                                        {
                                            BoardMemberRole[
                                                role as keyof typeof BoardMemberRole
                                            ]
                                        }
                                    </MenuItem>
                                ))}
                            </Select>

                            <Button
                                onClick={handleInvite}
                                disabled={!email || isAdding}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white normal-case hover:bg-blue-700 disabled:bg-gray-300"
                                startIcon={
                                    <SpinningCircle loading={isAdding} />
                                }>
                                Share
                            </Button>
                        </div>

                        {/* Search Results */}
                        {email && (
                            <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-sm">
                                <AnimatePresence mode="sync">
                                    {isSearching ? (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            className="flex items-center justify-center py-2">
                                            <SpinningCircle loading />
                                        </motion.div>
                                    ) : searchResults.length > 0 ? (
                                        searchResults.map((user) => (
                                            <motion.div
                                                key={user.id}
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: 'auto',
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: 'easeInOut',
                                                }}>
                                                <Button
                                                    onClick={() => {
                                                        handleSelectMember(
                                                            user,
                                                        );
                                                    }}
                                                    className="flex w-full items-center justify-start gap-3 px-3 py-1.5 text-left normal-case transition-colors hover:bg-gray-50">
                                                    <Avatar
                                                        className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 text-xs text-white"
                                                        alt={user?.name}>
                                                        {getFirstLetterOfFirst2Word(
                                                            user?.name,
                                                        )}
                                                    </Avatar>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </Button>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            className="px-4 py-2 text-sm text-gray-700">
                                            Looks like that person isn't a
                                            TaskFlow member yet!
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Member list */}
                    <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto px-4 pb-4">
                        <AnimatePresence mode="sync">
                            {isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center justify-center">
                                    <SpinningCircle loading />
                                </motion.div>
                            ) : (
                                members.map((member) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}>
                                        <MemberCard
                                            member={member}
                                            isSelf={member.id === user?.id}
                                            onDelete={handleRemoveMember}
                                            onUpdateRole={
                                                handleUpdateMemberRole
                                            }
                                            isRemoving={
                                                removingMemberId === member.id
                                            }
                                        />
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default MemberAddModal;
