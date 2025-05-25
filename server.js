import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import s3Service from './server/services/s3Service.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Create required directories if they don't exist
const createRequiredDirectories = () => {
    const dirs = [
        process.env.UPLOADS_DIR || 'server/uploads',
        process.env.TEMP_DIR || 'server/temp'
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// Initialize directories
createRequiredDirectories();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Configure multer for video upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOADS_DIR || 'server/uploads';
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_VIDEO_SIZE) || 52428800 // 50MB default
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = (process.env.ALLOWED_VIDEO_TYPES || '').split(',');
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
        }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.post('/api/upload', upload.single('video'), async (req, res) => {
    const startTime = Date.now();
    console.log('Starting video upload process...');
    
    try {
        if (!req.file) {
            console.error('No video file uploaded');
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        console.log(`Processing video: ${req.file.originalname}`);

        // Process the video
        const videoProcessor = await import('./server/services/videoProcessor.js');
        const result = await videoProcessor.default.processVideo(req.file);

        if (!result.success) {
            console.error('Video processing failed:', result.error);
            return res.status(500).json({ error: result.error });
        }

        console.log('Video processed successfully, generating signed URLs...');

        // Generate signed URLs for video and audio
        const [videoUrlResult, audioUrlResult] = await Promise.all([
            s3Service.getSignedUrl(result.videoKey),
            s3Service.getSignedUrl(result.audioKey)
        ]);

        if (!videoUrlResult.success || !audioUrlResult.success) {
            console.error('Failed to generate signed URLs:', {
                videoError: videoUrlResult.error,
                audioError: audioUrlResult.error
            });
            return res.status(500).json({ 
                error: 'Failed to generate signed URLs',
                details: {
                    videoError: videoUrlResult.error,
                    audioError: audioUrlResult.error
                }
            });
        }

        // Download audio for transcription
        console.log('Downloading audio for transcription...');
        const audioTempPath = path.join(process.env.TEMP_DIR || 'server/temp', `${Date.now()}-audio.mp3`);
        const { GetObjectCommand } = await import('@aws-sdk/client-s3');
        const { createWriteStream } = fs;
        const s3Client = s3Service.s3Client;
        
        try {
            const audioStream = await s3Client.send(new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: result.audioKey
            }));
            
            await new Promise((resolve, reject) => {
                const writeStream = createWriteStream(audioTempPath);
                audioStream.Body.pipe(writeStream);
                audioStream.Body.on('error', reject);
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            console.log('Audio downloaded, starting transcription...');

            const transcriptionService = await import('./server/services/transcriptionService.js');
            const transcriptionResult = await transcriptionService.default.transcribeAudio(audioTempPath);

            // Clean up temp audio file
            await fs.promises.unlink(audioTempPath).catch(err => 
                console.warn('Failed to delete temp audio file:', err)
            );

            if (!transcriptionResult.success) {
                console.error('Transcription failed:', transcriptionResult.error);
                return res.status(500).json({ error: transcriptionResult.error });
            }

            console.log('Transcription completed, generating content...');

            // Generate content from transcription
            const contentGenerator = await import('./server/services/contentGenerator.js');
            const contentResult = await contentGenerator.default.generateContent(transcriptionResult.transcription);

            if (!contentResult.success) {
                console.error('Content generation failed:', contentResult.error);
                return res.status(500).json({ error: contentResult.error });
            }

            const processingTime = Date.now() - startTime;
            console.log(`Video processing completed in ${processingTime}ms`);

            res.json({
                message: 'Video processed successfully',
                videoUrl: videoUrlResult.url,
                audioUrl: audioUrlResult.url,
                transcription: transcriptionResult.transcription,
                generatedContent: {
                    caption: contentResult.content.caption,
                    hashtags: contentResult.content.hashtags,
                    description: contentResult.content.description
                },
                processingTime: `${processingTime}ms`
            });
        } catch (error) {
            console.error('Error during audio processing:', error);
            // Clean up temp file if it exists
            if (fs.existsSync(audioTempPath)) {
                await fs.promises.unlink(audioTempPath).catch(err => 
                    console.warn('Failed to delete temp audio file:', err)
                );
            }
            throw error;
        }
    } catch (error) {
        console.error('Error processing video:', error);
        res.status(500).json({ 
            error: 'Error processing video',
            details: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Upload directory: ${process.env.UPLOADS_DIR || 'server/uploads'}`);
    console.log(`Temp directory: ${process.env.TEMP_DIR || 'server/temp'}`);
}); 