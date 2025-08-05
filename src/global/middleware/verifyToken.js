import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
    }
    token = token.split(' ')[1];
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
        return res.status(401).send({ message: 'Unauthorized access.' });
        }
        req.user = decoded;
        next();
    });
}

export default verifyToken;