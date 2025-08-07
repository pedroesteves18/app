import bucket from '../../jobs/bucket.js';
import userService from '../../users/services/user.js';
import Service from '../models/services.js';

const serviceService= {
    fetchService: async (serviceId) => {
        return await Service.findByPk(serviceId);
    },
    createService: async (userId, data) => {
        const user = await userService.fetchme(userId);
        console.log(user)

        const { uploadedUrls, errors } = await serviceService.insertPictures(data.workingPictures);
        if (errors.length > 0) {
            return { msg: 'Some pictures could not be uploaded.', errors: errors };
        }
        console.log(user.id)
        console.log(userId)
        const service = await Service.create({
            name: data.name,
            description: data.description,
            workingPictures: uploadedUrls,
            isEnabled: true,
            userId: user.id
        });
        console.log(service.user)
        return { msg: 'Service created successfully!', service: service};
    },
    updateService: async (serviceId, data) => {
        const service = await serviceService.fetchService(serviceId);
        if(data.workingPictures || data.deletedPictures) {
            const { uploadedUrls, errors } = await serviceService.updatePictures(
                                                                                    service.id,
                                                                                    data.workingPictures,
                                                                                    data.deletedPictures
                                                                                );
            if (errors) return errors
                                      
            service.workingPictures = [...service.workingPictures, ...uploadedUrls];
            console.log('teste')
        }
        service.name = data.name || service.name;
        service.description = data.description || service.description;
        service.isEnabled = data.isEnabled || service.isEnabled;
        await service.save();
        return { msg: 'Service updated successfully!', service: service };
    },
    insertPictures: async (workingPictures) => {
        const uploadedUrls = [];
        const errors = []
        for (const picture of workingPictures) {
            const uploadedUrl = await bucket.bucketImageUpload(picture, 'workingPictures');
            if(!uploadedUrl){
                errors.push(picture)
            } else {
                uploadedUrls.push(uploadedUrl);
            }
        }
        return { uploadedUrls, errors };
    },
    updatePictures: async (serviceId, workingPictures,deletedPictures) => {
        const service = await serviceService.fetchService(serviceId);
        if(deletedPictures) {
            const { remainingPictures } = await serviceService.deletePictures(deletedPictures,serviceId);
            service.workingPictures = remainingPictures;
        }
        const uploadedUrls = [];
        const errors = [];
        for (const picture of workingPictures) {
            try {
                const uploadedUrl = await bucket.bucketImageUpload(picture, 'workingPictures');
                uploadedUrls.push(uploadedUrl);
            } catch (error) {
                errors.push({ file: picture.originalname, error: error.message });
            }
        }

        service.workingPictures = [...service.workingPictures, ...uploadedUrls];
        await service.save();
        
        return {uploadedUrls, errors: errors.length > 0 ? errors : null};
    },
    deletePictures: async (pictureUrls,serviceId) => {
        for (const url of pictureUrls) {
            const fileName = url.split('/').pop();
            await bucket.s3Delete(fileName);
        }
        const remainingPictures = await Service.findByPk(serviceId, {
            attributes: ['workingPictures']
        });
        return { remainingPictures: remainingPictures.workingPictures };
    }
}

export default serviceService;