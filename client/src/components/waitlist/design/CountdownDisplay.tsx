"use client";

import React, { useState, useEffect, memo } from "react";

// Optimized countdown display - minimal re-renders
const CountdownDisplay = memo(function CountdownDisplay() {
    const [timeLeft, setTimeLeft] = useState({
        days: "000",
        hours: "00",
        minutes: "00",
        seconds: "00"
    });

    useEffect(() => {
        const targetDate = new Date("2026-03-01T12:00:00+04:00").getTime();

        const updateCountdown = () => {
            const now = Date.now();
            const distance = targetDate - now;

            if (distance > 0) {
                setTimeLeft({
                    days: String(Math.floor(distance / 86400000)).padStart(3, "0"),
                    hours: String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0"),
                    minutes: String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0"),
                    seconds: String(Math.floor((distance % 60000) / 1000)).padStart(2, "0")
                });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hrs" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Sec" }
            ].map((unit) => (
                <div key={unit.label} className="text-center group">
                    <div className="relative px-3 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300">
                        <span
                            className="relative font-mono text-xl sm:text-2xl md:text-3xl font-bold block text-gray-200"
                        >
                            {unit.value}
                        </span>
                    </div>
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 mt-2 block">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
});

export default CountdownDisplay;
