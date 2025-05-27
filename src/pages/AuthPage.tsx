import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React, { lazy, Suspense, useState, type ReactNode } from 'react';

const Login = lazy(() => import('@/components/auth/Login'));
const SignUp = lazy(() => import('@/components/auth/SignUp'));

const features: string[] = [
    'Intuitive Kanban boards and task management',
    'Real-time collaboration and updates',
    'Advanced analytics and reporting',
    'Enterprise-grade security',
];

const tabs: { name: string; render: () => ReactNode }[] = [
    {
        name: 'Log in',
        render: () => <Login />,
    },
    {
        name: 'Sign up',
        render: () => <SignUp />,
    },
];

const LetterHoverEffect: React.FC<{ text: string }> = ({ text }) => {
    return text.split('').map((letter, index) => (
        <div
            key={index}
            className={`inline-block cursor-grab from-orange-400 to-blue-400 text-gray-50 transition-all duration-300 ease-out hover:scale-115 hover:bg-gradient-to-br hover:bg-clip-text hover:text-transparent ${index & 1 ? 'hover:-rotate-15' : 'hover:rotate-15'}`}>
            {letter}
        </div>
    ));
};

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="grid h-screen md:grid-cols-1 lg:grid-cols-2">
            <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600 py-8">
                <div className="animate-float absolute top-[20%] left-[10%] h-20 w-20 rounded-full bg-white/10"></div>
                <div className="animate-float animation-delay-2000 absolute top-[60%] right-[15%] h-15 w-15 rounded-full bg-white/10"></div>
                <div className="animate-float animation-delay-4000 absolute bottom-[20%] left-[20%] h-10 w-10 rounded-full bg-white/10"></div>

                <h1 className="mb-7 text-center text-6xl font-extrabold text-gray-50">
                    <LetterHoverEffect text="TaskFlow" />
                </h1>
                <h2 className="mb-5 text-center text-3xl font-bold text-gray-50">
                    Revolutionize Your Team's Productivity
                </h2>
                <p className="mb-8 max-w-102 text-center text-xl text-gray-50">
                    Join over 100,000+ teams using Task Management to organize
                    projects, track progress, and collaborate seamlessly.
                </p>

                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-2 text-lg text-white">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                                ✓
                            </span>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col items-center justify-center bg-gray-50 py-8">
                <h2 className="mb-3 text-4xl font-extrabold text-gray-950">
                    Welcome to TaskFlow
                </h2>
                <div className="mb-8 rounded-lg bg-gray-100 p-1">
                    {tabs.map((tab, index) => (
                        <Button
                            key={index}
                            className={`w-28 rounded-lg py-2 text-base font-semibold normal-case ${activeTab === index ? 'bg-gray-50 text-gray-950 shadow-md' : 'text-gray-500'}`}
                            onClick={() => setActiveTab(index)}>
                            {tab.name}
                        </Button>
                    ))}
                </div>

                <div className="">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                activeTab === index
                                    ? 'max-h-screen translate-x-0 opacity-100 delay-700'
                                    : 'max-h-0 translate-x-8 opacity-0'
                            }`}>
                            <Suspense fallback={<CircularProgress />}>
                                {tab.render()}
                            </Suspense>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
