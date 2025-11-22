"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock } from "lucide-react";

/**
 * LoginPage
 * - supports httpOnly cookie flow (recommended)
 * - also supports token-in-body fallback (sessionStorage, safe guard)
 */
export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const safeStoreToken = (token: string | null) => {
        if (!token) return null;
        try {
            // small safety: avoid storing huge tokens
            if (token.length > 5000) {
                console.warn("[auth] token too large to store safely:", token.length);
                return null;
            }
            sessionStorage.setItem("auth_token", token);
            return "sessionStorage";
        } catch (e) {
            console.warn("[auth] sessionStorage failed, keeping token in memory fallback", e);
            (window as any).__AUTH_TOKEN = token;
            return "memory";
        }
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        setLoading(true);
        try {
            console.log("[login] sending credentials (include cookie flow)", { email });

            // important: credentials: "include" so cookie set by backend is accepted
            const res = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password: password.slice(0, 72) }), // truncate for bcrypt safety
            });

            console.log("[login] status", res.status, "ok?", res.ok);

            // try to parse JSON if any
            let data: any = {};
            try {
                data = await res.json();
                console.log("[login] server json:", data);
            } catch (jsonErr) {
                console.log("[login] no JSON body or parse failed (likely cookie-only flow)");
            }

            if (!res.ok) {
                setError(data?.detail || data?.error || "Login failed");
                return;
            }

            // If server returns token in body (fallback), store safely
            if (data?.token) {
                const where = safeStoreToken(data.token);
                console.log("[login] token saved in:", where);
            } else {
                // Cookie-only flow: verify by calling /auth/me (server reads cookie)
                try {
                    const meRes = await fetch("http://localhost:8000/auth/me", {
                        method: "GET",
                        credentials: "include",
                    });
                    if (meRes.ok) {
                        const me = await meRes.json();
                        console.log("[login] /auth/me returned:", me);
                        // optionally set user in memory/context here
                    } else {
                        console.warn("[login] /auth/me failed", await meRes.text());
                        // Not fatal — cookie might be set but me route requires extra setup
                    }
                } catch (meErr) {
                    console.warn("[login] failed to call /auth/me", meErr);
                }
            }

            setSuccess("Logged in — redirecting...");
            // replace instead of push to avoid extra history entry
            try {
                await router.replace("/");
                // safety fallback
                setTimeout(() => {
                    if (typeof window !== "undefined" && window.location.pathname !== "/") {
                        window.location.href = "/";
                    }
                }, 300);
            } catch (navErr) {
                console.warn("[login] router.replace failed, fallback", navErr);
                window.location.href = "/";
            }
        } catch (err: any) {
            console.error("[login] fetch error", err);
            setError("Network error. Make sure backend is running and CORS allows credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-200 p-5">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Card className="w-[370px] shadow-xl rounded-2xl backdrop-blur-sm bg-white/70">
                        <CardContent className="p-6">
                            <h1 className="text-3xl font-semibold text-center mb-6">Sohoj Ticket</h1>
                            <h2 className="text-xl font-medium text-center mb-4">Login</h2>

                            <form className="space-y-4" onSubmit={handleLogin}>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                    <Input placeholder="Email" type="email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                    <Input placeholder="Password" type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <Button type="submit" className="w-full py-5 text-lg rounded-xl" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>

                                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                                {success && <p className="text-green-500 text-sm text-center mt-2">{success}</p>}
                            </form>

                            <p className="text-center mt-4 text-sm">
                                Don’t have an account? <Link href="/sign-up" className="underline font-medium">Sign Up</Link>
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </MotionConfig>
    );
}
