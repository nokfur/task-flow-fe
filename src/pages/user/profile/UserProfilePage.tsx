import { useFormik } from 'formik';
import AccountSetting from '@/assets/images/AccountSetting.svg';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import type { UserProfile } from '@/interfaces/interfaces';
import InputField from '@/components/common/input/InputField';
import { getFormikTouchError } from '@/utilities/utils';
import Button from '@mui/material/Button';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import { toast } from 'react-toastify';
import Skeleton from '@mui/material/Skeleton';
import { useAuthProvider } from '@/contexts/AuthContext';

const validationSchema = Yup.object({
    name: Yup.string().required('Please input your name'),
});

const UserProfilePage: React.FC = () => {
    document.title = 'Account Settings';

    const apiEndpoints = useApiEndpoints();
    const { setToken } = useAuthProvider();

    const [userInfo, setUserInfo] = useState<UserProfile>({
        id: '',
        name: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLoading(true);
        apiEndpoints.users
            .getProfile()
            .then(({ data }: { data: UserProfile }) => {
                setUserInfo(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const formik = useFormik({
        initialValues: userInfo,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values) => {
            setSaving(true);

            apiEndpoints.users
                .updateProfile(values)
                .then(({ data }: { data: { token: string } }) => {
                    toast.success('Profile saved!');
                    setToken(data.token);
                })
                .finally(() => setSaving(false));
        },
    });

    const getError = getFormikTouchError(formik);

    return (
        <div className="flex w-full justify-center">
            <div className="mt-24">
                <img src={AccountSetting} />

                <h1 className="my-8 text-2xl font-medium">
                    Manage your personal information
                </h1>

                <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col gap-2">
                    {loading ? (
                        <>
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                            <div className="mt-2 flex items-center justify-end">
                                <Skeleton className="h-14 w-30" />
                            </div>
                        </>
                    ) : (
                        <>
                            <InputField
                                label="Email"
                                name="email"
                                disabled
                                value={formik.values.email}
                            />

                            <InputField
                                label="Name"
                                isRequired
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={getError('name')}
                            />

                            <div className="mt-2 flex items-center justify-end">
                                <Button
                                    className="w-32 bg-violet-600 px-5 text-gray-50 normal-case duration-300 hover:bg-violet-700 disabled:pointer-events-none disabled:bg-gray-300"
                                    disabled={saving}
                                    startIcon={
                                        <SpinningCircle loading={saving} />
                                    }
                                    type="submit">
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;
