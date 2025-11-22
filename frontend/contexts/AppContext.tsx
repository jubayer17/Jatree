'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface User {
    name: string;
    email: string;
    token?: string;
    [k: string]: any;
}

export interface AppContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'app_user_v1'; // change key if you need to bust stored state

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Try to restore from localStorage first (fast)
    useEffect(() => {
        try {
            const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_USER_KEY) : null;
            if (saved) {
                setUser(JSON.parse(saved));
                setLoading(false);
                // Optionally verify server-side token in background
                fetchUser().catch(() => { });
                return;
            }
        } catch (err) {
            console.warn('restore user failed', err);
        }
        // If no saved user, attempt fetch from /auth/me (cookie flow)
        fetchUser().catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist user whenever it changes
    useEffect(() => {
        try {
            if (user) localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
            else localStorage.removeItem(LOCAL_USER_KEY);
        } catch (err) {
            console.warn('persist user failed', err);
        }
    }, [user]);

    // Fetch current user (handles cookie-based auth and token-based)
    const fetchUser = async () => {
        setLoading(true);
        try {
            // If we have a token locally, prefer token-auth
            const local = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_USER_KEY) : null;
            const parsed: User | null = local ? JSON.parse(local) : null;
            const headers: Record<string, string> = {};

            let res: Response;
            if (parsed?.token) {
                headers['Authorization'] = `Bearer ${parsed.token}`;
                res = await fetch('http://localhost:8000/auth/me', { method: 'GET', headers });
            } else {
                // try cookie-based session
                res = await fetch('http://localhost:8000/auth/me', {
                    method: 'GET',
                    credentials: 'include',
                });
            }

            if (!res.ok) {
                setUser(null);
            } else {
                const data = await res.json().catch(() => null);
                if (data && (data.name || data.email)) {
                    // If server returned user + token, store it; otherwise merge token we had
                    const finalUser: User = {
                        name: data.name ?? parsed?.name ?? '',
                        email: data.email ?? parsed?.email ?? '',
                        ...(data.token ? { token: data.token } : parsed?.token ? { token: parsed.token } : {}),
                        ...data,
                    };
                    setUser(finalUser);
                } else {
                    setUser(null);
                }
            }
        } catch (err) {
            console.warn('fetchUser failed', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Login: store token + user
    const login = async (email: string, password: string) => {
        try {
            const res = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                credentials: 'include', // keep if backend sets cookies too
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json().catch(() => null);

            if (res.ok && data?.user) {
                const loggedUser: User = { ...data.user, ...(data.token ? { token: data.token } : {}) };
                setUser(loggedUser);
                toast.success('Logged in successfully!');
                router.push('/');
            } else {
                toast.error(data?.detail || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Login failed');
        }
    };

    // Signup
    const signup = async (name: string, email: string, password: string) => {
        try {
            const res = await fetch('http://localhost:8000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (res.ok) {
                toast.success('Account created successfully!');
                router.push('/login');
            } else {
                const data = await res.json().catch(() => null);
                toast.error(data?.detail || 'Signup failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Signup failed');
        }
    };

    // Logout
    const logout = async () => {
        try {
            const res = await fetch('http://localhost:8000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                setUser(null);
                try {
                    localStorage.removeItem(LOCAL_USER_KEY);
                } catch { }
                router.push('/login');
                toast.info('Logged out');
            } else {
                toast.error('Logout failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Logout failed');
        }
    };

    return (
        <AppContext.Provider value={{ user, setUser, loading, login, signup, logout, fetchUser }}>
            {children}
            <ToastContainer position="top-right" />
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppContextProvider');
    return context;
};
