import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

const SpinningCircle: React.FC<{ loading?: boolean }> = ({
    loading = false,
}) => {
    return (
        <CircularProgress
            size="20px"
            color="inherit"
            className={`transition-all duration-400 ${loading ? 'max-w-5 opacity-100' : 'max-w-0 opacity-0'}`}
        />
    );
};

export default SpinningCircle;
