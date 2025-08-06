
import bucket from '../../jobs/bucket.js';
import userService from '../services/user.js';
const userController = {
    createUser: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send({ msg: 'No photo uploaded.' });
            }
            const perfilPhotoURL = await bucket.bucketImageUpload(req.file);
            const userData = {
                ...req.body,
                perfilPhoto: perfilPhotoURL
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
    insertPictures: async (req,res) => {
        try{
            const user = await userService.fetchme(req.user.id);
            if (!user) throw new Error('User not found');
            const workingPictures = req.files
            if (!workingPictures || workingPictures.length === 0) {
                return res.status(400).send({ msg: 'No pictures uploaded.' });
            }
            const { uploadedUrls, errors } = await userService.insertPictures(user.id, workingPictures);
            if (errors.length > 0) {
                return res.status(500).send({ msg: 'Some pictures could not be uploaded.', errors: errors });
            }
            return res.status(200).send({ msg: 'Pictures uploaded successfully!', pictures: uploadedUrls });
        }catch(err){
            return res.status(500).send({ msg: 'Error uploading pictures.', error: err.message });
        }
    },
    login: async (req,res) => {
        console.log('test')
        try{
            const [user,token] = await userService.login(req.body)
            if(!user || !token) return res.status(401).send({msg: "Invalid credentials!"})
            res.setHeader('Authorization', `Bearer ${token}`);
            return res.status(200).send({msg: "Login sucessfully!", user: user, token: token})

        }catch(err){
            return res.status(500).send({ msg: 'Error logging the user in.', error: err.message });
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
    },
    updateMe: async (req, res) => {
        try {
            const userId = req.user.id;
            const userData = req.body;
            userData.perfilPhoto = req.file
            let user = await userService.updateMe(userId, userData);
            
            return res.status(200).send({ msg: 'User updated successfully!', user: user });
        } catch (error) {
            return res.status(500).send({ msg: 'Error updating user data.', error: error.message });
        }
    }
}


export default userController