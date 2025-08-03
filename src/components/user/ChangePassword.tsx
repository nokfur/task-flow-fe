import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getFormikTouchError } from '../../utilities/utils';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { useAuthProvider } from '@/contexts/AuthContext';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import InputField from '@/components/common/input/InputField';
import { useState } from 'react';
import SpinningCircle from '@/components/common/loader/SpinningCircle';

const validationSchema = Yup.object({
    oldPassword: Yup.string().required('Please input'),
    password: Yup.string()
        .required('Please input')
        // .matches(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/,
        //     'Please input at least 6 characters, 1 uppercase, 1 lowercase, and a number'
        // )
        .max(20, 'Password not exceeding 20 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords are not match')
        .required('Please input'),
});

const ChangePassword = () => {
    document.title = 'Change Password';

    const apiEndpoints = useApiEndpoints();
    const { handleLogout } = useAuthProvider();

    const [updating, setUpdating] = useState(false);

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                oldPassword: values.oldPassword,
                newPassword: values.password,
            };

            setUpdating(true);
            apiEndpoints.users
                .changePassword(payload)
                .then(() => {
                    toast.success('Password updated. Please re-login!');
                    handleLogout();
                })
                .finally(() => {
                    setUpdating(false);
                });
        },
    });

    const getError = getFormikTouchError(formik);

    return (
        <div className="relative w-full max-w-lg">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col justify-center gap-2">
                    <p className="text-2xl font-bold">Change Password</p>
                    <p className="">
                        Update your password to keep your account secure
                    </p>
                </div>

                <form
                    className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white px-8 py-8"
                    onSubmit={formik.handleSubmit}>
                    <InputField
                        name="oldPassword"
                        label="Old Password"
                        type="password"
                        isRequired
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        error={getError('oldPassword')}
                    />

                    <InputField
                        name="password"
                        label="New Password"
                        type="password"
                        isRequired
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={getError('password')}
                    />

                    <InputField
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        isRequired
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={getError('confirmPassword')}
                    />

                    <div className="flex justify-center">
                        <Button
                            className="w-36 bg-violet-600 py-2 font-semibold text-gray-50 normal-case duration-300 hover:bg-violet-700 disabled:pointer-events-none disabled:bg-gray-300"
                            disabled={updating}
                            startIcon={<SpinningCircle loading={updating} />}
                            type="submit">
                            Update
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
