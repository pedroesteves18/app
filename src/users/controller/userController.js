
import bucketImageUpload from '../../jobs/bucket.js';
import userService from '../services/user.js';
const userController = {
    createUser: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send({ msg: 'No photo uploaded.' });
            }
            const userData = {
                ...req.body,
                perfilPhoto: await bucketImageUpload(req.file)
            };
            let user = await userService.createUser(userData)
            if (!user) return res.status(400).send({ msg: 'Error creating user.' });

            user = user.toJSON();
            delete user.password;
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
    },
    fetchMe: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await userService.fetchme(userId);
            if (!user) {
                return res.status(404).send({ msg: 'User not found.' });
            }
            return res.status(200).send({ user:user });
        } catch (error) {
            return res.status(500).send({ msg: 'Error fetching user data.', error: error.message });
        }
    }
}


export default userController