import { useEffect, useState } from 'react';

function useModalTransition(
    open: boolean,
    onClose: () => void,
    delay: number,
): [isVisible: boolean, handleClose: () => void] {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay to ensure DOM is ready for transition
        if (open) {
            setTimeout(() => {
                setIsVisible(true);
            }, 10);
        }
    }, [open]);

    const handleClose = () => {
        // Wait for transition to complete before unmounting
        setIsVisible(false);
        setTimeout(() => {
            onClose();
            // Callback or additional logic can be added here if needed
        }, delay);
    };

    return [isVisible, handleClose];
}

export default useModalTransition;
