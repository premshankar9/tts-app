const axios = require('axios');

async function test() {
    try {
        console.log('Testing Edge TTS...');
        const res = await axios.post('http://localhost:3000/api/tts', {
            text: 'नमस्ते दुनिया',
            voiceId: 'hi-IN-AnanyaNeural',
            pitch: 0,
            rate: 0
        }, {
            responseType: 'arraybuffer'
        });
        console.log('Success! Received audio buffer of size:', res.data.byteLength);
    } catch (err) {
        if (err.response) {
            console.error('Error Status:', err.response.status);
            console.error('Error Body:', Buffer.from(err.response.data).toString());
        } else {
            console.error('Error Message:', err.message);
        }
    }
}

test();
