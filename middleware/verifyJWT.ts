import jwt from 'jsonwebtoken';
import {Response,Request, NextFunction} from 'express';
import User from '../model/User';

import {IUser} from '../model/User';


export interface IRequest extends  Request  {
    userInfo:IUser | null
}

const verifyJWT = async(expressRequest:Request, res:Response, next:NextFunction) => {

    const req= expressRequest as IRequest

    const authHeader :string | undefined= req.headers.authorization

    console.log("#############################################")

    console.log(authHeader)


   
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        "sasa",
        async(err:any, decoded:any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            let user = await User.findOne({ _id:decoded.userInfo.id }).select("-password")
            if(user){
                req.userInfo = user
                user.isOnline=true
                user.lastSeen=new Date()

                await user.save()

            }



            next()
        }
    )
}

export default verifyJWT

