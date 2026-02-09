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
        { id: "hi-IN", name: "Hindi (Google)", category: "premade" },
        // Microsoft Edge Neural Voices (Free & Keyless)
        { id: "hi-IN-MadhurNeural", name: "Hindi (Edge Madhur)", category: "generated" },
        { id: "hi-IN-SwaraNeural", name: "Hindi (Edge Swara)", category: "generated" },
        { id: "ta-IN-PallaviNeural", name: "Tamil (Edge Pallavi)", category: "generated" },
        { id: "ta-IN-ValluvarNeural", name: "Tamil (Edge Valluvar)", category: "generated" },
        { id: "te-IN-MohanNeural", name: "Telugu (Edge Mohan)", category: "generated" },
        { id: "te-IN-ShrutiNeural", name: "Telugu (Edge Shruti)", category: "generated" },
        { id: "kn-IN-GaganNeural", name: "Kannada (Edge Gagan)", category: "generated" },
        { id: "kn-IN-SapnaNeural", name: "Kannada (Edge Sapna)", category: "generated" },
        { id: "ml-IN-MidhunNeural", name: "Malayalam (Edge Midhun)", category: "generated" },
        { id: "ml-IN-SobhanaNeural", name: "Malayalam (Edge Sobhana)", category: "generated" },
        { id: "mr-IN-ManoharNeural", name: "Marathi (Edge Manohar)", category: "generated" },
        { id: "bn-IN-BashkarNeural", name: "Bengali (Edge Bashkar)", category: "generated" },
        { id: "bn-IN-TanishaaNeural", name: "Bengali (Edge Tanishaa)", category: "generated" },
        { id: "gu-IN-DhwaniNeural", name: "Gujarati (Edge Dhwani)", category: "generated" },
    ];

    return NextResponse.json({ voices });
}
