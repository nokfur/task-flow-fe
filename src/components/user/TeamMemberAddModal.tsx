import InputField from '@/components/common/input/InputField';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import useDebounce from '@/hooks/useDebounce';
import type { BoardMember } from '@/interfaces/interfaces';
import { getFirstLetterOfFirst2Word } from '@/utilities/utils';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { IconCrown, IconMail, IconUser, IconX } from '@tabler/icons-react';
import React, { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoardMemberRole } from '@/constants/constants';

const TeamMemberAddModal: React.FC<{
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

    const [isVisible, setIsVisible] = useState(false);

    const [email, setEmail] = useState('');
    const [selectedMember, setSelectedMember] = useState<BoardMember | null>(
        null,
    );
    const [role, setRole] = useState<BoardMemberRole>('Member');

    const [searchResults, setSearchResults] = useState<BoardMember[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const roleDetail: Partial<
        Record<BoardMemberRole, { description: string; icon: ReactNode }>
    > = {
        Member: {
            description: 'Can view and edit tasks',
            icon: <IconUser className="h-5 w-5 text-gray-400" />,
        },
        Admin: {
            description: 'Can manage board settings and members',
            icon: <IconCrown className="h-5 w-5 text-amber-500" />,
        },
    };

    const debounce = useDebounce(email, 500);

    useEffect(() => {
        // Small delay to ensure DOM is ready for transition
        if (open)
            setTimeout(() => {
                setIsVisible(true);
            }, 10);
    }, [open]);

    const handleClose = () => {
        // Wait for transition to complete before unmounting
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    useEffect(() => {
        if (debounce) {
            setIsSearching(true);

            apiEndpoints.users
                .search(debounce, memberIds)
                .then(({ data }: { data: BoardMember[] }) => {
                    setSearchResults(data);
                })
                .finally(() => setIsSearching(false));
        } else {
            setSearchResults([]);
        }
    }, [debounce]);

    const handleInvite = () => {
        if (selectedMember) onSuccess({ ...selectedMember, role });

        setSelectedMember(null);
        setEmail('');
        setRole('Member');
    };

    return (
        open && (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
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
                        <div className="m-0">
                            <InputField
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                label="Email Address"
                                placeholder="Enter email address or search by name"
                                startIcon={
                                    isSearching ? (
                                        <CircularProgress size="20px" />
                                    ) : (
                                        <IconMail />
                                    )
                                }
                            />

                            {/* Search Results */}
                            <AnimatePresence>
                                {searchResults.length > 0 && (
                                    <motion.div
                                        key="search-dropdown"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: 'easeInOut',
                                        }}
                                        className="mt-2 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                                        {searchResults.map((user) => (
                                            <Button
                                                key={user.id}
                                                onClick={() => {
                                                    setEmail(user.email);
                                                    setSearchResults([]);
                                                    setSelectedMember(user);
                                                }}
                                                className="flex w-full items-center justify-start gap-3 p-3 text-left normal-case transition-colors hover:bg-gray-50">
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
                                        ))}
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
                                {Object.entries(roleDetail).map(
                                    ([key, detail]) => (
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
                                    ),
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3">
                        <Button
                            onClick={handleClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 normal-case hover:bg-gray-50">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleInvite}
                            disabled={!email}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white normal-case transition-colors hover:bg-blue-700 disabled:bg-gray-300">
                            Add member
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
};

export default TeamMemberAddModal;
