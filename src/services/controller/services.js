import userService from "../../users/services/user.js";
import serviceService from "../../services/services/service.js";


const serviceController = {
    updateService: async (req, res) => {
        try {
            const { user } = req;
            const serviceId = req.query.id;
            const data = req.body;

            if (!serviceId) {
                return res.status(400).send({ msg: 'Service ID is required.' });
            }

            if (!data) {
                return res.status(400).send({ msg: 'No data sent.' });
            }

            data.workingPictures = req.files || req.file || [];
            data.deletedPictures = data.deletedPictures || null;
            const service = await serviceService.updateService(serviceId, data,data.deletedPictures);
            return res.status(200).send(service);
        } catch (err) {
            return res.status(500).send({ msg: 'Error updating service.', error: err.message });
        }
    },
    createService: async (req, res) => {    
        try {
            const {user} = req;
            const  data  = req.body;
            if (!data || data.length === 0) {
                return res.status(400).send({ msg: 'Any data sent.' });
            }
            data.workingPictures = req.files || req.file || [];
            data.deletedPictures = data.deletedPictures || [];
            const service = await serviceService.createService(user.id, data);
            return res.status(200).send({ msg: 'Service created successfully!', service: service });
        } catch (err) {
            return res.status(500).send({ msg: 'Error creating service.', error: err.message });
        }
    },
    fetchAllMyServices: async (req, res) => {
        try {
            const { user } = req;
            const services = await serviceService.fetchAllMyServices(user.id);
            return res.status(200).send(services);
        } catch (err) {
            return res.status(500).send({ msg: 'Error fetching services.', error: err.message });
        }
    }
}

export default serviceController;