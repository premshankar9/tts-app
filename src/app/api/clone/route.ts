import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

// Stable community space for XTTS-v2
const HF_SPACE = "lucataco/xtts-v2";

export async function POST(req: NextRequest) {
    console.log("Clone Route Hit: XTTS-v2 Stable Space Active");
    try {
        const formData = await req.formData();
        const text = formData.get("text") as string;
        const audioFile = formData.get("audio") as Blob;

        if (!text || !audioFile) {
            return NextResponse.json(
                { error: "Missing text or audio reference" },
                { status: 400 }
            );
        }

        console.log(`Cloning voice for text: "${text.substring(0, 30)}..."`);

        // 1. Connect to Gradio Space
        const app = await Client.connect(HF_SPACE);

        // 2. Predict (Call the XTTS-v2 model)
        // lucataco/xtts-v2 expects: [prompt, language, audio_reference]
        const result = await app.predict("/predict", [
            text,           // text
            "en",           // language
            audioFile       // reference_audio
        ]);

        console.log("Gradio Prediction Result Received");

        // 3. Extract audio result
        // Gradio typically returns an object with 'data' array. Audio is index 0.
        const audioResult = (result as any).data[0];

        if (!audioResult || !audioResult.url) {
            console.error("Empty Result Data:", result);
            throw new Error("Voice cloning engine returned an empty result. The model may be busy.");
        }

        // 4. Fetch the generated audio
        const audioResponse = await fetch(audioResult.url);
        if (!audioResponse.ok) throw new Error("Synthesis service connection failed.");

        const audioBuffer = await audioResponse.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                "Content-Type": "audio/wav",
                "Content-Disposition": `attachment; filename="cloned_speech.wav"`,
            },
        });

    } catch (error: any) {
        console.error("Cloning Error:", error.message || error);
        return NextResponse.json(
            { error: error.message || "Voice Cloning Failed" },
            { status: 500 }
        );
    }
}
