

const validateUser = (req, res, next) => {
    const { role } = req.user;
    if(role === 'Contractor'){
        return res.status(403).send({ msg: 'Access denied. Contractors are not allowed to perform this action.' });
    }

    next();
}

export default validateUser;