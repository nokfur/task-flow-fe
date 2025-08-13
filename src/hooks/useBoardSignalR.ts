import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

function useBoardSignalR(boardId: string, onReceiveUpdate = () => {}) {
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!boardId) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_API_BASE_URL + '/board-hub')
            .withAutomaticReconnect()
            .build();

        connection.start().then(async () => {
            await connection.invoke('JoinBoard', boardId);
        });

        connection.on('BoardUpdated', (updatedBoardId) => {
            if (updatedBoardId === boardId) {
                onReceiveUpdate?.();
            }
        });

        connectionRef.current = connection;

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [boardId]);

    return connectionRef.current;
}

export default useBoardSignalR;
