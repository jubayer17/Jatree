"use client";
import { Mail, User, Lock } from "lucide-react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("http://127.0.0.1:8000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.detail || "Something went wrong!");
            } else {
                setSuccess("Account created successfully!");
                setName("");
                setEmail("");
                setPassword("");
            }
        } catch (err) {
            setError("Network error, try again!");
        }

        setLoading(false);
    };

    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-200 p-5">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <Card className="w-[370px] shadow-xl rounded-2xl backdrop-blur-sm bg-white/70">
                        <CardContent className="p-6">
                            <h1 className="text-3xl font-semibold text-center mb-6">Sohoj Ticket</h1>
                            <h2 className="text-xl font-medium text-center mb-4">Create Account</h2>

                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                    <Input
                                        placeholder="Full Name"
                                        type="text"
                                        className="pl-10"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <Button
                                    className="w-full py-5 text-lg rounded-xl"
                                    onClick={handleSignup}
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Create Account"}
                                </Button>

                                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                                {success && <p className="text-green-500 text-sm text-center mt-2">{success}</p>}
                            </div>

                            <p className="text-center mt-4 text-sm">
                                Already have an account? <Link href="/login" className="underline font-medium">Login</Link>
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </MotionConfig>
    );
}
