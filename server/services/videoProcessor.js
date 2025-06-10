import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import S3Service from './s3Service.js';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

class VideoProcessor {
    constructor(s3Service) {
        this.uploadsDir = process.env.UPLOADS_DIR || 'server/uploads';
        this.tempDir = process.env.TEMP_DIR || 'server/temp';
        this.s3Service = s3Service;
    }

    async extractAudio(videoPath, audioPath) {
        console.log(`\n=== Starting Audio Extraction: ${videoPath} to ${audioPath} ===`);
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .outputOptions('-vn') // Disable video
                .outputOptions('-acodec libmp3lame') // Set audio codec to MP3
                .outputOptions('-q:a 2') // Set audio quality (VBR)
                .on('start', function(commandLine) {
                    console.log('🎶 FFmpeg process started with command: ' + commandLine);
                })
                .on('progress', function(progress) {
                    // console.log('Processing: ' + progress.percent + '% done'); // Enable for very detailed progress
                })
                .on('end', () => {
                    console.log('✅ Audio extraction finished successfully.');
                    resolve({ success: true, audioPath });
                })
                .on('error', (err) => {
                    console.error('❌ FFmpeg audio extraction error:', err.message);
                    reject({ success: false, error: `FFmpeg audio extraction failed: ${err.message}` });
                })
                .save(audioPath);
        });
    }

    async processVideo(videoFile) {
        console.log(`\n=== Starting Video Processing for: ${videoFile.name} ===`);
        let videoKey, audioKey;
        let localVideoPath, localAudioPath;

        try {
            // Ensure directories exist
            await fs.mkdir(this.uploadsDir, { recursive: true });
            await fs.mkdir(this.tempDir, { recursive: true });
            console.log('📁 Ensured upload and temp directories exist.');

            // Save video file locally
            const videoFileName = `video-${Date.now()}-${videoFile.name}`;
            localVideoPath = path.join(this.uploadsDir, videoFileName);
            console.log('💾 Saving video file to:', localVideoPath);
            await fs.writeFile(localVideoPath, videoFile.data);
            console.log('✅ Video file saved locally.');

            // Extract audio
            const audioFileName = `audio-${Date.now()}.mp3`;
            localAudioPath = path.join(this.tempDir, audioFileName);
            console.log('🔊 Attempting to extract audio to:', localAudioPath);
            const audioExtractResult = await this.extractAudio(localVideoPath, localAudioPath);
            if (!audioExtractResult.success) {
                throw new Error(audioExtractResult.error);
            }
            console.log('✅ Audio extracted successfully.');

            // Upload video to S3
            console.log('☁️ Uploading video to S3...');
            const videoUploadResult = await this.s3Service.uploadFile(localVideoPath, `videos/${videoFileName}`);
            if (!videoUploadResult.success) {
                throw new Error(videoUploadResult.error);
            }
            videoKey = videoUploadResult.key;
            console.log('✅ Video uploaded to S3. Key:', videoKey);

            // Upload audio to S3
            console.log('☁️ Uploading audio to S3...');
            const audioUploadResult = await this.s3Service.uploadFile(localAudioPath, `audio/${audioFileName}`);
            if (!audioUploadResult.success) {
                throw new Error(audioUploadResult.error);
            }
            audioKey = audioUploadResult.key;
            console.log('✅ Audio uploaded to S3. Key:', audioKey);

            return {
                success: true,
                videoKey,
                audioKey
            };
        } catch (error) {
            console.error('❌ Error during video processing:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            // Clean up local files
            console.log('🧹 Starting cleanup of local files...');
            if (localVideoPath) {
                try {
                    await fs.unlink(localVideoPath);
                    console.log('🗑️ Cleaned up local video file:', localVideoPath);
                } catch (err) {
                    console.error('⚠️ Failed to delete local video file:', localVideoPath, err.message);
                }
            }
            if (localAudioPath) {
                try {
                    await fs.unlink(localAudioPath);
                    console.log('🗑️ Cleaned up local audio file:', localAudioPath);
                } catch (err) {
                    console.error('⚠️ Failed to delete local audio file:', localAudioPath, err.message);
                }
            }
            console.log('🧹 Local file cleanup complete.');
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

export default VideoProcessor;