"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface VelocityWeaveProps {
    variant?: 'subtle' | 'intense' | 'dual';
}

const VelocityWeave = React.memo(({ variant = 'dual' }: VelocityWeaveProps) => {
    const gridLines = useMemo(() => Array.from({ length: 20 }), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-black" />

            {/* Vertical Lines */}
            <div className="absolute inset-0 flex justify-between opacity-10">
                {gridLines.map((_, i) => (
                    <motion.div
                        key={`v-${i}`}
                        className="w-px h-full bg-linear-to-b from-transparent via-azure/50 to-transparent"
                        animate={{
                            y: ["-100%", "100%"],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Horizontal Lines */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                {gridLines.map((_, i) => (
                    <motion.div
                        key={`h-${i}`}
                        className="h-px w-full bg-linear-to-r from-transparent via-violet/50 to-transparent"
                        animate={{
                            x: ["-100%", "100%"],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Radial Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/80 to-black" />

            {/* Accent Glows */}
            <motion.div
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-azure/20 blur-[100px] rounded-full mix-blend-screen"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet/20 blur-[100px] rounded-full mix-blend-screen"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />
        </div>
    );
});

VelocityWeave.displayName = "VelocityWeave";

export default VelocityWeave;
