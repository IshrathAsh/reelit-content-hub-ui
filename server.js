const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const s3Service = require('./server/services/s3Service');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for video upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOADS_DIR || 'server/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
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
            cb(new Error('Invalid file type. Only video files are allowed.'));
        }
    }
});

// Routes
app.post('/api/upload', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        // Process the video
        const videoProcessor = require('./server/services/videoProcessor');
        const result = await videoProcessor.processVideo(req.file);

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        // Generate signed URLs for video and audio
        const videoUrlResult = await s3Service.getSignedUrl(result.videoKey);
        const audioUrlResult = await s3Service.getSignedUrl(result.audioKey);

        if (!videoUrlResult.success || !audioUrlResult.success) {
            return res.status(500).json({ error: videoUrlResult.error || audioUrlResult.error });
        }

        // Transcribe the audio (download from S3)
        // Download audio file from S3 to temp for transcription
        const audioTempPath = path.join(process.env.TEMP_DIR || 'server/temp', `${Date.now()}-audio.mp3`);
        const { GetObjectCommand } = require('@aws-sdk/client-s3');
        const { createWriteStream } = require('fs');
        const s3Client = s3Service.s3Client;
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

        const transcriptionService = require('./server/services/transcriptionService');
        const transcriptionResult = await transcriptionService.transcribeAudio(audioTempPath);

        // Clean up temp audio file
        await fs.promises.unlink(audioTempPath);

        if (!transcriptionResult.success) {
            return res.status(500).json({ error: transcriptionResult.error });
        }

        // Generate content from transcription
        const contentGenerator = require('./server/services/contentGenerator');
        const contentResult = await contentGenerator.generateContent(transcriptionResult.transcription);

        if (!contentResult.success) {
            return res.status(500).json({ error: contentResult.error });
        }

        res.json({
            message: 'Video processed successfully',
            videoUrl: videoUrlResult.url,
            audioUrl: audioUrlResult.url,
            transcription: transcriptionResult.transcription,
            generatedContent: contentResult.content
        });
    } catch (error) {
        console.error('Error processing video:', error);
        res.status(500).json({ error: 'Error processing video' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: err.message || 'Something went wrong!'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 