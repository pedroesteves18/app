import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import bcrypt, { hash } from 'bcryptjs';
import { Op } from 'sequelize';

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
        let user = await User.findOne({
            where: { email: userData.email }
        })
        const hashedPassword = user ? user.password : null;
        if (!hashedPassword) return [null, null];
        const compared = await userService.comparePassword(userData.password, hashedPassword);
        if (!compared) return [null, null];
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
        return User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] }
        });
    }
}


export default userService