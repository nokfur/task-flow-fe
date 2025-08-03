import InputField from '@/components/common/input/InputField';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import useDebounce from '@/hooks/useDebounce';
import type { BoardMember, UserSearch } from '@/interfaces/interfaces';
import { getFirstLetterOfFirst2Word } from '@/utilities/utils';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { IconCrown, IconMail, IconUser, IconX } from '@tabler/icons-react';
import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardMemberRole } from '@/constants/constants';
import useModalTransition from '@/hooks/useModalTransition';
import { createPortal } from 'react-dom';
import SpinningCircle from '@/components/common/loader/SpinningCircle';

const roleDetail: Partial<
    Record<BoardMemberRole, { description: string; icon: ReactNode }>
> = {
    Member: {
        description: 'Can view and edit tasks',
        icon: <IconUser className="size-5 text-gray-400" />,
    },
    Admin: {
        description: 'Can manage board settings and members',
        icon: <IconCrown className="size-5 text-amber-500" />,
    },
};

const MemberAddModal: React.FC<{
    open?: boolean;
    onClose?: () => void;
    memberIds?: string[];
    onSuccess?: (member: BoardMember) => void;
}> = ({
    open = false,
    onClose = () => {},
    memberIds = [],
    onSuccess = () => {},
}) => {
    const apiEndpoints = useApiEndpoints();

    const [isVisible, handleClose] = useModalTransition(open, onClose, 300);
    const searchResultRef = useRef<HTMLDivElement | null>(null);
    const [searchResultVisible, setSearchResultVisible] = useState(false);

    const [email, setEmail] = useState('');
    const [selectedMember, setSelectedMember] = useState<BoardMember | null>(
        null,
    );
    const [role, setRole] = useState<BoardMemberRole>('Member');

    const [searchResults, setSearchResults] = useState<UserSearch[]>([]);
    const [searching, setSearching] = useState(false);

    const debounce = useDebounce(email, 500);

    useEffect(() => {
        if (debounce) {
            setSearching(true);
            setSearchResultVisible(true);

            apiEndpoints.users
                .search(debounce, memberIds)
                .then(({ data }: { data: UserSearch[] }) => {
                    setSearchResults(data);
                })
                .finally(() => setSearching(false));
        } else {
            setSearchResults([]);
            setSearchResultVisible(false);
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

    const handleInvite = () => {
        if (!selectedMember) return;

        onSuccess({ ...selectedMember, role });
        setEmail('');
        setSearchResultVisible(false);
        setSearchResults([]);
        setSelectedMember(null);
    };

    const handleSelectMember = (member: UserSearch) => {
        setSelectedMember({ ...member, role });
        setEmail('');
        setSearchResultVisible(false);
        setSearchResults([]);
    };

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center">
            <div
                className={`absolute inset-0 bg-black/50 duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            <div
                className={`relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <IconButton
                    onClick={handleClose}
                    className="absolute top-4 right-4">
                    <IconX className="size-5 text-gray-400" />
                </IconButton>

                {/* Modal Header */}
                <div className="flex items-center justify-center border-b border-gray-200 px-4 py-3">
                    <div>
                        <h2 className="text-center text-xl font-semibold text-gray-900">
                            Add Team Member
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Invite someone to collaborate on this board
                        </p>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="space-y-6 p-6 pt-3">
                    {/* Email Input with Search */}
                    <div className="relative m-0">
                        <AnimatePresence mode="wait">
                            {selectedMember ? (
                                <motion.div
                                    key="member-selected"
                                    className="flex w-full items-center justify-start gap-3 rounded-lg border border-gray-300 px-3 py-1.5 text-left normal-case transition-colors"
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}>
                                    <Avatar
                                        className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-800 text-xs text-white"
                                        alt={selectedMember.name}>
                                        {getFirstLetterOfFirst2Word(
                                            selectedMember.name,
                                        )}
                                    </Avatar>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {selectedMember.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {selectedMember.email}
                                        </div>
                                    </div>
                                    <IconButton
                                        onClick={() => setSelectedMember(null)}
                                        className="ml-auto">
                                        <IconX className="size-5 text-gray-400" />
                                    </IconButton>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="member-unselected"
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}>
                                    <InputField
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        label="Email Address"
                                        placeholder="Enter email address or search by name"
                                        startIcon={<IconMail />}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

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

                    {/* Role Selection */}
                    <div className="mt-3">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <div className="space-y-2">
                            {Object.entries(roleDetail).map(([key, detail]) => (
                                <label
                                    key={key}
                                    className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={key}
                                        checked={key === role}
                                        onChange={(e) =>
                                            setRole(
                                                e.target
                                                    .value as BoardMemberRole,
                                            )
                                        }
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-3 flex items-center gap-3">
                                        {detail.icon}
                                        <div>
                                            <div className="text-sm font-medium">
                                                {
                                                    BoardMemberRole[
                                                        key as keyof typeof BoardMemberRole
                                                    ]
                                                }
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {detail.description}
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-2">
                    <Button
                        onClick={handleClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 normal-case hover:bg-gray-50">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleInvite}
                        disabled={!selectedMember}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white normal-case transition-colors hover:bg-blue-700 disabled:bg-gray-300">
                        Add member
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default MemberAddModal;
