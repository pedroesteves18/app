import Service from "../../models/services.js";

const validateOwner = async (req, res, next) => {
    const serviceId = req.params.id || req.query.id;
    if (!serviceId) {
        return res.status(400).send({ msg: 'Service ID is required.' });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
        return res.status(404).send({ msg: 'Service not found.' });
    }

    if (service.userId !== req.user.id) {
        return res.status(403).send({ msg: 'You do not have permission to access this service.' });
    }

    next();
}

export default validateOwner;
