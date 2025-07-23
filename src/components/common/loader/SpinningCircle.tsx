import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

interface SpinningCircleProps {
    /**
     * @default false
     */
    loading?: boolean;

    /**
     * Size of the spinner (in Tailwind units)
     * @default 5
     */
    size?: number;
}

const SpinningCircle: React.FC<SpinningCircleProps> = ({
    loading = false,
    size = 5,
}) => {
    return (
        <CircularProgress
            size={`${size * 4}px`}
            color="inherit"
            className={`transition-all duration-400 ${loading ? `max-w-screen opacity-100` : 'max-w-0 opacity-0'}`}
        />
    );
};

export default SpinningCircle;
