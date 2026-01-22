"use client";

import * as React from "react";
import { Mic2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/TextInput";
import { VoiceSelector } from "@/components/VoiceSelector";
import { AudioPlayer } from "@/components/AudioPlayer";
import { VoiceLab } from "@/components/VoiceLab";
import { VoiceCloner } from "@/components/VoiceCloner";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Voice {
    id: string;
    name: string;
    category: "premade" | "cloned" | "generated";
}

export default function Home() {
    const [text, setText] = React.useState("");
    const [selectedVoice, setSelectedVoice] = React.useState<string>("");
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
    const [voices, setVoices] = React.useState<Voice[]>([]);
    const [isLoadingVoices, setIsLoadingVoices] = React.useState(false);

    // Voice Lab State
    const [pitch, setPitch] = React.useState(0);
    const [rate, setRate] = React.useState(0);
    const [isCloneMode, setIsCloneMode] = React.useState(false);
    const [referenceAudio, setReferenceAudio] = React.useState<Blob | null>(null);

    React.useEffect(() => {
        const fetchVoices = async () => {
            setIsLoadingVoices(true);
            try {
                const res = await fetch('/api/voices');
                const data = await res.json();
                if (data.voices) {
                    setVoices(data.voices);
                    if (data.voices.length > 0) setSelectedVoice(data.voices[0].id);
                }
            } catch (error) {
                console.error("Failed to load voices", error);
            } finally {
                setIsLoadingVoices(false);
            }
        };
        fetchVoices();
    }, []);

    const handleGenerate = async () => {
        if (!text || !selectedVoice) return;

        setIsGenerating(true);
        setAudioUrl(null);

        try {
            let res;

            if (isCloneMode) {
                if (!referenceAudio) {
                    alert("Please record your voice first to use Clone Mode.");
                    setIsGenerating(false);
                    return;
                }

                const formData = new FormData();
                formData.append("text", text);
                formData.append("audio", referenceAudio);

                res = await fetch('/api/clone', {
                    method: 'POST',
                    body: formData
                });
            } else {
                // 1. Fetch the base audio from our proxy
                res = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, voiceId: selectedVoice })
                });
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ error: "Failed to generate speech" }));
                throw new Error(errData.error || "Failed to generate speech");
            }

            const arrayBuffer = await res.arrayBuffer();

            // 2. Process Audio if pitch or rate is changed (only for standard mode)
            if (!isCloneMode && (pitch !== 0 || rate !== 0)) {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const decodedData = await audioCtx.decodeAudioData(arrayBuffer);

                // Calculate new duration
                // rate +10% means 1.1x speed, so duration / 1.1
                const speedFactor = 1 + (rate / 100);
                // pitch +10% means 1.1x playback rate
                const pitchFactor = 1 + (pitch / 100);

                // For simplicity, we'll use playbackRate for both since high-quality pitch shifting 
                // in real-time is complex. This will affect both pitch and speed together.
                // This creates the "Custom Voice" effect.
                const totalFactor = speedFactor * pitchFactor;

                const offlineCtx = new OfflineAudioContext(
                    decodedData.numberOfChannels,
                    decodedData.length / totalFactor,
                    decodedData.sampleRate
                );

                const source = offlineCtx.createBufferSource();
                source.buffer = decodedData;
                source.playbackRate.value = totalFactor;
                source.connect(offlineCtx.destination);
                source.start();

                const renderedBuffer = await offlineCtx.startRendering();

                // 3. Convert rendered buffer to Blob (WAV format)
                const wavBlob = bufferToWav(renderedBuffer);
                const url = URL.createObjectURL(wavBlob);
                setAudioUrl(url);
            } else {
                // No changes, use as is
                const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            }

        } catch (error) {
            console.error("Failed to generate audio", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Helper: Simple WAV encoder for AudioBuffer
    function bufferToWav(abuffer: AudioBuffer) {
        let numOfChan = abuffer.numberOfChannels,
            length = abuffer.length * numOfChan * 2 + 44,
            buffer = new ArrayBuffer(length),
            view = new DataView(buffer),
            channels = [], i, sample,
            offset = 0,
            pos = 0;

        // write WAVE header
        setUint32(0x46464952);                         // "RIFF"
        setUint32(length - 8);                         // file length - 8
        setUint32(0x45564157);                         // "WAVE"

        setUint32(0x20746d66);                         // "fmt " chunk
        setUint32(16);                                 // length = 16
        setUint16(1);                                  // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2);                      // block-align
        setUint16(16);                                 // 16-bit

        setUint32(0x61746164);                         // "data" - chunk
        setUint32(length - pos - 4);                   // chunk length

        // write interleaved data
        for (i = 0; i < abuffer.numberOfChannels; i++)
            channels.push(abuffer.getChannelData(i));

        while (pos < length) {
            for (i = 0; i < numOfChan; i++) {             // interleave channels
                sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
                sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF) | 0; // scale to 16-bit signed int
                view.setInt16(pos, sample, true);          // write 16-bit sample
                pos += 2;
            }
            offset++;                                     // next source sample
        }

        return new Blob([buffer], { type: "audio/wav" });

        function setUint16(data: any) {
            view.setUint16(pos, data, true);
            pos += 2;
        }

        function setUint32(data: any) {
            view.setUint32(pos, data, true);
            pos += 4;
        }
    }

    return (
        <main className="min-h-screen bg-background p-6 md:p-12 lg:p-24 selection:bg-primary/20">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                            <span className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Mic2 className="h-8 w-8" />
                            </span>
                            VoxSynthetix
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Free text-to-speech with premium voices and download.
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <div className="grid gap-8 p-8 border rounded-2xl bg-card shadow-sm">

                    {/* Mode Toggle */}
                    <div className="flex bg-secondary/30 p-1 rounded-xl w-fit mx-auto border shadow-inner">
                        <button
                            onClick={() => setIsCloneMode(false)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                                !isCloneMode ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Sparkles className="h-4 w-4" />
                            Pre-made
                        </button>
                        <button
                            onClick={() => setIsCloneMode(true)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                                isCloneMode ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Mic2 className="h-4 w-4" />
                            Clone Voice
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isCloneMode ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <VoiceCloner onAudioComplete={setReferenceAudio} />
                            </div>
                        ) : (
                            <>
                                <VoiceSelector
                                    voices={voices}
                                    selectedVoiceId={selectedVoice}
                                    onVoiceSelect={setSelectedVoice}
                                    isLoading={isLoadingVoices}
                                />
                                <VoiceLab
                                    pitch={pitch}
                                    setPitch={setPitch}
                                    rate={rate}
                                    setRate={setRate}
                                />
                            </>
                        )}

                        <TextInput
                            placeholder={isCloneMode ? "What should your clone say?" : "Type something amazing here..."}
                            className="text-lg min-h-[200px]"
                            value={text}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            {text.length} characters
                        </div>
                        <Button
                            size="lg"
                            className="px-8 font-semibold text-base transition-all hover:scale-105"
                            onClick={handleGenerate}
                            disabled={!text || !selectedVoice || isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Generate Speech
                                </>
                            )}
                        </Button>
                    </div>

                </div>

                {/* Result Area */}
                <div className={cn(
                    "transition-all duration-500 ease-in-out transform",
                    audioUrl ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
                )}>
                    <h2 className="text-xl font-semibold mb-4 px-1">Your Result</h2>
                    <AudioPlayer audioUrl={audioUrl} isLoading={isGenerating} />
                </div>

            </div>
        </main>
    );
}
