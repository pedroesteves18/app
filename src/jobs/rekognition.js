import AWS from 'aws-sdk';
import bucket from './bucket.js';
const rekognition = new AWS.Rekognition({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const rekognitionService = {
    detectFace: async (imageURL) => {
        try{
            return await rekognition.detectFaces({
                Image: {
                    S3Object: {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Name: imageURL  
                    }   
                },
                Attributes: ['ALL']
            }).promise()
        }catch(error){
            throw new Error(`Error detecting face: ${error.message}`);
        }

    },
    detectCelebrity: async (imageURL) => {
        try{
            return await rekognition.recognizeCelebrities({
                Image: {
                    S3Object: {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Name: imageURL  
                    }   
                }
            }).promise()
        }catch(error){
            throw new Error(`Error detecting celebrity: ${error.message}`);
        }
    },
    detectSensitiveContent: async (imageURL) => {
        try{
            return await rekognition.detectModerationLabels({
                Image: {
                    S3Object: {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Name: imageURL  
                    }   
                },
                MinConfidence: 85
            }).promise()
        }catch(error){
            throw new Error(`Error detecting sensitive content: ${error.message}`);
        }
    },
    runAllRekognitionJobs: async (imageURL) => {        
        try {
            console.log('Running Rekognition jobs on image:', imageURL);
            const faceResult = await rekognitionService.detectFace(imageURL);
            if (!faceResult || !faceResult.FaceDetails || faceResult.FaceDetails.length === 0) {
                await bucket.s3Delete(imageURL);
                throw new Error('You must upload a photo with your face!');
            }

            const sensitiveResult = await rekognitionService.detectSensitiveContent(imageURL);
            if (sensitiveResult && sensitiveResult.ModerationLabels && sensitiveResult.ModerationLabels.length > 0) {
                await bucket.s3Delete(imageURL);
                throw new Error('Sensitive content detected in the photo!');
            }

            const celebResult = await rekognitionService.detectCelebrity(imageURL);
            if (celebResult && celebResult.CelebrityFaces && celebResult.CelebrityFaces.length > 0) {
                await bucket.s3Delete(imageURL);
                throw new Error('Celebrity recognized in the photo!');
            }
            console.log('All Rekognition jobs completed successfully');
            return true;

        } catch (error) {
            throw new Error(`Error running Rekognition jobs: ${error.message}`);
        }
    }
};

export default rekognitionService;