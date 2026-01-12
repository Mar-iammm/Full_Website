"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

interface HolographicPlanetProps {
    size?: 'sm' | 'md' | 'lg';
}

const HolographicPlanet = memo(function HolographicPlanet({ size = 'md' }: HolographicPlanetProps) {
    const sizes = {
        sm: "w-16 h-16",
        md: "w-24 h-24 sm:w-32 sm:h-32",
        lg: "w-48 h-48"
    };

    return (
        <div className={`relative ${sizes[size]} shrink-0`}>
            {/* Planet Body */}
            <motion.div
                className="absolute inset-0 rounded-full overflow-hidden border border-violet/30 bg-violet/5 shadow-[0_0_30px_rgba(123,44,191,0.2)]"
                animate={{
                    boxShadow: [
                        "0 0 30px rgba(123,44,191,0.2)",
                        "0 0 50px rgba(123,44,191,0.4)",
                        "0 0 30px rgba(123,44,191,0.2)"
                    ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <div className="absolute inset-0 bg-linear-to-tr from-violet/20 via-transparent to-cyan/20" />

                {/* Holographic Grid */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: "radial-gradient(circle at center, transparent 30%, rgba(255,255,255,0.1) 31%, transparent 32%)",
                        backgroundSize: "200% 200%"
                    }}
                />
            </motion.div>

            {/* Orbital Ring 1 */}
            <motion.div
                className="absolute inset-[-10%] border border-cyan/20 rounded-full"
                style={{ rotateX: 60, rotateY: 15 }}
                animate={{ rotateZ: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Orbital Ring 2 */}
            <motion.div
                className="absolute inset-[-20%] border border-violet/20 rounded-full"
                style={{ rotateX: 70, rotateY: -15 }}
                animate={{ rotateZ: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Particles */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"
                    style={{ top: '50%', left: '50%' }}
                    animate={{
                        x: [0, Math.cos(i) * 50],
                        y: [0, Math.sin(i) * 30],
                        opacity: [1, 0],
                        scale: [1, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeOut"
                    }}
                />
            ))}
        </div>
    );
});

export default HolographicPlanet;
