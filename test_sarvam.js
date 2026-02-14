const axios = require('axios');

async function test() {
    try {
        console.log('Testing Sarvam AI (Elite) Voice...');
        const res = await axios.post('http://localhost:3000/api/tts', {
            text: 'नमस्ते, यह एक प्रीमियम आवाज है',
            voiceId: 'sarvam-hindi-female',
            pitch: 0,
            rate: 0
        }, {
            responseType: 'arraybuffer'
        });
        console.log('Success! Received Sarvam audio buffer of size:', res.data.byteLength);
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
