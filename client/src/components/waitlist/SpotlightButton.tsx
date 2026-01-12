"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface SpotlightButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const SpotlightButton: React.FC<SpotlightButtonProps> = ({
    children,
    className = "",
    onClick = undefined
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!btnRef.current || !isHovered) return;

            const rect = btnRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setMousePosition({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isHovered]);

    return (
        <motion.button
            ref={btnRef}
            type={onClick ? "button" : "submit"}
            className={clsx(
                "group relative overflow-hidden rounded-xl",
                "bg-white/10 backdrop-blur-sm border border-white/20",
                "px-8 py-4 transition-all duration-300",
                "hover:bg-white/20 hover:border-white/30",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Spotlight effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.2), transparent 80%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.button>
    );
};

export default SpotlightButton;
