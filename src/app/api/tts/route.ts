import { NextRequest, NextResponse } from "next/server";

// Helper to split text into manageable chunks for Google Translate TTS
function splitTextIntoChunks(text: string, maxLength: number = 200): string[] {
    const chunks: string[] = [];
    let currentChunk = "";
    const paragraphs = text.split(/\r?\n/);
    for (const paragraph of paragraphs) {
        if (!paragraph.trim()) continue;
        const sentences = paragraph.split(/([.!?。！？]\s*)/);
        for (const sentence of sentences) {
            if (!sentence) continue;
            if ((currentChunk + sentence).length <= maxLength) {
                currentChunk += sentence;
            } else {
                if (currentChunk) chunks.push(currentChunk.trim());
                if (sentence.length > maxLength) {
                    const words = sentence.split(/\s+/);
                    let subChunk = "";
                    for (const word of words) {
                        if ((subChunk + word).length + 1 <= maxLength) {
                            subChunk += (subChunk ? " " : "") + word;
                        } else {
                            if (subChunk) chunks.push(subChunk.trim());
                            subChunk = word;
                        }
                    }
                    currentChunk = subChunk;
                } else {
                    currentChunk = sentence;
                }
            }
        }
        if (currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = "";
        }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks.filter(c => c.length > 0);
}

export async function POST(req: NextRequest) {
    let actualVoiceId: string | undefined;

    try {
        const body = await req.json();
        const { text, voiceId, pitch = 0, rate = 0 } = body;

        if (!text || !voiceId) {
            return NextResponse.json(
                { error: "Missing text or voiceId" },
                { status: 400 }
            );
        }

        // Check if this is an Edge Neural voice (Free & Keyless)
        if (voiceId.endsWith("Neural")) {
            try {
                // Use edge-tts-universal for high quality free neural voices
                const { EdgeTTS } = await import("edge-tts-universal");

                // Format pitch and rate for Edge TTS
                // Pitch: +0Hz, -5Hz, etc.
                // Rate: +0%, -10%, etc.
                const formattedPitch = `${pitch >= 0 ? '+' : ''}${pitch}Hz`;
                const formattedRate = `${rate >= 0 ? '+' : ''}${rate}%`;

                const tts = new EdgeTTS(text, voiceId, {
                    pitch: formattedPitch,
                    rate: formattedRate
                });

                // Add a 15s timeout for synthesis to prevent indefinite hangs
                const synthesisPromise = tts.synthesize();
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Synthesis Timeout (15s)")), 15000)
                );

                const result = await Promise.race([synthesisPromise, timeoutPromise]) as any;
                const { audio } = result;
                const arrayBuffer = await audio.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new NextResponse(buffer, {
                    headers: {
                        "Content-Type": "audio/mpeg",
                        "Content-Disposition": `attachment; filename="edge_speech.mp3"`,
                    },
                });
            } catch (edgeError: any) {
                console.error(`[Edge TTS Error] Voice: ${voiceId}, Error: ${edgeError.message}`);
                // Map Edge voice ID to Google language code (e.g. "hi" from "hi-IN-...")
                actualVoiceId = voiceId.split('-')[0];
                console.log(`[Edge TTS Fallback] Attempting fallback to Google TTS with voice info: ${actualVoiceId}`);
            }
        }

        // Check for XTTS-v2 (Hugging Face) Voices - FREE Elite
        if (voiceId.startsWith("xtts-")) {
            try {
                console.log(`[XTTS Start] Voice: ${voiceId}`);
                const { Client } = await import("@gradio/client");
                console.log(`[XTTS Request] Connecting to Hugging Face...`);

                // Connect to a stable XTTS-v2 Space
                const app = await Client.connect("lucataco/xtts-v2");
                console.log(`[XTTS Connected] Predicting for text: "${text.substring(0, 30)}..."`);

                const langCode = voiceId === "xtts-hindi" ? "hi" : "en";

                // Use a default reference audio for premade XTTS voices
                // We'll use a silent or neutral sample if possible, but Gradio usually needs a valid file.
                // For now, we'll try to find a public reference or handle it.
                // NOTE: lucataco/xtts-v2 requires [text, language, reference_audio, use_mic, use_cleanup, overlap_threshold]

                const result = await app.predict("/predict", [
                    text,      // text
                    langCode,  // language
                    "https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav", // default_reference_audio
                    false,     // use_mic
                    true,      // use_cleanup
                    0          // overlap_threshold
                ]);

                console.log("[XTTS Result] Received prediction result");
                const audioResult = (result as any).data[0];
                if (!audioResult || !audioResult.url) {
                    throw new Error("XTTS engine returned no audio URL");
                }

                const audioRes = await fetch(audioResult.url);
                const buffer = Buffer.from(await audioRes.arrayBuffer());

                console.log(`[XTTS Success] Generated ${buffer.length} bytes`);
                return new NextResponse(buffer, {
                    headers: {
                        "Content-Type": "audio/wav",
                        "Content-Disposition": `attachment; filename="xtts_speech.wav"`,
                    },
                });
            } catch (xttsError: any) {
                console.error("[XTTS Error Detail]:", xttsError.message || xttsError);
                // Fallback to Google TTS language code
                actualVoiceId = voiceId === "xtts-hindi" ? "hi" : "en";
                console.warn(`[XTTS Fallback] Redirecting to Google TTS (${actualVoiceId})`);
            }
        }

        // Check for Sarvam AI (Elite) Voices
        if (voiceId.startsWith("sarvam-")) {
            const sarvamApiKey = process.env.SARVAM_API_KEY;
            if (!sarvamApiKey) {
                console.error("[Sarvam AI Error] SARVAM_API_KEY is missing in environment variables.");
                return NextResponse.json(
                    { error: "Sarvam AI API Key is missing. Please set SARVAM_API_KEY in environment variables." },
                    { status: 401 }
                );
            }

            try {
                console.log(`[Sarvam AI Request] Voice: ${voiceId}, Text length: ${text.length}`);
                const speaker = voiceId === "sarvam-hindi-female" ? "ritu" : "aditya";
                const sarvamRes = await fetch("https://api.sarvam.ai/text-to-speech", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "api-subscription-key": sarvamApiKey
                    },
                    body: JSON.stringify({
                        inputs: [text],
                        target_language_code: "hi-IN",
                        speaker: speaker,
                        model: "bulbul:v3"
                    })
                });

                if (!sarvamRes.ok) {
                    const errorDetail = await sarvamRes.text();
                    console.error(`[Sarvam AI API Error] Status: ${sarvamRes.status}, Detail: ${errorDetail}`);
                    throw new Error(`Sarvam AI API Error: ${sarvamRes.status} - ${errorDetail}`);
                }

                const data = await sarvamRes.json();

                if (!data.audios || !data.audios[0]) {
                    console.error("[Sarvam AI Error] No audio content returned from API", data);
                    throw new Error("No audio content returned from Sarvam AI");
                }

                const audioContent = data.audios[0];
                const buffer = Buffer.from(audioContent, "base64");

                console.log(`[Sarvam AI Success] Generated ${buffer.length} bytes of audio`);
                return new NextResponse(buffer, {
                    headers: {
                        "Content-Type": "audio/mpeg",
                        "Content-Disposition": `attachment; filename="sarvam_speech.mp3"`,
                    },
                });
            } catch (sarvamError: any) {
                console.error("[Sarvam AI Catch Block]:", sarvamError);
                return NextResponse.json(
                    { error: "Elite Voice Service Failed", detail: sarvamError.message },
                    { status: 500 }
                );
            }
        }


        // Standard Google TTS path (or Fallback path)
        const targetVoiceId = actualVoiceId || voiceId;
        const chunks = splitTextIntoChunks(text);
        const audioBuffers: ArrayBuffer[] = [];

        for (const chunk of chunks) {
            const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&q=${encodeURIComponent(chunk)}&tl=${targetVoiceId}`;
            const response = await fetch(googleUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Referer": "https://translate.google.com/"
                }
            });

            if (!response.ok) {
                console.error(`Google TTS Error for chunk: status ${response.status}`);
                continue;
            }

            const buffer = await response.arrayBuffer();
            audioBuffers.push(buffer);
        }

        if (audioBuffers.length === 0) {
            return NextResponse.json({ error: "Failed to generate any audio chunks" }, { status: 500 });
        }

        const totalLength = audioBuffers.reduce((acc, buf) => acc + buf.byteLength, 0);
        const combinedBuffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const buf of audioBuffers) {
            combinedBuffer.set(new Uint8Array(buf), offset);
            offset += buf.byteLength;
        }

        return new NextResponse(combinedBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": `attachment; filename="speech.mp3"`,
            },
        });

    } catch (error: any) {
        console.error("Critical TTS Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", detail: error.message },
            { status: 500 }
        );
    }
}
