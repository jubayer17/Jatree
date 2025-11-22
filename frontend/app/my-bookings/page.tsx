'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';

type Ticket = {
    id: string;
    fullname: string;
    phone: string;
    district: string;
    drop_point: string;
    [k: string]: any;
};

const USER_STORAGE_KEY = 'app_user_v1'; // must match your AppContext key

export default function MyBookings() {
    const { user } = useAppContext();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const prevUserRef = useRef<any>(undefined);
    const mountedRef = useRef(true);

    // Compute storage key from a user object
    const storageKeyFor = (u: any | null) =>
        u ? `my_tickets_${u.email ?? u.name ?? 'anon'}` : null;

    // Restore cached tickets on mount (even if AppContext.user is not ready yet)
    useEffect(() => {
        mountedRef.current = true;

        const tryRestoreFromSavedUser = () => {
            try {
                const savedRaw = typeof window !== 'undefined' ? localStorage.getItem(USER_STORAGE_KEY) : null;
                const savedUser = savedRaw ? JSON.parse(savedRaw) : null;

                // prefer per-user key if we have a saved user
                if (savedUser) {
                    const key = storageKeyFor(savedUser);
                    if (key) {
                        const savedTickets = localStorage.getItem(key);
                        if (savedTickets) {
                            const parsed = JSON.parse(savedTickets) as Ticket[];
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                setTickets(parsed);
                                return;
                            }
                        }
                    }
                }

                // fallback: find any my_tickets_ key (useful during dev)
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith('my_tickets_')) {
                        const val = localStorage.getItem(k);
                        if (val) {
                            const parsed = JSON.parse(val) as Ticket[];
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                setTickets(parsed);
                                return;
                            }
                        }
                    }
                }
            } catch (err) {
                console.warn('restore tickets failed', err);
            }
        };

        tryRestoreFromSavedUser();

        const onStorage = (e: StorageEvent) => {
            // update when the same storage key changes
            if (!e.key) return;
            if (e.key.startsWith('my_tickets_')) {
                try {
                    if (!e.newValue) setTickets([]);
                    else {
                        const parsed = JSON.parse(e.newValue) as Ticket[];
                        setTickets(Array.isArray(parsed) ? parsed : []);
                    }
                } catch { }
            }

            // if user storage changed, we might want to switch ticket key
            if (e.key === USER_STORAGE_KEY) {
                tryRestoreFromSavedUser();
            }
        };
        window.addEventListener('storage', onStorage);

        return () => {
            mountedRef.current = false;
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    // Helper to persist tickets for the active user (or saved user)
    const saveTicketsToStorage = (items: Ticket[] | null) => {
        try {
            // prefer current user, fallback to saved user in localStorage
            const activeRaw = localStorage.getItem(USER_STORAGE_KEY);
            const activeUser = activeRaw ? JSON.parse(activeRaw) : null;
            const key = storageKeyFor(user ?? activeUser);
            if (!key) return;

            if (!items || items.length === 0) localStorage.removeItem(key);
            else localStorage.setItem(key, JSON.stringify(items));
        } catch (err) {
            console.warn('saveTicketsToStorage failed', err);
        }
    };

    // Load tickets from server
    const loadTicketsFromServer = useCallback(
        async (token?: string | undefined) => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await fetch('http://127.0.0.1:8000/tickets/my', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    const data = await res.json().catch(() => []);
                    const arr = Array.isArray(data) ? data : [];
                    setTickets(arr);
                    saveTicketsToStorage(arr);
                } else {
                    if (res.status === 401 || res.status === 403) {
                        // unauthorized — do not override a cached view automatically
                        console.warn('tickets fetch unauthorized');
                    }
                }
            } catch (err) {
                console.error('loadTicketsFromServer err', err);
                // keep cached tickets if fetch fails
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // watch user changes: fetch when token appears, only clear on real logout
    useEffect(() => {
        const prev = prevUserRef.current;

        // if user became available (login/restore), fetch fresh server copy
        if (user?.token) {
            loadTicketsFromServer(user.token);
        }

        // detect logout (prev existed but now null)
        if (prev && !user) {
            // real logout — clear tickets and storage for that user
            const prevKey = storageKeyFor(prev);
            try {
                if (prevKey) localStorage.removeItem(prevKey);
            } catch { }
            setTickets([]);
        }

        prevUserRef.current = user;
    }, [user, loadTicketsFromServer]);

    // delete with optimistic UI + rollback
    const deleteTicket = async (id: string) => {
        // require token to perform server delete; still allow UI update locally if you want
        if (!user?.token) {
            // if no token present, just remove locally and persist to stored user (if any)
            const prev = tickets;
            const next = prev.filter((t) => t.id !== id);
            setTickets(next);
            saveTicketsToStorage(next);
            return;
        }

        const prev = tickets;
        const next = prev.filter((t) => t.id !== id);
        setTickets(next);
        saveTicketsToStorage(next);

        setSaving(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/tickets/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (!res.ok) {
                // rollback
                console.warn('delete failed on server, rolling back', await res.text());
                setTickets(prev);
                saveTicketsToStorage(prev);
            }
        } catch (err) {
            console.error('deleteTicket err', err);
            setTickets(prev);
            saveTicketsToStorage(prev);
        } finally {
            setSaving(false);
        }
    };

    // UI
    // if user is null but we have cached tickets, show them (user may be restoring)
    const hasUser = !!user;

    return (
        <>
            <Navbar />
            <div className="p-10">
                <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

                {!hasUser && tickets.length === 0 ? (
                    <p className="p-6">Please login to see your bookings.</p>
                ) : loading ? (
                    <p>Loading...</p>
                ) : tickets.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border-b">Name</th>
                                    <th className="px-4 py-2 border-b">Phone</th>
                                    <th className="px-4 py-2 border-b">District</th>
                                    <th className="px-4 py-2 border-b">Drop Point</th>
                                    <th className="px-4 py-2 border-b">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((t) => (
                                    <tr key={t.id} className="text-center">
                                        <td className="px-4 py-2 border-b">{t.fullname}</td>
                                        <td className="px-4 py-2 border-b">{t.phone}</td>
                                        <td className="px-4 py-2 border-b">{t.district}</td>
                                        <td className="px-4 py-2 border-b">{t.drop_point}</td>
                                        <td className="px-4 py-2 border-b">
                                            <button
                                                disabled={saving}
                                                onClick={() => deleteTicket(t.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
