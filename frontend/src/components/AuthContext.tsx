import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface AuthContextType {
    isAuthenticated: boolean;
    nomeCompleto: string | null;
    email: string | null;
    role: string | null;
    login: (token: string, nomeCompleto?: string, email?: string, role?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
    const [nomeCompleto, setNomeCompleto] = useState<string | null>(localStorage.getItem('nomeCompleto'));
    const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

    const login = (token: string, nomeCompleto?: string, email?: string, role?: string) => {
        localStorage.setItem('token', token);
        if (nomeCompleto) {
            localStorage.setItem('nomeCompleto', nomeCompleto);
            setNomeCompleto(nomeCompleto);
        }
        if (email) {
            localStorage.setItem('email', email);
            setEmail(email);
        }
        if (role) {
            localStorage.setItem('role', role);
            setRole(role);
        }
        setIsAuthenticated(true);
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem('nomeCompleto');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        setNomeCompleto(null);
        setEmail(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, nomeCompleto, email, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
