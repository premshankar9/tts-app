import { NextResponse } from "next/server";

export async function GET() {
    // Google Translate TTS Languages
    const voices = [
        { id: "en-US", name: "English (US)", category: "premade" },
        { id: "en-GB", name: "English (UK)", category: "premade" },
        { id: "en-AU", name: "English (Australia)", category: "premade" },
        { id: "es-ES", name: "Spanish (Spain)", category: "premade" },
        { id: "fr-FR", name: "French", category: "premade" },
        { id: "de-DE", name: "German", category: "premade" },
        { id: "it-IT", name: "Italian", category: "premade" },
        { id: "ja-JP", name: "Japanese", category: "premade" },
        { id: "ko-KR", name: "Korean", category: "premade" },
        { id: "pt-BR", name: "Portuguese (Brazil)", category: "premade" },
        { id: "ru-RU", name: "Russian", category: "premade" },
        { id: "hi-IN", name: "Hindi", category: "premade" },
    ];

    return NextResponse.json({ voices });
}
