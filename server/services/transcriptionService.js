import { Whisper } from 'whisper-node';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TranscriptionService {
    constructor() {
        this.whisper = new Whisper({
            modelPath: path.join(__dirname, '../../models/whisper-base'),
            device: 'cpu'
        });
    }

    async transcribeAudio(audioPath) {
        try {
            const audioBuffer = await fs.readFile(audioPath);
            const transcription = await this.whisper.transcribe(audioBuffer);

            return {
                success: true,
                transcription: transcription.text
            };
        } catch (error) {
            console.error('Error transcribing audio:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new TranscriptionService(); 