"use client";

import * as React from "react";
import { Sliders, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceLabProps {
    pitch: number;
    setPitch: (val: number) => void;
    rate: number;
    setRate: (val: number) => void;
}

export function VoiceLab({ pitch, setPitch, rate, setRate }: VoiceLabProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const reset = () => {
        setPitch(0);
        setRate(0);
    };

    return (
        <div className="border rounded-xl bg-secondary/30 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                type="button"
            >
                <div className="flex items-center gap-2 font-medium">
                    <Sliders className="h-4 w-4 text-primary" />
                    Voice Lab (Customization)
                </div>
                <div className="text-xs text-muted-foreground">
                    {isOpen ? "Close Lab" : "Expand Lab"}
                </div>
            </button>

            {isOpen && (
                <div className="p-6 pt-0 space-y-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Pitch Control */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <label>Pitch</label>
                                <span className={pitch > 0 ? "text-primary" : pitch < 0 ? "text-orange-500" : ""}>
                                    {pitch > 0 ? "+" : ""}{pitch}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-50"
                                max="50"
                                value={pitch}
                                onChange={(e) => setPitch(parseInt(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
                                <span>Deep</span>
                                <span>Default</span>
                                <span>High</span>
                            </div>
                        </div>

                        {/* Speed Control */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <label>Speed (Rate)</label>
                                <span className={rate > 0 ? "text-primary" : rate < 0 ? "text-orange-500" : ""}>
                                    {rate > 0 ? "+" : ""}{rate}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-50"
                                max="50"
                                value={rate}
                                onChange={(e) => setRate(parseInt(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
                                <span>Slow</span>
                                <span>Default</span>
                                <span>Fast</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={reset}
                            className="text-xs h-8"
                        >
                            <RotateCcw className="h-3 w-3 mr-1.5" />
                            Reset to Default
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
