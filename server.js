import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import videoProcessor from './server/services/videoProcessor.js';
import transcriptionService from './server/services/transcriptionService.js';
import contentGenerator from './server/services/contentGenerator.js';
import s3Service from './server/services/s3Service.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create required directories
const uploadsDir = process.env.UPLOADS_DIR || 'server/uploads';
const tempDir = process.env.TEMP_DIR || 'server/temp';

// Ensure directories exist
await fs.mkdir(uploadsDir, { recursive: true });
await fs.mkdir(tempDir, { recursive: true });

// Configure multer for video upload
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_VIDEO_SIZE) || 50 * 1024 * 1024, // 50MB default
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = (process.env.ALLOWED_VIDEO_TYPES || 'video/mp4,video/quicktime,video/x-msvideo').split(',');
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only video files are allowed.'));
        }
    }
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Video upload endpoint
app.post('/api/upload', upload.single('video'), async (req, res) => {
    try {
        console.log('Starting video upload process...');
        
        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Processing video file...');
        const videoFile = {
            name: req.file.originalname,
            data: req.file.buffer
        };

        // Process video
        console.log('Starting video processing...');
        const processResult = await videoProcessor.processVideo(videoFile);
        console.log('Video processing result:', processResult);

        if (!processResult.success) {
            console.error('Video processing failed:', processResult.error);
            return res.status(500).json({ error: processResult.error });
        }

        // Get signed URLs
        console.log('Generating signed URLs...');
        const videoUrl = await s3Service.getSignedUrl(processResult.videoKey);
        const audioUrl = await s3Service.getSignedUrl(processResult.audioKey);
        console.log('Signed URLs generated');

        if (!videoUrl.success || !audioUrl.success) {
            console.error('Failed to generate signed URLs:', { videoUrl, audioUrl });
            return res.status(500).json({ error: 'Failed to generate signed URLs' });
        }

        // Transcribe audio
        console.log('Starting audio transcription...');
        const transcription = await transcriptionService.transcribeAudio(processResult.audioKey);
        console.log('Transcription completed');

        if (!transcription.success) {
            console.error('Transcription failed:', transcription.error);
            return res.status(500).json({ error: transcription.error });
        }

        // Generate content
        console.log('Generating content...');
        const content = await contentGenerator.generateContent(transcription.transcription);
        console.log('Content generation completed');

        if (!content.success) {
            console.error('Content generation failed:', content.error);
            return res.status(500).json({ error: content.error });
        }

        // Return results
        console.log('Sending successful response');
        res.json({
            videoUrl: videoUrl.url,
            audioUrl: audioUrl.url,
            transcription: transcription.transcription,
            generatedContent: content.content
        });

    } catch (error) {
        console.error('Error in upload endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Upload directory:', uploadsDir);
    console.log('Temp directory:', tempDir);
}); 