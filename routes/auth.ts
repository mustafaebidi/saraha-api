import express from 'express';
import vaildator from "../vaildator/auth"
import Controller from '../controllers/auth';

import verifyJWT from '../middleware/verifyJWT';


const router = express.Router();


router.post('/changePassword',vaildator.ChangePassword,verifyJWT ,Controller.changePassword );
router.post('/changePhoto',verifyJWT ,Controller.changePhoto );

router.post('/setPrivacy',vaildator.setPrivacy,verifyJWT  ,Controller.setPrivacy  );
router.get('/getPrivateData',verifyJWT  ,Controller.getPrivateData );
router.post('/setGeneralSettings',vaildator.setGeneralSettings,verifyJWT  ,Controller.setGeneralSettings  );
router.post('/sendForgetPassword' ,vaildator.sendForgetPassword,Controller.sendForgetPaswword );
router.post('/logout',verifyJWT,Controller.logout );

router.post('/login',vaildator.login,Controller.login  );
router.post('/registration',vaildator.registration,Controller.registration);

router.get('/refresh', Controller.refresh);

router.get('/forgetPassword/:id/:token', Controller.forgetPassword);
router.post('/forgetPassword/:id/:token',vaildator.restPassword, Controller.restPassword);


    
export default router;
