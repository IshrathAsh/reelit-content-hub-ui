import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';

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
        console.log('\n=== S3 Service Initialization Check ===');
        console.log(`Bucket Name from .env: ${this.bucketName}`);
        console.log(`AWS Region from .env: ${process.env.AWS_REGION}`);
        console.log(`AWS Access Key ID from .env: ${process.env.AWS_ACCESS_KEY_ID ? 'Loaded' : 'NOT LOADED'}`);
        console.log('=======================================');
       
    }

    async uploadFile(filePath, key) {
        try {
            console.log('Uploading file to S3:', { filePath, key });
            const fileContent = await fs.readFile(filePath);
            
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: fileContent
            });

            await this.s3Client.send(command);
            console.log('File uploaded successfully');
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

    async downloadFile(key, localPath) {
        try {
            console.log('Downloading file from S3:', { key, localPath });
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key
            });

            const response = await this.s3Client.send(command);
            
            return new Promise((resolve, reject) => {
                const writeStream = createWriteStream(localPath);
                response.Body.pipe(writeStream);
                
                writeStream.on('finish', () => {
                    console.log('File downloaded successfully');
                    resolve({
                        success: true,
                        path: localPath
                    });
                });
                
                writeStream.on('error', (error) => {
                    console.error('Error writing file:', error);
                    reject({
                        success: false,
                        error: error.message
                    });
                });
            });
        } catch (error) {
            console.error('Error downloading from S3:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getSignedUrl(key) {
        try {
            console.log('Generating signed URL for:', key);
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
            console.log('Signed URL generated successfully');
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
            console.log('Deleting file from S3:', key);
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key
            });

            await this.s3Client.send(command);
            console.log('File deleted successfully');
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

export default S3Service; 