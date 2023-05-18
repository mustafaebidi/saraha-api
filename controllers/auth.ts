import {Response,Request, NextFunction} from 'express';
import User from "../model/User";
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {IUser,Privacy} from "../model/User";
import {IRequest} from '../middleware/verifyJWT';
import { FileArray, UploadedFile } from 'express-fileupload';
const shortid = require('shortid');


type Photo={
    avatar:UploadedFile

}



const login=async(req : IRequest,res: Response)=>{


    const{email,password}=req.body
    
    let user = await User.findOne({ email })


    ///If the WRITE USERNAME instead OF EMAIL
    if(!user)
        user = await User.findOne({ username:email })

    if(!user)
        return res.status(401).json({msg:'يوجد خطا في كلمة السر او البريد الالكتروني'})


    const match = await bcrypt.compare(password, user.password);

    const{_id,username}=user

    if(!match)
        return res.status(401).json({msg:'يوجد خطا في كلمة السر او البريد الالكتروني'})


    const accessToken = jwt.sign(
        {
            "userInfo": {
                "id": _id,
                "roles": user.roles
            }
        },
        "sasa",
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "id":_id },
        "sasa",
        { expiresIn: '16h' }
    )   


    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'none', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

  
    user.isOnline=true
    user.lastSeen=new Date()


    await user.save()
    let userInfo={...user?._doc}

    return res.json({token:accessToken,...userInfo})
    


}

const registration=async(req: Request,res :Response,next:NextFunction)=>{
    const{email,password,username}=req.body 
    let uniqueName=""


    const exsit=await User.findOne({email})

    if(exsit)
        return res.status(401).json({msg:"هذا البريد الالكتروني مستخدم من قبل"})



    if(req?.files){

        let photoInfo=req.files  as Photo
        let avatar=photoInfo.avatar as UploadedFile


        console.log(req.files)


        const filename = avatar?.name;

        let lengthl=filename.split(".").length-1
        uniqueName=`${shortid.generate()}.${filename.split(".")[lengthl]}`

        avatar.mv(__dirname +"/../"+"/public/profile/"+uniqueName)

    }




    const hasedPassword=await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        email,
        password:hasedPassword,
        img:uniqueName
    });

    res.status(201).json({msg:"Successfully Registered"})

}

const logout = async(req : Request, res :Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content

    let user = await User.findOne({ _id:req?.userInfo?._id })

    console.log("8888888888888888888888888888888888888888888888888888888")

    console.log(req?.userInfo)

    if(user){
        user.isOnline=false
        user.lastSeen=new Date()
        await user.save()
    }


    console.log("8888888888888888888888888888888888888888888888888888888")

    console.log(user)


    res.clearCookie('jwt', {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'none', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    res.json({ message: 'Cookie cleared' })
} 

const refresh = (req:Request, res:Response) => {
    const cookies = req.cookies

    console.log(cookies)
    
    if (!cookies?.jwt){
        console.log(805)
        return res.status(401).json({ message: 'ahmed' })

    } 

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        "sasa",
        async (err:JsonWebTokenError | null, decoded:any) => {

            if (err) return res.status(403).json({ message: 'Forbidden' })

            type TypeC = IUser & Document;

            const foundUser = await User.findOne({_id:decoded.id}).select("-password")

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "id": foundUser._id,
                        "roles": foundUser.roles
                    }
                },
                "sasa",
                { expiresIn: '15m' }
            )

            foundUser.isOnline=true
            foundUser.lastSeen=new Date()

            foundUser.save()

            
            return res.json({token:accessToken,...foundUser._doc})

        }
    )
}

const sendForgetPaswword =async(req: Request,res :Response,next:NextFunction)=>{

    const{email}=req.body


    const foundUser = await User.findOne({email}) as IUser
    console.log(foundUser)

    if(!foundUser)
        return res.status(401).json({err:"لا يوجد اميل بهذا العنوان"})

    const seccret=foundUser.password + "sasa"



        const accses =await jwt.sign(
            {
                email
            },
            seccret,
            { expiresIn: '15m' }
        )
    

        foundUser.forgetPasswordToken=accses

        await foundUser.save()

        console.log(`http://localhost:3000/forgetPassword/${foundUser._id}/${accses}`)
        
        return res.json({link:`http://localhost:3850/auth/forgetPaswword/${foundUser._id}/${accses}`})



}

const forgetPassword =async(req: Request,res :Response,next:NextFunction)=>{

    const{id,token}=req.params

    let user=await User.findOne({_id:id,forgetPasswordToken:token}) as IUser

    const secret  =user?.password + "sasa"

    try{
        const verify =await jwt.verify(token, secret);
        return res.json({msg:"succsfull"})

    }
    catch{

        return res.sendStatus(403) 
    }



}

const restPassword =async(req: Request,res :Response,next:NextFunction)=>{

    const{id,token}=req.params
    const{password}=req.body

    console.log(password)
    console.log(id,token)

    let user=await User.findOne({_id:id,forgetPasswordToken:token}) as IUser

    if(!user){
        return res.status(403).json({"msg":"User Not Exists!"});
    }
    
    const secret =user?.password + "sasa"


    try{

        const verify = await jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);

        user.password=encryptedPassword
        user.forgetPasswordToken=""

        await user.save()
        res.json({msg:"Successfully"})

    }
    catch{
        return res.sendStatus(403)
        
    }


}

const changePassword=async(req: IRequest ,res :Response,next:NextFunction)=>{

    console.log(44)

    const {password} = req.body;

    const user = req.userInfo as IUser;
    console.log(user)

    const encryptedPassword = await bcrypt.hash(password, 10);

    user.password=encryptedPassword
    await user.save()

    return res.json({"msg":"successfully"})

    
}

const setPrivacy=async(req:IRequest,res:Response)=>{

    const {privacy}=req.body


    await User.findOneAndUpdate({_id:req?.userInfo?._id},{privacy:privacy})

    const user=await User.findOne({_id:req?.userInfo?._id}).lean()
    res.json({...user})


}


const getPrivateData=async(req:IRequest,res:Response)=>{

    const user=await User.findOne({_id:req?.userInfo?._id}).lean()
    res.json({...user})


}


const setGeneralSettings=async(req:IRequest,res:Response)=>{

    const {username,brief}=req.body
    console.log(username,brief)

    console.log(req?.userInfo)
    const user=await User.findOne({_id:req?.userInfo?._id}) as  IUser

    console.log(user)

    user.username=username
    if(brief){
        user.brief=brief
    }

    await user.save()

    return res.json({msg:"succful"})



}

const changePhoto=async(req:IRequest,res:Response)=>{

    console.log("mustafa enid")
    if(!req?.files){
        return res.status(401).json({msg:"لا يوجد صورة في الطلب"})
    }
    let photo;



    photo=req.files as any
    photo=photo.photo


    console.log(photo)

    const filename = photo?.name;

    console.log(filename.split(".").length)
    let lengthl=filename.split(".").length-1
    let uniqeName:string =`${shortid.generate()}.${filename.split(".")[lengthl]}`

    console.log(uniqeName)
    
    photo.mv(__dirname +"/../"+"/public/profile/"+uniqeName)

    const user=await User.findOne({_id:req?.userInfo?._id}) as  IUser

    user.img=uniqeName
    await user.save()

    return res.json({img:uniqeName})

}




export default {login,registration,refresh,forgetPassword,sendForgetPaswword,restPassword,logout,changePassword,setPrivacy,getPrivateData,setGeneralSettings,changePhoto}