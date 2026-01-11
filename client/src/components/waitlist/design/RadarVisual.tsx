"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface RadarVisualProps {
    size?: 'sm' | 'md' | 'lg';
    blips?: Array<{ x: number, y: number, color: string }>;
}

const RadarVisual = memo(function RadarVisual({
    size = 'md',
    blips = []
}: RadarVisualProps) {
    const sizeClasses = {
        sm: "w-32 h-32 opacity-30",
        md: "w-64 h-64",
        lg: "w-96 h-96"
    };

    return (
        <div className={`relative ${sizeClasses[size]} rounded-full border border-white/10 overflow-hidden bg-black/50 backdrop-blur-sm`}>
            {/* Grid Lines */}
            <div className="absolute inset-0 border border-white/5 rounded-full scale-75" />
            <div className="absolute inset-0 border border-white/5 rounded-full scale-50" />
            <div className="absolute inset-0 border border-white/5 rounded-full scale-25" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-white/5" />
                <div className="h-full w-px bg-white/5 absolute" />
            </div>

            {/* Scanning Line */}
            <motion.div
                className="absolute inset-0 origin-center bg-linear-to-tr from-transparent via-transparent to-azure/20"
                style={{ borderRight: '1px solid rgba(41, 98, 255, 0.3)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Blips */}
            {blips.map((blip, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-1.5 h-1.5 rounded-full bg-${blip.color} shadow-[0_0_8px_currentColor]`}
                    style={{
                        left: `${blip.x}%`,
                        top: `${blip.y}%`,
                        color: blip.color === 'azure' ? '#2962FF' :
                            blip.color === 'cyan' ? '#00F0FF' :
                                blip.color === 'gold' ? '#FFB800' : '#EF4444'
                    }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Center Point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-azure shadow-[0_0_10px_#2962FF]" />
        </div>
    );
});

export default RadarVisual;
