"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

export interface Voice {
    id: string;
    name: string;
    category: "premade" | "cloned" | "generated";
}

interface VoiceSelectorProps {
    voices: Voice[];
    selectedVoiceId: string;
    onVoiceSelect: (voiceId: string) => void;
    isLoading?: boolean;
}

export function VoiceSelector({ voices = [], selectedVoiceId, onVoiceSelect, isLoading }: VoiceSelectorProps) {
    // Group voices
    const premade = voices.filter(v => v.category === "premade");
    const cloned = voices.filter(v => v.category === "cloned");

    return (
        <div className="relative w-full">
            <label className="text-sm font-medium leading-none mb-2 block">Select Voice</label>
            <div className="relative">
                <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    value={selectedVoiceId}
                    onChange={(e) => onVoiceSelect(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="" disabled>Select a voice...</option>
                    {premade.length > 0 && (
                        <optgroup label="Pre-made Voices">
                            {premade.map((voice) => (
                                <option key={voice.id} value={voice.id}>
                                    {voice.name}
                                </option>
                            ))}
                        </optgroup>
                    )}
                    {cloned.length > 0 && (
                        <optgroup label="Your Custom Voices">
                            {cloned.map((voice) => (
                                <option key={voice.id} value={voice.id}>
                                    {voice.name}
                                </option>
                            ))}
                        </optgroup>
                    )}
                </select>
                <ChevronsUpDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
        </div>
    );
}
