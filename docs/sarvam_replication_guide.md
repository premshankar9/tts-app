# Case Study: Replicating Sarvam AI's TTS Pipeline

Sarvam AI built high-quality Indic TTS models (like Bulbul) by focusing on massive, high-quality datasets and modern architectures. Here is how you can replicate a simplified version using open-source tools.

## Phase 1: Data Collection & Preparation

The "Secret Sauce" of Sarvam AI is the diversity and purity of their Indic language data.

1.  **Sourcing Data**:
    - Use `yt-dlp` to download high-quality speech from news channels, podcasts, and audiobooks in the target language.
    - **Tools**: `yt-dlp`, `ffmpeg` (for 16kHz mono conversion).

2.  **Transcription (STT)**:
    - Use OpenAI's **Whisper** (specifically `distil-whisper` or `whisper-large-v3-turbo`) to transcribe the audio.
    - **Indic Specialization**: AI4Bharat's `IndicWhisper` is often better for regional nuances.

3.  **Denoising & Alignment**:
    - Remove background noise and music.
    - Use **Montreal Forced Aligner (MFA)** to align the text with the audio precisely.

## Phase 2: Choosing a Model Architecture

For a DIY version, don't build from scratch. Fine-tune a powerhouse model:

### 1. Indic-TTS (AI4Bharat)
The gold standard for Indian languages. It uses FastPitch and HiFi-GAN.
- **Pros**: Already optimized for 13+ Indian languages.
- **Link**: [AI4Bharat Indic-TTS](https://github.com/AI4Bharat/Indic-TTS)

### 2. XTTS-v2 (Coqui)
A multilingual model capable of zero-shot voice cloning.
- **Pros**: Can clone a voice with just 6 seconds of audio.
- **Usage**: Fine-tune on your Indic dataset for better prosody (pacing/tone).

### 3. Fish Speech
A newer, SOTA LLM-based TTS (similar to Sarvam's Bulbul approach).
- **Pros**: Extremely natural, handles "Hinglish" well.

## Phase 3: Fine-Tuning (Simplified)

You don't need 1000 GPUs. For a single voice:
1.  **Dataset**: ~2-5 hours of clean audio + transcriptions.
2.  **Hardware**: A single RTX 3090/4090 or an A100 (refer to Lambda Labs or Paperspace).
3.  **Process**:
    - Use the [Fish Speech](https://github.com/fishaudio/fish-speech) or [Coqui TTS](https://github.com/coqui-ai/TTS) training scripts.
    - For Fish Speech: "Pre-train" on broad data, then "Fine-tune" on your specific voice.

## Phase 4: Production Deployment

To match Sarvam's low latency:

1.  **Serving**: Use **vLLM** or **NVIDIA Triton Inference Server**.
2.  **API Wrapper**: Fast API or Flask to handle base64 audio requests.
3.  **Streaming**: Implement chunk-based streaming so audio starts playing as it's generated.

---

### Comparison: Free Cloud vs. DIY

| Feature | Edge TTS (Free Cloud) | DIY Open Source (Local) |
| :--- | :--- | :--- |
| **Effort** | Instant | Weeks to months |
| **Quality** | Neural (Excellent) | Varies by dataset |
| **Cost** | **$0 (No Key)** | GPU Hosting Costs |
| **Control** | Standard Voices | Custom Persona |
