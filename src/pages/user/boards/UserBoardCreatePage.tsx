import InputField from '@/components/common/input/InputField';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import { useAuthProvider } from '@/contexts/AuthContext';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import { type BoardMember } from '@/interfaces/interfaces';
import {
    getFirstLetterOfFirst2Word,
    getFormikTouchError,
} from '@/utilities/utils';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import {
    IconLayoutBoardSplit,
    IconTrash,
    IconUsersPlus,
} from '@tabler/icons-react';
import { useFormik } from 'formik';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { BoardMemberRole } from '@/constants/constants';
import MemberAddModal from '@/components/user/MemberAddModal';

interface BoardTemplatePreview {
    id: string;
    title: string;
    description: string;
    columns: string[];
}

interface BoardMemberRequest {
    memberId: string;
    role: 'Member' | 'Admin' | 'Owner';
}

const TemplateCard: React.FC<{
    template: BoardTemplatePreview;
    selected?: boolean;
    onClick?: () => void;
}> = ({ template, selected, onClick = () => {} }) => {
    return (
        <div
            className={`h-full cursor-pointer rounded-lg border-2 px-4 py-4 duration-200 ${selected ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
            onClick={onClick}>
            <h5 className="font-medium">{template.title}</h5>
            <p className="mt-2 mb-3 text-xs text-gray-500">
                {template.description}
            </p>

            <div className="flex gap-1">
                {template.columns.map((column, index) => (
                    <div
                        key={index}
                        className="flex-1 rounded-sm bg-slate-100 px-1 py-1 text-center text-xs text-gray-500">
                        {column}
                    </div>
                ))}
            </div>
        </div>
    );
};

const MemberCard: React.FC<{
    member: BoardMember;
    isSelf?: boolean;
    onDelete?: (id: string) => void;
    onUpdateRole?: (id: string, role: BoardMemberRole) => void;
}> = ({ member, isSelf, onDelete = () => {}, onUpdateRole = () => {} }) => {
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
                    <h5 className="text-sm font-medium">{member.name}</h5>
                    <span className="text-xs text-gray-600">
                        {member.email}
                    </span>
                </div>
            </div>

            <div className="text-sm font-medium text-gray-700">
                {isSelf ? (
                    'Owner (You)'
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
                        <IconButton
                            className="text-red-500 hover:text-red-600"
                            onClick={() => onDelete(member.id)}>
                            <IconTrash className="size-5" />
                        </IconButton>
                    </div>
                )}
            </div>
        </div>
    );
};

const validationSchema = Yup.object({
    title: Yup.string().required('Please input'),
    description: Yup.string(),
    templateId: Yup.string(),
    members: Yup.array().of(
        Yup.object({
            id: Yup.string().required(),
            role: Yup.string().oneOf(Object.keys(BoardMemberRole)),
        }),
    ),
});

const sampleColumns: { title: string; tasks: string[] }[] = [
    {
        title: 'To Do',
        tasks: ['Sample task', 'Another task'],
    },
    {
        title: 'In Progress',
        tasks: ['Working on this'],
    },
    {
        title: 'Done',
        tasks: ['Completed task'],
    },
];

const UserBoardCreatePage = () => {
    const apiEndpoints = useApiEndpoints();

    const { user } = useAuthProvider();

    const [boardTemplates, setBoardTemplates] = useState<
        BoardTemplatePreview[]
    >([]);

    const [creating, setCreating] = useState(false);
    const [gettingTemplates, setGettingTemplates] = useState(false);
    const [isOpenMemberModal, setIsOpenMemberModal] = useState(false);

    useEffect(() => {
        setGettingTemplates(true);
        apiEndpoints.boards
            .getTemplates()
            .then(({ data }: { data: BoardTemplatePreview[] }) => {
                const customBoard = {
                    id: '',
                    title: 'Custom Board',
                    description:
                        'Start with a blank board and create your own workflow',
                    columns: ['Custom', 'Columns'],
                };

                setBoardTemplates([...data, customBoard]);
            })
            .finally(() => {
                setGettingTemplates(false);
            });
    }, []);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            templateId: '',
            members: [{ ...user, role: 'Owner' }] as BoardMember[],
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                ...values,
                boardMembers: values.members.map(
                    (m: BoardMember) =>
                        ({
                            memberId: m.id,
                            role: m.role || 'Member',
                        }) as BoardMemberRequest,
                ),
            };

            setCreating(true);
            apiEndpoints.boards
                .add(payload)
                .then(() => {
                    toast.success('Board add successfully!');
                    formik.resetForm();
                })
                .finally(() => setCreating(false));
        },
    });

    const getError = getFormikTouchError(formik);

    const handleRemoveMember = (id: string) => {
        formik.setFieldValue(
            'members',
            formik.values.members.filter((m) => m.id !== id),
        );
    };

    const handleUpdateMemberRole = (id: string, role: BoardMemberRole) => {
        formik.setFieldValue(
            'members',
            formik.values.members.map((m) =>
                m.id === id ? { ...m, role } : m,
            ),
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-12 lg:px-24">
            <MemberAddModal
                open={isOpenMemberModal}
                onClose={() => setIsOpenMemberModal(false)}
                memberIds={formik.values.members.map((m) => m.id)}
                onSuccess={(newMember) => {
                    formik.setFieldValue('members', [
                        ...formik.values.members,
                        newMember,
                    ]);
                }}
            />

            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold">Create New Board</h1>
                <p className="mt-2">
                    Set up your project workspace and start organizing your
                    tasks
                </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-6 rounded-lg border-2 border-dashed border-slate-300 bg-slate-100/70 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <IconLayoutBoardSplit className="size-12 text-green-700" />
                        <div>
                            <h6 className="text-lg font-medium">
                                {formik.values.title || 'My New Board'}
                            </h6>
                            <span className="text-sm">
                                {formik.values.description ||
                                    'Board description will appear here'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sampleColumns.map((column, index) => (
                            <div
                                key={index}
                                className="rounded-md border border-gray-200 bg-white px-3 py-3">
                                <p className="text-xs font-medium text-gray-600">
                                    {column.title}
                                </p>

                                <div className="mt-2 space-y-1">
                                    {column.tasks.map((task, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-100/60 px-2 py-1 text-xs text-gray-600">
                                            {task}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                    <div className="space-y-4">
                        <h5 className="text-lg font-medium">
                            📋 Basic Information
                        </h5>

                        <InputField
                            name="title"
                            label="Title"
                            placeholder="Enter board title (e.g, Website Redesign Project)"
                            isRequired
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={getError('title')}
                        />

                        <InputField
                            name="description"
                            label="Description"
                            placeholder="Describe what this board is for and what you hope to accomplish"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={getError('description')}
                            isArea
                        />
                    </div>

                    <div>
                        <h5 className="mb-3 text-lg font-medium">
                            📝 Choose Template
                        </h5>

                        <AnimatePresence mode="wait">
                            {gettingTemplates ? (
                                <motion.div
                                    className="flex justify-center"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}>
                                    <SpinningCircle loading />
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <AnimatePresence>
                                        {boardTemplates.map((template) => (
                                            <motion.div
                                                key={template.id}
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: 'auto',
                                                }}>
                                                <TemplateCard
                                                    template={template}
                                                    selected={
                                                        formik.values
                                                            .templateId ===
                                                        template.id
                                                    }
                                                    onClick={() =>
                                                        formik.setFieldValue(
                                                            'templateId',
                                                            template.id,
                                                        )
                                                    }
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div>
                        <h5 className="mb-3 text-lg font-medium">
                            👥 Team Settings
                        </h5>

                        <div className="space-y-2">
                            <AnimatePresence>
                                {formik.values.members.map((member) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}>
                                        <MemberCard
                                            member={member}
                                            isSelf={member.id === user?.id}
                                            onDelete={handleRemoveMember}
                                            onUpdateRole={
                                                handleUpdateMemberRole
                                            }
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <Button
                            className="mt-3 w-full rounded-lg border-2 border-dashed border-slate-300 py-2 text-gray-600 normal-case hover:border-blue-400 hover:text-blue-700"
                            startIcon={<IconUsersPlus />}
                            onClick={() => setIsOpenMemberModal(true)}>
                            Add Team Member
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-4">
                        <Button
                            className="border border-gray-200 bg-gray-50 px-5 text-gray-500 normal-case hover:bg-gray-100"
                            component={Link}
                            to="/boards">
                            Cancel
                        </Button>
                        <Button
                            className={`px-5 text-white normal-case duration-300 hover:bg-blue-700 ${creating ? 'pointer-events-none bg-gray-300' : 'bg-blue-600'}`}
                            startIcon={<SpinningCircle loading={creating} />}
                            type="submit">
                            Create Board
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserBoardCreatePage;
