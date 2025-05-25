import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import s3Service from './s3Service.js';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

class VideoProcessor {
    constructor() {
        this.uploadsDir = process.env.UPLOADS_DIR || 'server/uploads';
        this.tempDir = process.env.TEMP_DIR || 'server/temp';
    }

    async extractAudio(videoPath) {
        const audioPath = path.join(this.tempDir, `${Date.now()}.mp3`);
        
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .toFormat('mp3')
                .on('end', () => resolve(audioPath))
                .on('error', (err) => reject(err))
                .save(audioPath);
        });
    }

    async processVideo(videoFile) {
        try {
            // Create temp directory if it doesn't exist
            await fs.mkdir(this.tempDir, { recursive: true });

            // Save video file locally
            const videoPath = path.join(this.uploadsDir, videoFile.name);
            await fs.writeFile(videoPath, videoFile.data);

            // Extract audio
            const audioPath = await this.extractAudio(videoPath);

            // Upload video to S3
            const videoKey = `videos/${Date.now()}-${videoFile.name}`;
            const videoUpload = await s3Service.uploadFile(videoPath, videoKey);

            // Upload audio to S3
            const audioKey = `audio/${Date.now()}-${path.basename(audioPath)}`;
            const audioUpload = await s3Service.uploadFile(audioPath, audioKey);

            // Clean up local files
            await fs.unlink(videoPath);
            await fs.unlink(audioPath);

            if (!videoUpload.success || !audioUpload.success) {
                return {
                    success: false,
                    error: videoUpload.error || audioUpload.error
                };
            }

            return {
                success: true,
                videoKey,
                audioKey
            };
        } catch (error) {
            console.error('Error processing video:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async cleanup(audioPath) {
        try {
            await fs.unlink(audioPath);
        } catch (error) {
            console.error('Error cleaning up audio file:', error);
        }
    }
}

export default new VideoProcessor();