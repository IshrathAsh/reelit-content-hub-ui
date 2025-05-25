import fs from 'fs';
import path from 'path';

interface VideoMetadata {
  id: string;
  filePath: string;
  originalName: string;
  uploadTime: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transcript?: string;
}

export class StorageService {
  private uploadsDir: string;
  private metadata: Map<string, VideoMetadata>;

  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.metadata = new Map();
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Store video file and its metadata
   */
  public storeVideo(file: Express.Multer.File): VideoMetadata {
    const id = Date.now().toString();
    const metadata: VideoMetadata = {
      id,
      filePath: file.path,
      originalName: file.originalname,
      uploadTime: Date.now(),
      status: 'pending'
    };

    this.metadata.set(id, metadata);
    return metadata;
  }

  /**
   * Get video metadata by ID
   */
  public getVideoMetadata(id: string): VideoMetadata | undefined {
    return this.metadata.get(id);
  }

  /**
   * Update video status
   */
  public updateVideoStatus(id: string, status: VideoMetadata['status'], transcript?: string): void {
    const metadata = this.metadata.get(id);
    if (metadata) {
      metadata.status = status;
      if (transcript) {
        metadata.transcript = transcript;
      }
      this.metadata.set(id, metadata);
    }
  }

  /**
   * Clean up video file and metadata
   */
  public cleanup(id: string): void {
    const metadata = this.metadata.get(id);
    if (metadata) {
      // Delete file if it exists
      if (fs.existsSync(metadata.filePath)) {
        fs.unlinkSync(metadata.filePath);
      }
      // Remove metadata
      this.metadata.delete(id);
    }
  }

  /**
   * Get all pending videos
   */
  public getPendingVideos(): VideoMetadata[] {
    return Array.from(this.metadata.values())
      .filter(video => video.status === 'pending');
  }
} 