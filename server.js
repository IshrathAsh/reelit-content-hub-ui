import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Diagnostic: Check if environment variables are loaded here
console.log('\n=== server.js dotenv load check ===');
console.log(`AWS_BUCKET_NAME in server.js: ${process.env.AWS_BUCKET_NAME}`);
console.log(`AWS_REGION in server.js: ${process.env.AWS_REGION}`);
console.log(`OPENAI_API_KEY in server.js: ${process.env.OPENAI_API_KEY ? 'Loaded' : 'NOT LOADED'}`);
console.log('===================================');

// Import the classes instead of instances
import VideoProcessor from './server/services/videoProcessor.js';
import TranscriptionService from './server/services/transcriptionService.js';
import ContentGenerator from './server/services/contentGenerator.js';
import S3Service from './server/services/s3Service.js';

// Instantiate services *after* dotenv.config()
const s3Service = new S3Service();
const videoProcessor = new VideoProcessor(s3Service);
const transcriptionService = new TranscriptionService(s3Service);
const contentGenerator = new ContentGenerator();

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
    console.log('\n=== New Request ===');
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
        console.log('\n=== Starting Video Upload Process ===');
        
        if (!req.file) {
            console.error('❌ No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('📁 File received:', {
            name: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        });

        const videoFile = {
            name: req.file.originalname,
            data: req.file.buffer
        };

        // Process video
        console.log('\n=== Processing Video ===');
        const processResult = await videoProcessor.processVideo(videoFile);
        console.log('Video processing result:', processResult);

        if (!processResult.success) {
            console.error('❌ Video processing failed:', processResult.error);
            return res.status(500).json({ error: processResult.error });
        }

        // Get signed URLs
        console.log('\n=== Generating Signed URLs ===');
        const videoUrl = await s3Service.getSignedUrl(processResult.videoKey);
        const audioUrl = await s3Service.getSignedUrl(processResult.audioKey);
        console.log('Signed URLs generated:', {
            videoUrl: videoUrl.success ? '✅' : '❌',
            audioUrl: audioUrl.success ? '✅' : '❌'
        });

        if (!videoUrl.success || !audioUrl.success) {
            console.error('❌ Failed to generate signed URLs:', { videoUrl, audioUrl });
            return res.status(500).json({ error: 'Failed to generate signed URLs' });
        }

        // Transcribe audio
        console.log('\n=== Starting Audio Transcription ===');
        const transcription = await transcriptionService.transcribeAudio(processResult.audioKey);
        console.log('Transcription result:', {
            success: transcription.success ? '✅' : '❌',
            length: transcription.success ? transcription.transcription.length : 0
        });

        if (!transcription.success) {
            console.error('❌ Transcription failed:', transcription.error);
            return res.status(500).json({ error: transcription.error });
        }

        // Generate content
        console.log('\n=== Generating Content ===');
        const content = await contentGenerator.generateContent(transcription.transcription);
        console.log('Content generation result:', {
            success: content.success ? '✅' : '❌',
            sections: content.success ? Object.keys(content.content).length : 0
        });

        if (!content.success) {
            console.error('❌ Content generation failed:', content.error);
            return res.status(500).json({ error: content.error });
        }

        // Return results
        console.log('\n=== Process Completed Successfully ===');
        const response = {
            videoUrl: videoUrl.url,
            audioUrl: audioUrl.url,
            transcription: transcription.transcription,
            generatedContent: content.content
        };
        console.log('Response prepared with:', {
            videoUrl: '✅',
            audioUrl: '✅',
            transcription: '✅',
            generatedContent: '✅'
        });

        res.json(response);

    } catch (error) {
        console.error('\n❌ Error in upload endpoint:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('\n❌ Global error handler:', err);
    res.status(500).json({
        error: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log('\n=== Server Started ===');
    console.log(`🌐 Server running on port ${port}`);
    console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
    console.log('📁 Upload directory:', uploadsDir);
    console.log('📁 Temp directory:', tempDir);
    console.log('=== Ready for Requests ===\n');
}); 