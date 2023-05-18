import { NextFunction ,Request,Response} from 'express';
import { body, validationResult } from 'express-validator';

const validatorMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return res.status(400).json({ msg: errors.array()[0].msg});
  }
  next();
};

export default validatorMiddleware;