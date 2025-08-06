import AWS from 'aws-sdk';
import rekognitionService from './rekognition.js';
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const bucketImageUpload = async (file) => {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    
    try {
        const data = await s3.upload(params).promise();
        if (!data || !data.Location) {
            throw new Error('File uploading to AWS failed');
        }
        await rekognitionService.runAllRekognitionJobs(data.Key);
        
        return data.Location;
    } catch (error) {
        throw new Error(`Error uploading file: ${error.message}`);
    }
};

const s3Delete = async (fileName) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    };
    
    try {
        await s3.deleteObject(params).promise();
    } catch (error) {
        throw new Error(`Error deleting file from S3: ${error.message}`);
    }
};

export default {bucketImageUpload,s3Delete};