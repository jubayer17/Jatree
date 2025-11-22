"use client";

import React from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock } from "lucide-react";

export default function LoginPage() {
    return (
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-200 p-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* your component code */}
                </motion.div>
            </div>
        </MotionConfig>
    );
}
