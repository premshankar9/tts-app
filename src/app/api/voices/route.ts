import { NextResponse } from "next/server";

export async function GET() {
    // Streamlined Voice List
    const voices = [
        // Basic/Standard Fallbacks
        { id: "en-US", name: "English (Standard)", category: "premade" },
        { id: "hi-IN", name: "Hindi (Basic Fallback)", category: "premade" },

        // Elite/Natural Voices (Recommended)
        { id: "xtts-hindi", name: "Elite Hindi (AI Powered)", category: "elite" },
        { id: "xtts-english", name: "Elite English (AI Powered)", category: "elite" },

        // India-Specific Natural (IIT Madras - AI4Bharat)
        { id: "indic-hindi", name: "Natural Hindi (Indic)", category: "elite" },
        { id: "indic-tamil", name: "Natural Tamil (Indic)", category: "elite" },
        { id: "indic-telugu", name: "Natural Telugu (Indic)", category: "elite" },
        { id: "indic-malayalam", name: "Natural Malayalam (Indic)", category: "elite" },
        { id: "indic-kannada", name: "Natural Kannada (Indic)", category: "elite" },
        { id: "indic-bengali", name: "Natural Bengali (Indic)", category: "elite" },

        // Premium Elite (Sarvam AI)
        { id: "sarvam-hindi-female", name: "Elite Hindi Female (Bulbul)", category: "elite" },
        { id: "sarvam-hindi-male", name: "Elite Hindi Male (Bulbul)", category: "elite" },

        // High Quality Neural (Free & Reliable)
        { id: "hi-IN-MadhurNeural", name: "Neural Hindi Male (Professional)", category: "generated" },
        { id: "hi-IN-SwaraNeural", name: "Neural Hindi Female (Natural)", category: "generated" },
        { id: "en-IN-NeerjaNeural", name: "Neural English IN (Professional)", category: "generated" },

        // Local/Offline (No Internet Required)
        { id: "sherpa-hindi", name: "Local Hindi (AI Offline)", category: "generated" },

        // Other Languages (One per language)
        { id: "ta-IN-PallaviNeural", name: "Neural Tamil (Natural)", category: "generated" },
        { id: "te-IN-MohanNeural", name: "Neural Telugu (Natural)", category: "generated" },
        { id: "bn-IN-BashkarNeural", name: "Neural Bengali (Natural)", category: "generated" },
        { id: "gu-IN-DhwaniNeural", name: "Neural Gujarati (Natural)", category: "generated" },
        { id: "mr-IN-ManoharNeural", name: "Neural Marathi (Natural)", category: "generated" },
    ];

    return NextResponse.json({ voices });
}

