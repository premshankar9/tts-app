async function testXTTS() {
    try {
        console.log('Testing XTTS-v2 (Elite) Voice via Local API...');
        const response = await fetch('http://localhost:3000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'Hello, this is a test of the XTTS-v2 AI voice model.',
                voiceId: 'xtts-english',
                pitch: 0,
                rate: 0
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}, Body: ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        console.log('Success! Received XTTS audio buffer of size:', audioBuffer.byteLength);

        console.log('Testing XTTS-v2 (Elite) Hindi Voice via Local API...');
        const responseHi = await fetch('http://localhost:3000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'नमस्ते, यह XTTS-v2 AI आवाज मॉडल का परीक्षण है।',
                voiceId: 'xtts-hindi',
                pitch: 0,
                rate: 0
            })
        });

        if (!responseHi.ok) {
            const errorText = await responseHi.text();
            throw new Error(`Status: ${responseHi.status}, Body: ${errorText}`);
        }

        const audioBufferHi = await responseHi.arrayBuffer();
        console.log('Success! Received XTTS Hindi audio buffer of size:', audioBufferHi.byteLength);

    } catch (err) {
        console.error('Error:', err.message);
    }
}

testXTTS();
