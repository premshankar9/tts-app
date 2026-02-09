const { MsEdgeTTS } = require("edge-tts-universal");

async function testTTS() {
    console.log("Starting Edge TTS Test...");
    const tts = new MsEdgeTTS();

    const voices = [
        "hi-IN-MadhurNeural",
        "ta-IN-ValluvarNeural"
    ];

    for (const voice of voices) {
        try {
            console.log(`Testing voice: ${voice}`);
            await tts.setMetadata(voice, "audio-24khz-48kbitrate-mono-mp3");
            const text = voice.startsWith("hi") ? "नमस्ते, यह एक परीक्षण है।" : "வணக்கம், இது ஒரு சோதனை.";
            const audioData = await tts.toAudio(text);
            console.log(`Successfully generated ${audioData.length} bytes of audio for ${voice}`);
        } catch (error) {
            console.error(`Failed to generate audio for ${voice}:`, error);
            process.exit(1);
        }
    }
    console.log("All tests passed!");
    process.exit(0);
}

testTTS();
