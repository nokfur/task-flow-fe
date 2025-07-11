import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmationDialog: React.FC<{
    open: boolean;
    onConfirm?: () => void;
    onClose: () => void;
    title?: string;
    description?: string;
}> = ({
    open,
    onConfirm = () => {},
    onClose = () => {},
    title,
    description,
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 normal-case hover:bg-gray-50"
                    onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white normal-case transition-colors hover:bg-blue-700"
                    onClick={handleConfirm}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
