"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const bootLogs = [
    "INITIALIZING_CORE_SYSTEMS...",
    "ESTABLISHING_SECURE_CONNECTION...",
    "LOADING_DESIGN_TOKENS...",
    "SYNCING_WITH_STUDENTVERSE_NETWORK...",
    "ACCESS_GRANTED"
];

interface BootSequenceProps {
    onComplete: () => void;
    duration?: number;
}

export default function BootSequence({ onComplete, duration = 3000 }: BootSequenceProps) {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, duration / 50);

        // Log sequence
        let currentLog = 0;
        const logInterval = setInterval(() => {
            if (currentLog >= bootLogs.length) {
                clearInterval(logInterval);
                setTimeout(onComplete, 800); // Small delay after completion
                return;
            }
            setLogs(prev => [...prev, bootLogs[currentLog]]);
            currentLog++;
        }, duration / bootLogs.length);

        return () => {
            clearInterval(progressInterval);
            clearInterval(logInterval);
        };
    }, [onComplete, duration]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Loading Ring */}
                <div className="relative w-24 h-24 mx-auto">
                    <motion.div
                        className="absolute inset-0 border-t-2 border-r-2 border-azure rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-2 border-b-2 border-l-2 border-cyan rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-azure font-bold">
                        {progress}%
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-linear-to-r from-azure to-cyan"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Terminal Logs */}
                <div className="h-32 overflow-hidden space-y-2 text-xs sm:text-sm">
                    <AnimatePresence mode='popLayout'>
                        {logs.map((log, i) => (
                            <motion.div
                                key={log}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-gray-400"
                            >
                                <span className="text-azure mr-2">{`>`}</span>
                                {log}
                                {i === logs.length - 1 && (
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="ml-1 inline-block w-2 H-4 bg-azure align-middle"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
