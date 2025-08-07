import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Service from '../../services/models/services.js';
import bcrypt, { hash } from 'bcryptjs';
import bucket from '../../jobs/bucket.js';

const userService = {
    hashPassword: async (password) => {
        let rounds = parseInt(process.env.ROUNDS)
        return await bcrypt.hash(password, rounds)
    },

    comparePassword: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword)
    },
    createUser: async (userData) => {
        const hashed = await userService.hashPassword(userData.password)
        userData.password = hashed
        return await User.create(userData);
    },
    login: async (userData) => {
        console.log('test')
        let user = await User.findOne({
            where: { email: userData.email }
        })
        const hashedPassword = user ? user.password : null;
        if (!hashedPassword) throw new Error('Invalid credentials');
        const compared = await userService.comparePassword(userData.password, hashedPassword);
        if (!compared) throw new Error('Invalid credentials');
        let token = userService.createToken(user);
        return [user,token]
    },
    createToken: (user) => {
        const payload = {
            id: user.id,
            role: user.role
        }
        return jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });
    },
    fetchme(userId) {
        return User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Service,
                as: 'Services',
                attributes: ['id', 'name', 'description', 'workingPictures']
            }]
        });
    },
    updateMe: async (userId, userData) => {
        const user = await User.findByPk(userId);

        if (userData.password) {
            userData.password = await userService.hashPassword(userData.password);
        }

        if (userData.perfilPhoto) {
            const perfilPhotoURL = await bucket.bucketImageUpload(userData.perfilPhoto);
            userData.perfilPhoto = perfilPhotoURL;
        }

        return await user.update(userData);
    }

}



export default userService