import InputField from '@/components/common/input/InputField';
import { useAuthProvider } from '@/contexts/AuthContext';
import { getFormikTouchError } from '@/utilities/utils';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import SpinningCircle from '@/components/common/loader/SpinningCircle';

const validationSchema = Yup.object({
    email: Yup.string().required('Please input'),
    password: Yup.string().required('Please input'),
});

const Login: React.FC = () => {
    const api = useApiEndpoints();
    const { setToken } = useAuthProvider();

    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: (values) => {
            setLoading(true);
            api.auth
                .login(values)
                .then(({ data }: { data: { token: string } }) => {
                    setToken(data.token);
                })
                .finally(() => setLoading(false));
        },
    });

    const getError = getFormikTouchError(formik);

    return (
        <div className="">
            <h2 className="text-center text-2xl font-bold text-gray-950">
                Welcome back
            </h2>
            <p className="mt-2 text-center text-base text-gray-500">
                Enter your credentials to access your account
            </p>

            <form
                className="mt-6 w-md space-y-4"
                onSubmit={formik.handleSubmit}>
                <InputField
                    name="email"
                    label="Email address"
                    placeholder="Enter your email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={getError('email')}
                />
                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={getError('password')}
                />

                <div className="flex justify-center">
                    <a className="group cursor-pointer text-sm font-medium text-purple-500">
                        Forgot password?
                        <span className="block h-0.5 max-w-0 bg-purple-500 transition-all duration-300 ease-out group-hover:max-w-full"></span>
                    </a>
                </div>

                <Button
                    className={`w-md rounded-lg py-3 text-base font-semibold text-gray-50 normal-case transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                        loading
                            ? 'pointer-events-none bg-gray-300'
                            : 'bg-gradient-to-tl from-indigo-400 to-purple-600'
                    }`}
                    startIcon={<SpinningCircle loading={loading} />}
                    type="submit">
                    Sign in to your account
                </Button>
            </form>
        </div>
    );
};

export default Login;
