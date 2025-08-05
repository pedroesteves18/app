import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const bucketImageUpload = async (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    
    try {
        const data = await s3.upload(params).promise();
        if (!data || !data.Location) {
            throw new Error('File uploading to AWS failed');
        }
        return data.Location;
    } catch (error) {
        throw new Error(`Error uploading file: ${error.message}`);
    }
};

export default bucketImageUpload;