import { Router } from 'express'
import sanitize from './middlewares/sanitize.js'
import validateData from './middlewares/validateData.js'
import userController from '../controller/userController.js'
import validateAvailability from './middlewares/validateAvailability.js'

const router = Router()

router.post('/', sanitize, validateData, validateAvailability, userController.createUser),
router.post('/login', sanitize, userController.login)


export default router