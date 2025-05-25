const { Whisper } = require('whisper-node');
const fs = require('fs').promises;
const path = require('path');

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

module.exports = new TranscriptionService(); 