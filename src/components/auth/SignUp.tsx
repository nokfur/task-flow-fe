import InputField from '@/components/common/input/InputField';
import SpinningCircle from '@/components/common/loader/SpinningCircle';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import { getFormikTouchError } from '@/utilities/utils';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Please input'),
    email: Yup.string()
        .email('Please input a valid email')
        .required('Please input'),
    password: Yup.string().required('Please input'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Password do not match')
        .required('Please input'),
});

const SignUp = () => {
    const api = useApiEndpoints();

    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: (values) => {
            setLoading(true);
            api.auth
                .register(values)
                .then(() => {
                    toast.success('Register success');
                })
                .finally(() => setLoading(false));
        },
    });

    const getError = getFormikTouchError(formik);

    return (
        <div>
            <h2 className="text-center text-2xl font-bold text-gray-950">
                Create your account
            </h2>
            <p className="mt-2 text-center text-base text-gray-500">
                Start your productivity journey with TaskFlow
            </p>

            <form
                className="mt-6 w-md space-y-4"
                onSubmit={formik.handleSubmit}>
                <InputField
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                    isRequired
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={getError('name')}
                />
                <InputField
                    name="email"
                    label="Email address"
                    placeholder="Enter your email address"
                    type="email"
                    isRequired
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={getError('email')}
                />
                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    isRequired
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={getError('password')}
                />
                <InputField
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="Confirm your password"
                    type="password"
                    isRequired
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={getError('confirmPassword')}
                />

                <Button
                    className={`mt-2 w-md rounded-lg py-3 text-base font-semibold text-gray-50 normal-case transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                        loading
                            ? 'pointer-events-none bg-gray-300'
                            : 'bg-gradient-to-tl from-indigo-400 to-purple-600'
                    }`}
                    startIcon={<SpinningCircle loading={loading} />}
                    type="submit">
                    Create your account
                </Button>
            </form>
        </div>
    );
};

export default SignUp;
