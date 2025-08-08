import contractController from '../controller/contract.js';
import { Router } from 'express';
import verifyToken from '../../global/middleware/verifyToken.js';
import contractController from '../controller/contract';

const router = Router();


router.post('/start-chat', verifyToken, contractController.startChat);