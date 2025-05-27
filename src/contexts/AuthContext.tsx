import type { User } from '@/interfaces/interfaces';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import type { UserRole } from '@/constants/constants';

const StorageTokenKey = 'ACCESS_TOKEN';

export interface DecodedToken {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;

    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;

    handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem(StorageTokenKey),
    );

    useEffect(() => {
        if (token) {
            localStorage.setItem(StorageTokenKey, token);

            const decodedToken = jwtDecode<DecodedToken>(token);
            setUser({ ...decodedToken, name: decodedToken.name });
        } else {
            localStorage.removeItem(StorageTokenKey);

            setUser(null);
        }
    }, [token]);

    const handleLogout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                setToken,
                handleLogout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuthProvider = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthProvider must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuthProvider };
