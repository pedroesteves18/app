import { Router } from 'express'
import sanitize from '../../global/sanitize/sanitize.js'
import validateData from './middlewares/validateData.js'
import userController from '../controller/userController.js'
import validateAvailability from './middlewares/validateAvailability.js'
import verifyAdmToken from '../../global/middleware/verifyAdmToken.js'
import verifyToken from '../../global/middleware/verifyToken.js'
import multuer from 'multer'
const upload = multuer().single('perfilPhoto')
const router = Router()

router.post('/',upload,sanitize, validateData, validateAvailability, userController.createUser),
router.post('/login', sanitize, userController.login)
router.get('/me', verifyToken, userController.fetchMe)

router.get('/adm', verifyToken,verifyAdmToken, userController.fetchMe)
export default router