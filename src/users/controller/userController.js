
import User from '../models/user.js';
import userService from '../services/user.js';
const userController = {
    createUser: async (req, res) => {
        try {
            const user = userService.createUser(req.body)

            return res.status(201).send({ msg: 'User created sucessfully!', user: user });
        } catch (error) {
            return res.status(500).send({ msg: 'Error creating User', error: error.message });
        }
    },
    login: async (req,res) => {
        try{
            const [user,token] = await userService.login(req.body)
            if(!user || !token) return res.status(401).send({msg: "Invalid credentials!"})
            res.setHeader('Authorization', `Bearer ${token}`);
            return res.status(200).send({msg: "Login sucessfully!", user: user, token: token})

        }catch(err){
            
        }
    }
}


export default userController