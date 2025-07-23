import { BoardTable } from '@/components/common/board/BoardTable';
import InputField from '@/components/common/input/InputField';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import useBoardUpdaters from '@/hooks/board-updaters';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { Board, Task } from '@/interfaces/interfaces';
import { getFormikTouchError } from '@/utilities/utils';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    title: Yup.string().required(),
    description: Yup.string(),
    labels: Yup.array().of(
        Yup.object({
            name: Yup.string().required(),
            color: Yup.string().required(),
        }),
    ),
    columns: Yup.array().of(
        Yup.object({
            title: Yup.string().required(),
            // position: Yup.number().required(),
            tasks: Yup.array().of(
                Yup.object({
                    title: Yup.string().required(),
                    description: Yup.string(),
                    // position: Yup.number().required(),
                    priority: Yup.mixed<'High' | 'Medium' | 'Low'>()
                        .oneOf(['High', 'Medium', 'Low'])
                        .required(),
                }),
            ),
        }),
    ),
});

export interface TaskDragState {
    draggedItem: Task | null;
    fromColumn: string | null;
    overColumn: string | null;
    insertionIndex: number | null;
    originalIndex: number | null;
}

const TemplateBoardCreatePage = () => {
    const apiEndpoints = useApiEndpoints();

    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            id: '',
            title: '',
            description: '',
            columns: [],
            labels: [],
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values: Board) => {
            setLoading(true);
            const payload = {
                ...values,
                columns: values.columns.map((column, index) => ({
                    ...column,
                    position: index,
                    tasks: column.tasks.map((task, index) => ({
                        ...task,
                        position: index,
                    })),
                })),
            };

            apiEndpoints.admin.boards
                .addTemplate(payload)
                .then(() => {
                    toast.success('Add template successfully!');

                    formik.resetForm();
                })
                .finally(() => setLoading(false));
        },
    });

    const boardUpdaters = useBoardUpdaters(formik.setValues);

    const getError = getFormikTouchError(formik);

    return (
        <div className="-mx-6 -my-8 flex grow bg-slate-50 md:-mx-12">
            <form
                className="flex grow flex-col"
                onSubmit={formik.handleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                <div className="w-full bg-white">
                    <div className="border-b border-gray-200 px-8 py-4">
                        <h1 className="text-3xl font-bold">
                            Create New Board Template
                        </h1>

                        <div className="mt-4 w-full space-y-4 ps-8">
                            <div className="max-w-84">
                                <InputField
                                    name="title"
                                    label="Template name"
                                    placeholder="Board title (e.g, Website Redesign Project)"
                                    isRequired
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    error={getError('title')}
                                />
                            </div>

                            <InputField
                                name="description"
                                label="Template description"
                                placeholder="Explain when and how teams should use this template..."
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={getError('description')}
                                isArea
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-4">
                            <Button
                                className="border border-gray-200 bg-gray-50 px-5 text-gray-500 normal-case hover:bg-gray-100"
                                component={Link}
                                to="/admin/template-boards">
                                Cancel
                            </Button>
                            <Button
                                className={`px-5 text-white normal-case duration-300 hover:bg-blue-700 ${loading ? 'pointer-events-none bg-gray-300' : 'bg-blue-600'}`}
                                startIcon={<SpinningCircle loading={loading} />}
                                type="submit">
                                Create Template
                            </Button>
                        </div>
                    </div>
                </div>

                <BoardTable
                    columns={formik.values.columns}
                    labels={formik.values.labels}
                    onReorderColumn={boardUpdaters.reorderColumn}
                    onAddColumn={boardUpdaters.addColumn}
                    onUpdateColumn={boardUpdaters.updateColumn}
                    onRemoveColumn={boardUpdaters.removeColumn}
                    onAddTask={boardUpdaters.addTask}
                    onUpdateTask={boardUpdaters.updateTask}
                    onRemoveTask={boardUpdaters.removeTask}
                    onRemoveAllTasks={boardUpdaters.removeAllTasks}
                    onToggleLabel={boardUpdaters.toggleLabel}
                    onReorderTask={boardUpdaters.reorderTask}
                    onAddLabel={boardUpdaters.addLabel}
                    onUpdateLabel={boardUpdaters.updateLabel}
                    onRemoveLabel={boardUpdaters.removeLabel}
                />
            </form>
        </div>
    );
};

export default TemplateBoardCreatePage;
