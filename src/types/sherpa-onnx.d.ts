declare module 'sherpa-onnx' {
    export class OfflineTts {
        constructor(config: any);
        generate(options: { text: string; sid: number; speed: number }): {
            samples: Float32Array;
            sampleRate: number;
        };
    }
}
