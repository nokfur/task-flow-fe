import InputField from '@/components/common/input/InputField';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import { BoardMemberRole } from '@/constants/constants';
import { useAuthProvider } from '@/contexts/AuthContext';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import useDebounce from '@/hooks/useDebounce';
import useModalTransition from '@/hooks/useModalTransition';
import type { BoardMember, UserSearch } from '@/interfaces/interfaces';
import type { BoardMemberRequest } from '@/interfaces/requestInterfaces';
import { getFirstLetterOfFirst2Word } from '@/utilities/utils';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import {
    IconCrown,
    IconMail,
    IconTrash,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const RoleDetail: Partial<
    Record<BoardMemberRole, { description: string; icon: ReactNode }>
> = {
    Member: {
        description: 'Can view and edit tasks',
        icon: <IconUser className="size-4 text-gray-400" />,
    },
    Admin: {
        description: 'Can manage board settings and members',
        icon: <IconCrown className="size-4 text-amber-500" />,
    },
};

const MemberCard: React.FC<{
    member: BoardMember;
    isSelf?: boolean;
    onDelete?: (id: string) => void;
    onUpdateRole?: (id: string, role: BoardMemberRole) => void;
    isRemoving?: boolean;
    isUpdating?: boolean;
}> = ({
    member,
    isSelf,
    onDelete = () => {},
    onUpdateRole = () => {},
    isRemoving = false,
    isUpdating = false,
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
                        {isUpdating ? (
                            <div>
                                <SpinningCircle loading />
                            </div>
                        ) : (
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
                        )}

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
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [role, setRole] = useState<BoardMemberRole>('Member');
    const [selectedMembers, setSelectedMembers] = useState<BoardMember[]>([]);

    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState(false);
    const [searchResults, setSearchResults] = useState<UserSearch[]>([]);
    const [searchResultVisible, setSearchResultVisible] = useState(false);
    const searchResultRef = useRef<HTMLDivElement | null>(null);

    const [removingMemberId, setRemovingMemberId] = useState<string | null>(
        null,
    );
    const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(
        null,
    );

    const debounce = useDebounce(email, 500);

    useEffect(() => {
        if (debounce) {
            setSearching(true);
            setSearchResultVisible(true);

            apiEndpoints.users
                .search(
                    debounce,
                    members
                        .map((m) => m.id)
                        .concat(selectedMembers.map((m) => m.id)),
                )
                .then(({ data }: { data: UserSearch[] }) => {
                    setSearchResults(data);
                })
                .finally(() => setSearching(false));
        } else {
            setSearchResultVisible(false);
            setSearchResults([]);
        }
    }, [debounce]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchResultRef.current &&
                !searchResultRef.current.contains(event.target as Node)
            ) {
                setSearchResultVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (open) {
            setLoading(true);
            apiEndpoints.users
                .getBoardMembers(boardId)
                .then(({ data }: { data: BoardMember[] }) => {
                    setMembers(data);
                })
                .finally(() => setLoading(false));
        }
    }, [open, boardId]);

    const handleInvite = () => {
        if (selectedMembers.length === 0) return;

        setAdding(true);

        const payload: BoardMemberRequest[] = selectedMembers.map((m) => ({
            memberId: m.id,
            role: m.role,
        }));
        apiEndpoints.users
            .addBoardMembers(boardId, payload)
            .then(() => {
                toast.success('Member added successfully');

                setEmail('');
                setMembers((prev) => [...prev, ...selectedMembers]);
                setSearchResults([]);
                setSelectedMembers([]);
            })
            .finally(() => setAdding(false));
    };

    const handleRemoveMember = (id: string) => {
        setRemovingMemberId(id);
        apiEndpoints.users
            .deleteBoardMember(boardId, id)
            .then(() => {
                setMembers((prev) => prev.filter((m) => m.id !== id));
            })
            .finally(() => {
                setRemovingMemberId(null);
            });
    };

    const handleSelectMember = (member: UserSearch) => {
        setSelectedMembers((prev) => [...prev, { ...member, role }]);
        setEmail('');
        setSearchResultVisible(false);
        setSearchResults([]);
    };

    const handleDeSelectMember = (memberId: string) => {
        setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
    };

    const handleUpdateMemberRole = (
        memberId: string,
        role: BoardMemberRole,
    ) => {
        setUpdatingMemberId(memberId);
        apiEndpoints.users
            .updateBoardMemberRole(boardId, memberId, role)
            .then(() => {
                setMembers((prev) =>
                    prev.map((member) =>
                        member.id === memberId ? { ...member, role } : member,
                    ),
                );
            })
            .finally(() => setUpdatingMemberId(null));
    };

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
                        <div className="flex items-start gap-2">
                            <motion.div
                                layout
                                className="flex w-full flex-col gap-2 rounded-lg border border-gray-300 p-2">
                                {selectedMembers.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        <AnimatePresence>
                                            {selectedMembers.map((member) => (
                                                <motion.div
                                                    layout
                                                    initial={{
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                    }}
                                                    key={member.id}
                                                    className="flex items-center justify-center gap-1 rounded-md bg-gray-100 px-1 py-0.5">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        {member.name} (
                                                        {member.role})
                                                    </span>
                                                    <IconButton
                                                        className="rounded-sm p-0.5"
                                                        onClick={() =>
                                                            handleDeSelectMember(
                                                                member.id,
                                                            )
                                                        }>
                                                        <IconX className="size-4 text-gray-500" />
                                                    </IconButton>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}

                                <InputField
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="Enter email address or name"
                                    startIcon={<IconMail />}
                                />
                            </motion.div>

                            <Select
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value as BoardMemberRole)
                                }
                                renderValue={(selected) =>
                                    BoardMemberRole[
                                        selected as keyof typeof BoardMemberRole
                                    ]
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
                                        className="flex max-w-40 flex-col gap-1 text-sm text-gray-700">
                                        <div className="flex items-center justify-center gap-1">
                                            {RoleDetail[role]?.icon}

                                            {
                                                BoardMemberRole[
                                                    role as keyof typeof BoardMemberRole
                                                ]
                                            }
                                        </div>
                                        <span className="inline-block w-full text-center text-xs break-words whitespace-pre-line">
                                            {RoleDetail[role]?.description}
                                        </span>
                                    </MenuItem>
                                ))}
                            </Select>

                            <Button
                                onClick={handleInvite}
                                disabled={selectedMembers.length === 0}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white normal-case hover:bg-blue-700 disabled:bg-gray-300"
                                startIcon={<SpinningCircle loading={adding} />}>
                                Share
                            </Button>
                        </div>

                        {/* Search Results */}
                        <AnimatePresence mode="sync">
                            {searchResultVisible && (
                                <motion.div
                                    layout
                                    className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-sm"
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
                                    ref={searchResultRef}>
                                    <AnimatePresence mode="sync">
                                        {searching ? (
                                            <motion.div
                                                layout
                                                key="searching"
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
                                                    layout
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
                                                layout
                                                key="no-result"
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Member list */}
                    <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto px-4 pb-4">
                        <AnimatePresence mode="sync">
                            {loading ? (
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
                                            isUpdating={
                                                updatingMemberId === member.id
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
