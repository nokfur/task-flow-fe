import React, { useEffect, useState } from 'react';
import useApiEndpoints from '@/hooks/useApiEndpoints';
import type { UserDetail } from '@/interfaces/interfaces';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';
import { getFirstLetterOfFirst2Word } from '@/utilities/utils';
import { UserRole } from '@/constants/constants';
import dayjs from 'dayjs';

const UserManagementPage: React.FC = () => {
    document.title = 'User Management';

    const apiEndpoints = useApiEndpoints();

    const [users, setUsers] = useState<UserDetail[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        apiEndpoints.admin.users
            .getAll()
            .then(({ data }: { data: UserDetail[] }) => {
                setUsers([...data]);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
            headerAlign: 'center',
            renderCell: (params) => {
                const name: string = params.row.name;
                return (
                    <div className="flex h-full items-center gap-4">
                        <Avatar
                            className="size-9 cursor-pointer bg-gradient-to-br from-blue-500 to-purple-800 transition-all duration-200 hover:opacity-80"
                            alt={name}>
                            {getFirstLetterOfFirst2Word(name)}
                        </Avatar>

                        {name}
                    </div>
                );
            },
        },
        {
            field: 'email',
            headerName: 'Email',
            headerAlign: 'center',
            width: 250,
        },
        {
            field: 'role',
            headerName: 'Role',
            headerAlign: 'center',
            align: 'center',
            width: 100,
            type: 'singleSelect',
            valueOptions: [UserRole.Admin, UserRole.Customer],
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            headerAlign: 'center',
            align: 'center',
            width: 100,
            renderCell: (params) =>
                dayjs(params.row.createdAt).format('YYYY-MM-DD'),
        },
    ];

    return (
        <div className="">
            <p className="mb-4 text-3xl font-bold">User List</p>

            <div className="rounded-lg border border-gray-100 shadow-lg">
                <DataGrid
                    loading={loading}
                    rows={users}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    autosizeOnMount={true}
                    disableRowSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: '#f3f4f6',
                            fontWeight: 'bold',
                        },
                        '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                            outline: 'none !important',
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default UserManagementPage;
