import InputField from '@/components/common/input/InputField';
import TextArea from '@/components/common/input/TextArea';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import { useAuthProvider } from '@/contexts/AuthContext';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { BoardMember } from '@/interfaces/interfaces';
import {
    getFirstLetterOfFirst2Word,
    getFormikTouchError,
} from '@/utilities/utils';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {
    IconLayoutBoardSplit,
    IconTrash,
    IconUsersPlus,
} from '@tabler/icons-react';
import { useFormik } from 'formik';
import type React from 'react';
import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';

const TeamMemberAddModal = lazy(
    () => import('@/components/TeamMemberAddModal'),
);

interface BoardTemplate {
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
    template: BoardTemplate;
    selected?: boolean;
    onClick?: () => void;
}> = ({ template, selected, onClick = () => {} }) => {
    return (
        <div
            className={`cursor-pointer rounded-lg border-2 px-4 py-4 duration-200 ${selected ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
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
    onDelete?: () => void;
}> = ({ member, isSelf, onDelete = () => {} }) => {
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
                        <span>{member.role}</span>
                        <IconButton
                            className="text-red-500 hover:text-red-600"
                            onClick={onDelete}>
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
    templateId: Yup.string().required('Please select a template'),
    members: Yup.array(),
});

const templates: BoardTemplate[] = [
    {
        id: '1',
        title: 'Kanban Board',
        description:
            'Classic task management with To Do, In Progress, and Done columns',
        columns: ['To Do', 'In Progress', 'Done'],
    },
    {
        id: '2',
        title: 'Scrum Board',
        description:
            'Agile development with Backlog, Sprint, Testing, and Complete',
        columns: ['Backlog', 'Sprint', 'Testing', 'Done'],
    },
    {
        id: '3',
        title: 'Marketing Campaign',
        description:
            'Campaign planning with Ideas, Planning, Execution, and Analysis',
        columns: ['Ideas', 'Planning', 'Execution', 'Analysis'],
    },
    {
        id: '4',
        title: 'Custom Board',
        description: 'Start with a blank board and create your own workflow',
        columns: ['Custom', 'Columns'],
    },
];

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

const UserBoardsCreatePage = () => {
    const apiEndpoints = useApiEndpoints();

    const { user } = useAuthProvider();

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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
                members: values.members.map(
                    (m: BoardMember) =>
                        ({
                            memberId: m.id,
                            role: m.role || 'Member',
                        }) as BoardMemberRequest,
                ),
            };

            setLoading(true);
            apiEndpoints.boards
                .addBoard(payload)
                .then(() => {
                    toast.success('Board add successfully!');
                })
                .finally(() => setLoading(false));
        },
    });

    const getError = getFormikTouchError(formik);

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-12 lg:px-24">
            <Suspense fallback={<CircularProgress />}>
                <TeamMemberAddModal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    memberIds={formik.values.members.map((m) => m.id)}
                    onSuccess={(newMember) => {
                        formik.setFieldValue('members', [
                            ...formik.values.members,
                            newMember,
                        ]);
                    }}
                />
            </Suspense>

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

                        <TextArea
                            name="description"
                            label="Description"
                            placeholder="Describe what this board is for and what you hope to accomplish"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={getError('description')}
                        />
                    </div>

                    <div>
                        <h5 className="mb-3 text-lg font-medium">
                            📝 Choose Template
                        </h5>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {templates.map((template, index) => (
                                <TemplateCard
                                    template={template}
                                    selected={
                                        formik.values.templateId === template.id
                                    }
                                    onClick={() =>
                                        formik.setFieldValue(
                                            'templateId',
                                            template.id,
                                        )
                                    }
                                    key={index}
                                />
                            ))}
                            <p
                                className={`overflow-hidden text-sm font-medium text-red-500 transition-all duration-300 ease-in-out ${getError('templateId') ? 'h-4.5 translate-y-0 opacity-100' : 'h-0 translate-y-1 opacity-0'}`}>
                                {getError('templateId')}
                            </p>
                        </div>
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
                                            onDelete={() => {
                                                formik.setFieldValue(
                                                    'members',
                                                    formik.values.members.filter(
                                                        (m) =>
                                                            m.id !== member.id,
                                                    ),
                                                );
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <Button
                            className="mt-3 w-full rounded-lg border-2 border-dashed border-slate-300 py-2 text-gray-600 normal-case hover:border-blue-400 hover:text-blue-700"
                            startIcon={<IconUsersPlus />}
                            onClick={() => setIsOpen(true)}>
                            Add Team Member
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-4">
                        <Button
                            className="border border-gray-200 bg-gray-100/70 px-5 text-gray-500 normal-case hover:bg-gray-200"
                            component={Link}
                            to="/boards">
                            Cancel
                        </Button>
                        <Button
                            className={`px-5 text-white normal-case duration-300 hover:bg-blue-700 ${loading ? 'pointer-events-none bg-gray-300' : 'bg-blue-600'}`}
                            startIcon={<SpinningCircle loading={loading} />}
                            type="submit">
                            Create Board
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserBoardsCreatePage;
