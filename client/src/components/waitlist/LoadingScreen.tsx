"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    isVisible: boolean;
    onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible, onComplete }) => {
    const [showText, setShowText] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        if (isVisible) {
            // Show brand text after pills converge
            const textTimer = setTimeout(() => setShowText(true), 2000);
            // Trigger completion callback
            const completeTimer = setTimeout(() => {
                setAnimationComplete(true);
                onComplete?.();
            }, 4000);

            return () => {
                clearTimeout(textTimer);
                clearTimeout(completeTimer);
            };
        } else {
            setShowText(false);
            setAnimationComplete(false);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] bg-[#02040a] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Glow Pulse */}
                    <motion.div
                        className="absolute w-48 h-48 rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(41,98,255,0.3) 0%, rgba(0,0,0,0) 70%)',
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 4, 5],
                            opacity: [0, 0.6, 0.2]
                        }}
                        transition={{ duration: 4, ease: "easeOut" }}
                    />

                    {/* SVG Logo Container */}
                    <motion.div
                        className="relative z-10"
                        animate={animationComplete ? {
                            filter: [
                                'drop-shadow(0 0 10px rgba(41,98,255,0.2))',
                                'drop-shadow(0 0 25px rgba(41,98,255,0.6))',
                                'drop-shadow(0 0 10px rgba(41,98,255,0.2))'
                            ],
                            scale: [1, 1.02, 1]
                        } : {}}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2.6
                        }}
                    >
                        <svg
                            viewBox="0 0 100 100"
                            className="w-64 h-64 md:w-80 md:h-80 overflow-visible"
                        >
                            <defs>
                                <linearGradient id="intro-g1">
                                    <stop offset="0%" stopColor="#00F0FF" />
                                    <stop offset="100%" stopColor="#2962FF" />
                                </linearGradient>
                                <linearGradient id="intro-g2">
                                    <stop offset="0%" stopColor="#6366F1" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                                <linearGradient id="intro-g3">
                                    <stop offset="0%" stopColor="#FFB800" />
                                    <stop offset="100%" stopColor="#FF9100" />
                                </linearGradient>
                            </defs>

                            <g style={{ mixBlendMode: 'screen' }}>
                                {/* Pill 1 - Cyan/Azure */}
                                <motion.rect
                                    x="15"
                                    y="15"
                                    width="70"
                                    height="35"
                                    rx="17.5"
                                    fill="url(#intro-g1)"
                                    initial={{
                                        x: -150,
                                        y: -150,
                                        rotate: 0,
                                        scale: 0.5,
                                        opacity: 0
                                    }}
                                    animate={{
                                        x: 0,
                                        y: 0,
                                        rotate: 405,
                                        scale: 1,
                                        opacity: 0.9
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        ease: [0.2, 0.8, 0.2, 1],
                                        times: [0, 0.6, 1]
                                    }}
                                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                                />

                                {/* Pill 2 - Violet/Red */}
                                <motion.rect
                                    x="15"
                                    y="45"
                                    width="70"
                                    height="35"
                                    rx="17.5"
                                    fill="url(#intro-g2)"
                                    initial={{
                                        x: 150,
                                        y: 50,
                                        rotate: 90,
                                        scale: 0.5,
                                        opacity: 0
                                    }}
                                    animate={{
                                        x: 0,
                                        y: 0,
                                        rotate: -375,
                                        scale: 1,
                                        opacity: 0.9
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        ease: [0.2, 0.8, 0.2, 1],
                                        times: [0, 0.6, 1]
                                    }}
                                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                                />

                                {/* Pill 3 - Gold/Orange */}
                                <motion.rect
                                    x="35"
                                    y="20"
                                    width="35"
                                    height="70"
                                    rx="17.5"
                                    fill="url(#intro-g3)"
                                    initial={{
                                        x: -50,
                                        y: 200,
                                        rotate: -180,
                                        scale: 0.5,
                                        opacity: 0
                                    }}
                                    animate={{
                                        x: 0,
                                        y: 0,
                                        rotate: -30,
                                        scale: 1,
                                        opacity: 0.9
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        ease: [0.2, 0.8, 0.2, 1],
                                        times: [0, 0.6, 1]
                                    }}
                                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                                />

                                {/* Center circle */}
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="4"
                                    fill="#fff"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2, duration: 0.5 }}
                                />
                            </g>
                        </svg>
                    </motion.div>

                    {/* Brand Text */}
                    <motion.div
                        className="absolute bottom-[15%] text-center w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                            Student<span className="text-gray-400 font-normal">Verse</span>
                        </h1>
                    </motion.div>

                    {/* Loading indicator */}
                    <motion.div
                        className="absolute bottom-8 flex items-center gap-2 text-gray-500 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                    >
                        <motion.div
                            className="w-1.5 h-1.5 bg-azure rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.div
                            className="w-1.5 h-1.5 bg-cyan rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                            className="w-1.5 h-1.5 bg-violet rounded-full"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
