import express from 'express';


import verifyJWT from '../middleware/verifyJWT';
import Controller from '../controllers/massage'
import vaildator from "../vaildator/massage"
const router = express.Router();


router.get('/getAll',verifyJWT,Controller.getLengthOfmassages );
router.get('/getAll/:skip',verifyJWT  ,Controller.getAllMassage  );
router.get('/:id',vaildator.checkExsitUser,Controller.checkExsitUser );


router.post('/setStatus/:id',vaildator.setStatus,verifyJWT ,Controller.setStatusOfMassage );
router.post('/:id',vaildator.createMassage,Controller.createMassage );
router.delete('/:id',vaildator.deleteMassage,verifyJWT  ,Controller.deleteMassage );
router.patch('/toggleFavoure/:id',vaildator.toggleFavoure,verifyJWT  ,Controller.toggleFavorite );
router.get('/opinionsAllowed/:id',vaildator.getOpinionsAllowed,Controller.getOpinionsAllowed );
router.post('/addReply/:id',vaildator.addReply,verifyJWT  ,Controller.addReply );



export default router;
