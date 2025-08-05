
const verifyAdmToken = (req, res, next) => {
    let user = req.user;
    if(user.role !== 'Admin') {
        return res.status(403).send({ message: 'Access denied. Admins only.' });
    }
    next();
}

export default verifyAdmToken;