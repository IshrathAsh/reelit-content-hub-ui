import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs/promises';
import path from 'path';

class S3Service {
    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
        this.bucketName = process.env.AWS_BUCKET_NAME;
    }

    async uploadFile(filePath, key) {
        try {
            const fileContent = await fs.readFile(filePath);
            
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: fileContent
            });

            await this.s3Client.send(command);
            return {
                success: true,
                key: key
            };
        } catch (error) {
            console.error('Error uploading to S3:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getSignedUrl(key) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
            return {
                success: true,
                url: signedUrl
            };
        } catch (error) {
            console.error('Error generating signed URL:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteFile(key) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key
            });

            await this.s3Client.send(command);
            return {
                success: true
            };
        } catch (error) {
            console.error('Error deleting from S3:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new S3Service(); 