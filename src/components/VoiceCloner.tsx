"use client";

import * as React from "react";
import { Mic, Square, Play, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceClonerProps {
    onAudioComplete: (blob: Blob | null) => void;
}

export function VoiceCloner({ onAudioComplete }: VoiceClonerProps) {
    const [isRecording, setIsRecording] = React.useState(false);
    const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
    const [recordingTime, setRecordingTime] = React.useState(0);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const chunksRef = React.useRef<Blob[]>([]);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                onAudioComplete(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Microphone access denied:", err);
            alert("Please allow microphone access to clone your voice.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const discardResult = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        onAudioComplete(null);
    };

    return (
        <div className="p-6 border rounded-2xl bg-secondary/20 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Mic className="h-5 w-5 text-primary" />
                        Voice Cloning Studio
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Record 6-10 seconds of clear speech to clone your voice.
                    </p>
                </div>
                {audioBlob && (
                    <div className="flex items-center gap-2 text-green-500 text-xs font-medium animate-in fade-in zoom-in">
                        <CheckCircle2 className="h-4 w-4" />
                        Voice Samples Ready
                    </div>
                )}
            </div>

            {!audioBlob ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4 border-2 border-dashed rounded-xl border-primary/20 bg-primary/5 transition-all">
                    {isRecording ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                <div className="relative h-16 w-16 bg-primary rounded-full flex items-center justify-center">
                                    <Square className="h-6 w-6 text-primary-foreground fill-current" />
                                </div>
                            </div>
                            <div className="text-2xl font-mono font-bold text-primary">
                                00:{recordingTime.toString().padStart(2, '0')}
                            </div>
                            <Button variant="destructive" onClick={stopRecording}>
                                Stop Recording
                            </Button>
                        </div>
                    ) : (
                        <Button
                            className="h-16 w-16 rounded-full shadow-lg shadow-primary/20"
                            onClick={startRecording}
                        >
                            <Mic className="h-6 w-6" />
                        </Button>
                    )}
                    <p className="text-sm text-muted-foreground font-medium italic">
                        {isRecording ? "Recording... Read something clearly." : "Click to Start Recording"}
                    </p>
                </div>
            ) : (
                <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => {
                            const audio = new Audio(audioUrl!);
                            audio.play();
                        }}
                    >
                        <Play className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-full opacity-50" />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1.5">Your Reference Audio Profile</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={discardResult}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
