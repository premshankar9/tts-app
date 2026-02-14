const { EdgeTTS } = require("edge-tts-universal");

async function testTTS() {
    console.log("Starting Edge TTS Test...");

    const voices = [
        "hi-IN-MadhurNeural",
        "ta-IN-ValluvarNeural"
    ];

    for (const voice of voices) {
        try {
            console.log(`Testing voice: ${voice}`);
            const text = voice.startsWith("hi") ? "नमस्ते, यह एक परीक्षण है।" : "வணக்கம், இது ஒரு சோதனை.";
            const tts = new EdgeTTS(text, voice);
            const { audio } = await tts.synthesize();
            const arrayBuffer = await audio.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            console.log(`Successfully generated ${buffer.length} bytes of audio for ${voice}`);
        } catch (error) {
            console.error(`Failed to generate audio for ${voice}:`, error);
            process.exit(1);
        }
    }
    console.log("All tests passed!");
    process.exit(0);
}

testTTS();

