async function test() {
    try {
        console.log('Testing Sarvam AI (Elite) Voice via Local API...');
        const response = await fetch('http://localhost:3000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'नमस्ते, यह एक प्रीमियम आवाज है',
                voiceId: 'sarvam-hindi-female',
                pitch: 0,
                rate: 0
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}, Body: ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        console.log('Success! Received Sarvam audio buffer of size:', audioBuffer.byteLength);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();

