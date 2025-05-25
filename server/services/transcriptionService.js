import { Whisper } from 'whisper-node';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import s3Service from './s3Service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TranscriptionService {
    constructor() {
        this.whisper = new Whisper({
            modelPath: path.join(__dirname, '../../models/whisper-base'),
            device: 'cpu'
        });
        this.tempDir = process.env.TEMP_DIR || 'server/temp';
    }

    async downloadFromS3(key) {
        console.log('Downloading audio from S3:', key);
        try {
            const tempPath = path.join(this.tempDir, `${Date.now()}-${path.basename(key)}`);
            const result = await s3Service.downloadFile(key, tempPath);
            if (!result.success) {
                throw new Error(result.error);
            }
            console.log('Audio downloaded successfully to:', tempPath);
            return tempPath;
        } catch (error) {
            console.error('Error downloading from S3:', error);
            throw error;
        }
    }

    async transcribeAudio(audioKey) {
        try {
            console.log('Starting audio transcription process...');
            
            // Download audio from S3
            const audioPath = await this.downloadFromS3(audioKey);
            console.log('Audio file downloaded to:', audioPath);

            // Read audio file
            console.log('Reading audio file...');
            const audioBuffer = await fs.readFile(audioPath);
            console.log('Audio file read successfully');

            // Transcribe audio
            console.log('Starting transcription...');
            const transcription = await this.whisper.transcribe(audioBuffer);
            console.log('Transcription completed successfully');

            // Clean up
            console.log('Cleaning up temporary file...');
            await fs.unlink(audioPath);
            console.log('Temporary file cleaned up');

            return {
                success: true,
                transcription: transcription.text
            };
        } catch (error) {
            console.error('Error in transcription process:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new TranscriptionService(); 