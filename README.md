# Reelit Content Hub

A powerful content generation platform that processes videos, extracts audio, transcribes content, and generates engaging social media content using AI.

## Features

- 🎥 Video upload and processing
- 🔊 Audio extraction from videos
- 📝 Automatic transcription using Whisper
- 🤖 AI-powered content generation using OpenAI
- ☁️ Cloud storage with AWS S3
- 🔒 Secure file handling and cleanup

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **AI/ML**: OpenAI GPT-3.5, Whisper
- **Storage**: AWS S3
- **Video Processing**: FFmpeg

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with S3 access
- OpenAI API key
- FFmpeg installed on your system

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reelit-content-hub-ui.git
   cd reelit-content-hub-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your credentials:
     - OpenAI API key
     - AWS credentials
     - Other configuration values

4. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### POST /api/upload
Upload and process a video file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: video file

**Response:**
```json
{
  "message": "Video processed successfully",
  "videoUrl": "signed-s3-url-for-video",
  "audioUrl": "signed-s3-url-for-audio",
  "transcription": "transcribed text",
  "generatedContent": "AI-generated content"
}
```

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-3.5 and Whisper
- AWS for S3 storage
- FFmpeg for video processing
