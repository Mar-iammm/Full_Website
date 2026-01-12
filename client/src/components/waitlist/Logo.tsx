"use client";

import React from "react";
import { motion } from "framer-motion";

export const OrbitalLogo = ({ className = "", animated = false }: { className?: string; animated?: boolean }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#2962FF" />
                </linearGradient>
                <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFB800" />
                    <stop offset="100%" stopColor="#FF9100" />
                </linearGradient>
            </defs>

            <g style={{ mixBlendMode: "screen" }}>
                {/* Pill 1 - Azure/Cyan */}
                <rect
                    x="15"
                    y="15"
                    width="70"
                    height="35"
                    rx="17.5"
                    fill="url(#g1)"
                    opacity="0.9"
                    transform="rotate(45 50 50)"
                    className={animated ? "animate-spin-slow origin-center" : ""}
                />

                {/* Pill 2 - Violet/Red */}
                <rect
                    x="15"
                    y="45"
                    width="70"
                    height="35"
                    rx="17.5"
                    fill="url(#g2)"
                    opacity="0.9"
                    transform="rotate(-15 50 50)"
                    className={animated ? "animate-pulse-slow" : ""}
                />

                {/* Pill 3 - Gold/Orange */}
                <rect
                    x="35"
                    y="20"
                    width="35"
                    height="70"
                    rx="17.5"
                    fill="url(#g3)"
                    opacity="0.9"
                    transform="rotate(-30 50 50)"
                    className={animated ? "animate-float" : ""}
                />

                {/* Center Dot */}
                <circle cx="51" cy="51" r="4" fill="#fff" opacity="1" />
            </g>
        </svg>
    );
};

export const OrbitalLogoSmall = ({ className = "" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 50 50"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="g1-small" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#2962FF" />
                </linearGradient>
                <linearGradient id="g2-small" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="g3-small" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFB800" />
                    <stop offset="100%" stopColor="#FF9100" />
                </linearGradient>
            </defs>

            <g style={{ mixBlendMode: "screen" }}>
                <rect
                    x="7"
                    y="7"
                    width="35"
                    height="17"
                    rx="8"
                    fill="url(#g1-small)"
                    opacity="0.9"
                    transform="rotate(45 25 25)"
                />
                <rect
                    x="7"
                    y="22"
                    width="35"
                    height="17"
                    rx="8"
                    fill="url(#g2-small)"
                    opacity="0.9"
                    transform="rotate(-15 25 25)"
                />
                <rect
                    x="17"
                    y="10"
                    width="17"
                    height="35"
                    rx="8"
                    fill="url(#g3-small)"
                    opacity="0.9"
                    transform="rotate(-30 25 25)"
                />
                <circle cx="25.5" cy="25.5" r="2" fill="#fff" opacity="1" />
            </g>
        </svg>
    );
};

// Wordmark with logo
export const StudentVerseLogo = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <OrbitalLogoSmall className="w-10 h-10" />
            <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold text-white">Student</span>
                <span className="font-display text-2xl font-normal text-gray-400">Verse</span>
            </div>
        </div>
    );
};
