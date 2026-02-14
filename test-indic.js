async function testIndic() {
    try {
        console.log('Testing Indic-TTS (Natural) Hindi Voice via Local API...');
        const response = await fetch('http://localhost:3000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'नमस्ते, यह आईआईटी मद्रास के इंडिक टीटीएस मॉडल का परीक्षण है।',
                voiceId: 'indic-hindi',
                pitch: 0,
                rate: 0
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}, Body: ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        console.log('Success! Received Indic Hindi audio buffer of size:', audioBuffer.byteLength);

        console.log('Testing Indic-TTS (Natural) Tamil Voice via Local API...');
        const responseTa = await fetch('http://localhost:3000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'வணக்கம், இது இந்திய மொழிகளுக்கான செயற்கை நுண்ணறிவு குரல் சோதனை ஆகும்.',
                voiceId: 'indic-tamil',
                pitch: 0,
                rate: 0
            })
        });

        if (!responseTa.ok) {
            const errorText = await responseTa.text();
            throw new Error(`Status: ${responseTa.status}, Body: ${errorText}`);
        }

        const audioBufferTa = await responseTa.arrayBuffer();
        console.log('Success! Received Indic Tamil audio buffer of size:', audioBufferTa.byteLength);

    } catch (err) {
        console.error('Error:', err.message);
    }
}

testIndic();
