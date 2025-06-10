import OpenAI from 'openai';
import fs from 'fs/promises';
import fs_extra from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import S3Service from './s3Service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TranscriptionService {
    constructor(s3Service) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.tempDir = process.env.TEMP_DIR || 'server/temp';
        this.s3Service = s3Service;
    }

    async downloadFromS3(key) {
        console.log('Downloading audio from S3:', key);
        try {
            const tempPath = path.join(this.tempDir, `${Date.now()}-${path.basename(key)}`);
            const result = await this.s3Service.downloadFile(key, tempPath);
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

            // Transcribe audio using OpenAI Whisper
            console.log('Starting transcription with OpenAI Whisper...');
            const transcription = await this.openai.audio.transcriptions.create({
                file: fs_extra.createReadStream(audioPath),
                model: "whisper-1",
                response_format: "text"
            });
            console.log('Transcription completed successfully');

            // Clean up
            console.log('Cleaning up temporary file...');
            await fs.unlink(audioPath);
            console.log('Temporary file cleaned up');

            return {
                success: true,
                transcription: transcription
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

export default TranscriptionService; 