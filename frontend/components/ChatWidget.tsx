"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, UserCircleIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { usePathname } from "next/navigation";

type Message = {
    sender: "user" | "ai";
    text: string;
};

type ChatWidgetProps = {
    excludePages?: string[];
};

export default function ChatWidget({ excludePages = [] }: ChatWidgetProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // 🔥 Your AI branding
    const AI_NAME = "Nexo AI";
    const AI_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712100.png";
    const USER_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    if (excludePages.includes(pathname)) return null;

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage: Message = { sender: "user", text: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/chat/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ q: trimmed }),
            });

            const data = await res.json();
            const aiMessage: Message = {
                sender: "ai",
                text: data.answer || "Hmm… couldn't process that!",
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "Server error ⚠️ Try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[999]">

            {/* Floating Icon Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition transform hover:scale-110"
                >
                    <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                </button>
            )}

            {/* Chat Box */}
            {open && (
                <div className="w-80 h-[460px] bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fadeInUp">

                    {/* Header */}
                    <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-sm">
                        <span className="font-semibold tracking-wide">{AI_NAME}</span>
                        <button onClick={() => setOpen(false)}>
                            <XMarkIcon className="w-6 h-6 hover:text-gray-300 transition" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    "flex items-start gap-3",
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                {/* AI Avatar */}
                                {msg.sender === "ai" && (
                                    <img
                                        src={AI_AVATAR}
                                        className="w-8 h-8 mt-1 rounded-full border shadow-sm"
                                    />
                                )}

                                {/* Bubble */}
                                <div
                                    className={clsx(
                                        "px-4 py-2 text-sm rounded-2xl max-w-[70%] shadow-sm",
                                        msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                                    )}
                                >
                                    {msg.text}
                                </div>

                                {/* User Avatar */}
                                {msg.sender === "user" && (
                                    <img
                                        src={USER_AVATAR}
                                        className="w-8 h-8 rounded-full border shadow-sm"
                                    />
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex items-start gap-3">
                                <img src={AI_AVATAR} className="w-8 h-8 rounded-full border shadow-sm" />
                                <div className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-2xl shadow-sm animate-pulse">
                                    {AI_NAME} is typing…
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type something…"
                            disabled={loading}
                            className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-200"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-1"
                        >
                            <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
                        </button>
                    </form>

                </div>
            )}
        </div>
    );
}
