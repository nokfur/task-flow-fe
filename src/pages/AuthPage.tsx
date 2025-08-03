import SpinningCircle from '@/components/common/loader/SpinningCircle';
import Button from '@mui/material/Button';
import { AnimatePresence, motion } from 'framer-motion';
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
        <motion.span
            key={index}
            className="h inline-block cursor-pointer text-gray-50"
            whileHover={{
                scale: 1.15,
                rotate: index % 2 === 0 ? 15 : -15,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
            }}>
            {letter}
        </motion.span>
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
                <div className="relative mb-8 inline-flex rounded-lg bg-gray-100 p-1">
                    {tabs.map((tab, index) => {
                        const isActive = activeTab === index;
                        return (
                            <Button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`relative z-10 w-28 rounded-lg py-2 text-base font-semibold normal-case transition-colors duration-300 ${
                                    isActive
                                        ? 'text-gray-950'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}>
                                {tab.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute inset-0 -z-10 rounded-lg bg-white shadow-md"
                                        transition={{
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 0.5,
                                        }}
                                    />
                                )}
                            </Button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {tabs.map((tab, index) =>
                        activeTab === index ? (
                            <Suspense
                                key={index}
                                fallback={
                                    <SpinningCircle
                                        loading
                                        className="text-violet-500"
                                    />
                                }>
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: 'easeInOut',
                                    }}
                                    className="overflow-hidden">
                                    {tab.render()}
                                </motion.div>
                            </Suspense>
                        ) : null,
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AuthPage;
