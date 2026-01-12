"use client";

import React from "react";
import { StudentVerseLogo } from "../Logo";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none">
            {/* Dynamic Glass Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]" />

            {/* Brand */}
            <div className="relative pointer-events-auto">
                <StudentVerseLogo />
            </div>

            {/* Status Indicator */}
            <div className="relative pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-xs font-mono text-white/80 tracking-wide uppercase">
                    Waitlist Active
                </span>
            </div>
        </nav>
    );
}
