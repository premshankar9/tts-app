import { NextRequest, NextResponse } from "next/server";

// Helper to split text into manageable chunks for Google Translate TTS
function splitTextIntoChunks(text: string, maxLength: number = 200): string[] {
    const chunks: string[] = [];
    let currentChunk = "";

    // Split by newlines first to respect paragraph breaks
    const paragraphs = text.split(/\r?\n/);

    for (const paragraph of paragraphs) {
        if (!paragraph.trim()) continue;

        // Split paragraph by sentences
        const sentences = paragraph.split(/([.!?。！？]\s*)/);

        for (const sentence of sentences) {
            if (!sentence) continue;

            if ((currentChunk + sentence).length <= maxLength) {
                currentChunk += sentence;
            } else {
                if (currentChunk) chunks.push(currentChunk.trim());

                // If a single sentence is too long, split it by words
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
    console.log("TTS Route Hit: Google Stability Mode (Chunking Restored)");
    try {
        const { text, voiceId } = await req.json();
        console.log("Params:", { textLength: text?.length, voiceId });

        if (!text || !voiceId) {
            return NextResponse.json(
                { error: "Missing text or voiceId" },
                { status: 400 }
            );
        }

        const chunks = splitTextIntoChunks(text);
        console.log(`Processing ${chunks.length} chunks...`);

        const audioBuffers: ArrayBuffer[] = [];

        for (const chunk of chunks) {
            const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&q=${encodeURIComponent(chunk)}&tl=${voiceId}`;

            const response = await fetch(googleUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "Referer": "https://translate.google.com/"
                }
            });

            if (!response.ok) {
                console.error(`Google TTS Error for chunk: status ${response.status}`);
                continue; // Skip failed chunk or decide to fail entirely
            }

            const buffer = await response.arrayBuffer();
            audioBuffers.push(buffer);
        }

        if (audioBuffers.length === 0) {
            return NextResponse.json({ error: "Failed to generate any audio chunks" }, { status: 500 });
        }

        // Combine all buffers
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

    } catch (error) {
        console.error("TTS Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
