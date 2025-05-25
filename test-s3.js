import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

async function testS3Connection() {
    try {
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        const command = new ListBucketsCommand({});
        const response = await s3Client.send(command);
        
        console.log('Successfully connected to AWS S3!');
        console.log('Available buckets:', response.Buckets.map(bucket => bucket.Name));
    } catch (error) {
        console.error('Error connecting to AWS S3:', error.message);
    }
}

testS3Connection(); 