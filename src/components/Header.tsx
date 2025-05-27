import InputField from '@/components/common/input/InputField';
import { useAuthProvider } from '@/contexts/AuthContext';
import { getFirstLetterOfFirst2Word } from '@/utilities/utils';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
    IconLogout,
    IconSearch,
    IconTablePlus,
    IconUserCircle,
} from '@tabler/icons-react';

import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const { user, handleLogout } = useAuthProvider();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="sticky top-0 flex w-full flex-wrap items-center justify-center gap-3 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-sm md:px-12 lg:px-24">
            <div>
                <Link to="/" className="text-3xl font-bold text-blue-600">
                    TaskFlow
                </Link>
            </div>
            <div className="mx-auto w-md">
                <InputField
                    placeholder="Search boards"
                    startIcon={<IconSearch />}
                />
            </div>

            <div className="flex items-center justify-center gap-4">
                <Button
                    className="bg-blue-600 px-4 font-medium text-gray-50 normal-case transition duration-200 hover:bg-blue-700 hover:shadow-md"
                    startIcon={<IconTablePlus />}>
                    Create Board
                </Button>
                <div>
                    <IconButton onClick={handleClick}>
                        <Avatar
                            className="size-9 cursor-pointer bg-gradient-to-br from-blue-500 to-purple-800 transition-all duration-200 hover:opacity-80"
                            alt={user?.name}
                            children={getFirstLetterOfFirst2Word(user?.name)}
                        />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        transformOrigin={{
                            horizontal: 'right',
                            vertical: 'top',
                        }}
                        anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'bottom',
                        }}>
                        <MenuItem className="space-x-2 duration-300">
                            <IconUserCircle className="size-5" />
                            <span className="text-sm">My account</span>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            className="space-x-2 duration-300"
                            onClick={handleLogout}>
                            <IconLogout className="size-5" />
                            <span className="text-sm">Logout</span>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
    );
};

export default Header;
