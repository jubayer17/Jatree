"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { FaBus, FaTicketAlt, FaPhoneAlt, FaUserCircle } from "react-icons/fa";

interface User {
    name: string;
    email: string;
}

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Fetch current user from backend (httpOnly cookie flow)
    const fetchCurrentUser = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/auth/me", {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) {
                setUser(null);
            } else {
                const data = await res.json().catch(() => null);
                if (data && (data.email || data.name)) {
                    setUser({ name: data.name, email: data.email });
                } else {
                    setUser(null);
                }
            }
        } catch (err) {
            console.warn("fetchCurrentUser failed", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    // Close dropdown when clicking outside or pressing Esc
    useEffect(() => {
        function handleDocClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", handleDocClick);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleDocClick);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:8000/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                sessionStorage.removeItem("auth_token");
                (window as any).__AUTH_TOKEN = undefined;
                setUser(null);
                setOpen(false);
                router.replace("/login");
            } else {
                console.warn("logout failed", await res.text());
            }
        } catch (err) {
            console.error("logout error", err);
        }
    };

    const avatarInitials = (name?: string) => {
        if (!name) return null;
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <nav className="flex justify-between items-center py-5 px-6 md:px-12 bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
            {/* Left */}
            <div className="flex items-center gap-3">
                <FaBus className="text-2xl -mr-3 ml-5 md:text-3xl text-blue-600" />
                <Button
                    className="text-lg md:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                    variant="link"
                >
                    <Link href="/">Jatree</Link>
                </Button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4 md:gap-6">
                <Button
                    className="hidden md:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                    variant="link"
                >
                    <FaTicketAlt /> <span className="hidden sm:inline">Book a Ticket</span>
                </Button>

                <Button
                    className="hidden md:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                    variant="link"
                >
                    <FaPhoneAlt /> <span className="hidden sm:inline">Contact Us</span>
                </Button>

                {/* Auth area */}
                <div className="relative" ref={dropdownRef}>
                    {loading ? (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400 animate-pulse" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                    ) : user ? (
                        <button
                            aria-haspopup="true"
                            aria-expanded={open}
                            onClick={() => setOpen((s) => !s)}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300"
                            title={user.name || user.email}
                        >
                            <span className="font-semibold">{avatarInitials(user.name) || <FaUserCircle />}</span>
                        </button>
                    ) : (
                        <Button
                            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                            variant="link"
                            onClick={() => router.push("/login")}
                        >
                            <FaUserCircle /> <span className="hidden sm:inline">Login</span>
                        </Button>
                    )}

                    {open && user && (
                        <div
                            role="menu"
                            aria-label="User menu"
                            className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                        >
                            <div className="px-4 py-2">
                                <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <div className="border-t border-gray-100 my-2" />
                            <div className="px-2 py-1 flex flex-col gap-1">
                                <Link
                                    href="/profile"
                                    className="px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 rounded text-sm text-red-600 hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
