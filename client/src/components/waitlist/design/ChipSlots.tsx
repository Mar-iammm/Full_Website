"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ChipSlotsProps {
    total: number;
    filled: number;
    labels: string[];
}

const ChipSlots = memo(function ChipSlots({ total, filled, labels }: ChipSlotsProps) {
    return (
        <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: total }).map((_, i) => {
                const isFilled = i < filled;
                return (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div
                            className={`w-full aspect-[4/5] rounded-lg border flex items-center justify-center transition-all duration-500 overflow-hidden relative
                ${isFilled
                                    ? 'bg-gold/10 border-gold/40 shadow-[0_0_15px_rgba(255,184,0,0.2)]'
                                    : 'bg-white/5 border-white/10 opacity-60'
                                }`}
                        >
                            {isFilled && (
                                <>
                                    <motion.div
                                        className="absolute inset-0 bg-gold/10"
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                    />
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", delay: 0.2 + i * 0.1 }}
                                    >
                                        <Check className="w-5 h-5 text-gold" />
                                    </motion.div>
                                </>
                            )}
                        </div>
                        <span
                            className={`text-[8px] sm:text-[10px] uppercase font-bold tracking-wider transition-colors duration-300
                ${isFilled ? 'text-gold' : 'text-gray-600'}`}
                        >
                            {labels[i]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});

export default ChipSlots;
