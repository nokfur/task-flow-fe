import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

const SpinningCircle: React.FC<{ loading?: boolean; size?: number }> = ({
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
