async function testSherpa() {
    try {
        console.log('Testing Sherpa-ONNX (Local) Hindi Voice via Local API...');
        const response = await fetch('http://localhost:3000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: 'नमस्ते, यह शेरपा ओएनएनएक्स लोकल टीटीएस का परीक्षण है।',
                voiceId: 'sherpa-hindi',
                pitch: 0,
                rate: 0
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}, Body: ${errorText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        console.log('Success! Received Sherpa Hindi audio buffer of size:', audioBuffer.byteLength);

    } catch (err) {
        console.error('Error:', err.message);
    }
}

testSherpa();
