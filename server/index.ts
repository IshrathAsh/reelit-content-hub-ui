import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { VideoProcessor } from './services/videoProcessor';
import { generateCaption, generateHashtags, generateDescription } from '../src/lib/openai';
import fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize video processor
const videoProcessor = new VideoProcessor();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, MOV, and AVI files are allowed.'));
    }
  }
});

// Routes
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const videoId = Date.now().toString();
    res.json({ videoId, filePath: req.file.path });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

app.post('/api/process/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'Video file path not provided' });
    }

    // Process video: extract audio and transcribe
    const transcript = await videoProcessor.processVideo(filePath);
    
    // Clean up the video file after processing
    videoProcessor.cleanup(filePath);

    res.json({ transcript });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    // Generate content using OpenAI
    const [caption, hashtags, description] = await Promise.all([
      generateCaption(transcript, customPrompt),
      generateHashtags(transcript, customPrompt),
      generateDescription(transcript, customPrompt)
    ]);

    res.json({
      caption,
      hashtags,
      description
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 