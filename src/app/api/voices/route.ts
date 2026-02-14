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
        // Microsoft Edge Neural Voices (Free)
        { id: "hi-IN-MadhurNeural", name: "Madhur (Male Professional)", category: "generated" },
        { id: "hi-IN-SwaraNeural", name: "Swara (Female Natural)", category: "generated" },
        { id: "hi-IN-AnanyaNeural", name: "Ananya (Female Bright)", category: "generated" },
        { id: "hi-IN-AaravNeural", name: "Aarav (Male Calm)", category: "generated" },
        { id: "hi-IN-KajalNeural", name: "Kajal (Female Narrator)", category: "generated" },
        { id: "hi-IN-HemantNeural", name: "Hemant (Male Bold)", category: "generated" },
        { id: "en-IN-NeerjaNeural", name: "English IN (Neerja - Professional)", category: "generated" },
        { id: "en-IN-PrabhatNeural", name: "English IN (Prabhat - Natural)", category: "generated" },
        // Sarvam AI Bulbul Voices (Premium/Elite)
        { id: "sarvam-hindi-female", name: "Bulbul Female (Elite - Ultra Natural)", category: "elite" },
        { id: "sarvam-hindi-male", name: "Bulbul Male (Elite - Ultra Natural)", category: "elite" },
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
        { id: "bn-IN-TanishaaNeural", name: "Tanishaa (Female Natural)", category: "generated" },
        { id: "gu-IN-DhwaniNeural", name: "Dhwani (Female Natural)", category: "generated" },
        // XTTS-v2 via Hugging Face (Free Elite)
        { id: "xtts-hindi", name: "XTTS Hindi (Elite - AI Powered)", category: "elite" },
        { id: "xtts-english", name: "XTTS English (Elite - AI Powered)", category: "elite" },
        // Indic-TTS via AI4Bharat (IIT Madras)
        { id: "indic-hindi", name: "Indic Hindi (Natural - IIT Madras)", category: "elite" },
        { id: "indic-tamil", name: "Indic Tamil (Natural - IIT Madras)", category: "elite" },
        { id: "indic-telugu", name: "Indic Telugu (Natural - IIT Madras)", category: "elite" },
        { id: "indic-malayalam", name: "Indic Malayalam (Natural - IIT Madras)", category: "elite" },
        { id: "indic-kannada", name: "Indic Kannada (Natural - IIT Madras)", category: "elite" },
        { id: "indic-bengali", name: "Indic Bengali (Natural - IIT Madras)", category: "elite" },
    ];

    return NextResponse.json({ voices });
}
