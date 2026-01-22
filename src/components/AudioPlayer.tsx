"use client";

import * as React from "react";
import { Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
    audioUrl: string | null;
    isLoading?: boolean;
}

export function AudioPlayer({ audioUrl, isLoading }: AudioPlayerProps) {
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);

    const togglePlay = () => {
        if (!audioRef.current || !audioUrl) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;
        setCurrentTime(current);
        setProgress((current / total) * 100);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
    };

    const handleMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    React.useEffect(() => {
        if (audioUrl && audioRef.current) {
            // Reset player when URL changes
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            audioRef.current.load();
        }
    }, [audioUrl]);

    return (
        <div className={cn(
            "rounded-xl border bg-card text-card-foreground shadow-sm w-full p-6 transition-all duration-300",
            !audioUrl && "opacity-50 pointer-events-none grayscale"
        )}>
            <div className="flex items-center gap-4">
                <Button
                    size="icon"
                    variant="outline"
                    className="h-12 w-12 rounded-full shrink-0"
                    onClick={togglePlay}
                    disabled={!audioUrl || isLoading}
                >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>

                <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden relative">
                        <div
                            className="h-full bg-primary transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {audioUrl && (
                    <a href={audioUrl} download="speech.mp3">
                        <Button size="icon" variant="ghost" className="h-10 w-10">
                            <Download className="h-5 w-5" />
                        </Button>
                    </a>
                )}
            </div>

            <audio
                ref={audioRef}
                src={audioUrl || ""}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleMetadata}
                onEnded={handleEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="hidden"
            />
        </div>
    );
}
