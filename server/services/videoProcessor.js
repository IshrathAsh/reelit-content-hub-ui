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
        console.log('Extracting audio from video:', videoPath);
        const audioPath = path.join(this.tempDir, `${Date.now()}.mp3`);
        
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .toFormat('mp3')
                .on('start', (commandLine) => {
                    console.log('FFmpeg started with command:', commandLine);
                })
                .on('progress', (progress) => {
                    console.log('FFmpeg progress:', progress);
                })
                .on('end', () => {
                    console.log('Audio extraction completed:', audioPath);
                    resolve(audioPath);
                })
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    reject(err);
                })
                .save(audioPath);
        });
    }

    async processVideo(videoFile) {
        try {
            console.log('Starting video processing...');
            
            // Create temp directory if it doesn't exist
            await fs.mkdir(this.tempDir, { recursive: true });
            await fs.mkdir(this.uploadsDir, { recursive: true });

            // Save video file locally
            const videoPath = path.join(this.uploadsDir, `${Date.now()}-${videoFile.name}`);
            console.log('Saving video to:', videoPath);
            await fs.writeFile(videoPath, videoFile.data);
            console.log('Video saved successfully');

            // Extract audio
            console.log('Extracting audio...');
            const audioPath = await this.extractAudio(videoPath);
            console.log('Audio extracted successfully');

            // Upload video to S3
            const videoKey = `videos/${Date.now()}-${videoFile.name}`;
            console.log('Uploading video to S3:', videoKey);
            const videoUpload = await s3Service.uploadFile(videoPath, videoKey);
            console.log('Video upload result:', videoUpload);

            // Upload audio to S3
            const audioKey = `audio/${Date.now()}-${path.basename(audioPath)}`;
            console.log('Uploading audio to S3:', audioKey);
            const audioUpload = await s3Service.uploadFile(audioPath, audioKey);
            console.log('Audio upload result:', audioUpload);

            // Clean up local files
            console.log('Cleaning up local files...');
            await fs.unlink(videoPath);
            await fs.unlink(audioPath);
            console.log('Local files cleaned up');

            if (!videoUpload.success || !audioUpload.success) {
                console.error('Upload failed:', { videoUpload, audioUpload });
                return {
                    success: false,
                    error: videoUpload.error || audioUpload.error
                };
            }

            console.log('Video processing completed successfully');
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
            console.log('Cleaning up audio file:', audioPath);
            await fs.unlink(audioPath);
            console.log('Audio file cleaned up successfully');
        } catch (error) {
            console.error('Error cleaning up audio file:', error);
        }
    }
}

export default new VideoProcessor();