import { Router } from 'express'
import serviceController from '../controller/services.js'
import verifyToken from '../../global/middleware/verifyToken.js'
import multer from 'multer'
import validateData from './middlewares/validateData.js'

const BulkUpload = multer().array('workingPictures',5)
const router = Router()


router.post('/',BulkUpload,validateData,verifyToken, serviceController.createService)
router.put('/',BulkUpload,validateData,verifyToken, serviceController.updateService)

router.get('/', verifyToken, serviceController.fetchAllMyServices)

export default router