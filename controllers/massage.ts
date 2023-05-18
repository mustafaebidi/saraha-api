import Massage from "../model/massage"

import {IMassage} from "../model/massage"

import {Response,Request, NextFunction} from 'express';
import User, { IUser } from "../model/User";

export interface IRequest extends  Request  {
    userInfo:IUser | null
}


const getAllMassages=async(req: IRequest,res: Response)=>{

    let {page} =req.params
    let limit=10
    console.log(page)

    let newPage=Number(page)
    console.log(newPage)


    const skip=((newPage-1)*limit)
    const lenOfReslts=await Massage.find().countDocuments()

    const massages = await Massage.find({to:req?.userInfo?._id}).skip(skip).limit(limit).lean()

    const hasNextPage=lenOfReslts > ((newPage)*limit) ? true :false
    const nextPage=hasNextPage ? page+1 : null

    
    

    if(massages.length > 0)
        return res.json({msg:massages,count:lenOfReslts,hasNextPage,nextPage})

    return res.json({msg:[],count:0})

}


const getAllMassage=async(req: IRequest,res: Response)=>{

    let {skip} =req.params
    let limit=10

    const {sort} = req.query;

    let massages;

    let d=parseInt(skip)

    console.log((sort === "1") ? "Sdsadasdasdasdadada" :"red rea asd ad sad asd ad as asd asd as")

    let r=await Massage.find({to:req?.userInfo?._id}).sort({ createdAt: "desc" })
    console.log(r)


    const lenOfReslts=await Massage.find({to:req?.userInfo?._id}).countDocuments()

    massages= (sort === "1") ? await Massage.find({to:req?.userInfo?._id}).sort({ createdAt: "asc" }).skip(d).limit(limit).lean() :  await Massage.find({to:req?.userInfo?._id}).sort({ createdAt: "desc" }).skip(d).limit(limit).lean()

    const hasNextPage=lenOfReslts > d+limit ? true : false

    

    if(massages.length > 0)
        return res.json({msg:massages,count:lenOfReslts,hasNextPage})

    return res.json({msg:[],count:0})

}

const createMassage=async(req: Request,res: Response)=>{
    console.log(req.body)

    const{body}=req.body as IMassage
    const{id}=req.params

    const user:IUser | null  = await User.findOne({ _id:id }) 

    if(!user)
        res.status(401).json({msg:"no user found"})

    const massage=new Massage({
        to:id,
        body    
    })
    await massage.save()
    return res.json({msg:"sussful"})


}

const toggleFavorite=async(req: IRequest,res: Response)=>{

    const{id}=req.params  
    const{status}=req.body
    const massage = await Massage.findOne({ _id:id }) as IMassage

    if(!massage)
        return res.json({msg:"not found"})

    if(req?.userInfo?._id.toString() === massage.to.toString() ){

        massage.favorite=status

        await massage.save()

        const massagea = await Massage.findOne({ _id:id }).lean()

        return res.send({msg:massagea})

    }


}

const addReply=async(req: IRequest,res: Response)=>{

    const{reply}=req.body 
    const{id}=req.params 

    const massage = await Massage.findOne({ _id:id }) as IMassage

    if(!massage)
        return res.json({msg:"Not Found"})

    if(req?.userInfo?._id.toString() === massage.to.toString() ){
        massage.reply=reply
        await massage.save()

        const massagea = await Massage.findOne({ _id:id }).lean()

        return res.send({msg:massagea})

    }

    return res.status(401).json({msg:"Not Allowed"})

}

const deleteMassage=async(req: IRequest,res: Response)=>{

    const{id}=req.params 
    const massage = await Massage.findOne({ _id:id }) 

    if(req?.userInfo?._id.toString() === massage?.to.toString()  ){
        ///const massage = await Massage.deleteOne({ _id:id }) 
        massage?.delete()
        return res.json({msg:"Sussfuly"})
    }

    return res.status(401).json({msg:"Not Allowed"})


}

const checkExsitUser=async(req: IRequest,res: Response)=>{
    const{id,fistTime}=req.params  

    const user = await User.findOne({ _id:id })

    
    if(!user)
        return res.status(401).json({msg:"not found"})



    res.json({msg:{username:user.username,brief:user.brief,img:user.img ,privacy:user.privacy, visits:user.visits,isOnline:user.isOnline,lastSeen:user.lastSeen}})
    user.visits=user.visits+1
    await user.save()
    return ;


    
}

const setStatusOfMassage=async(req: Request,res: Response)=>{

    const{id}=req.params  
    const massage = await Massage.findOne({ _id:id }) 

    if(!massage)
        return res.status(401).json({msg:"not found"})

    
    if(req?.userInfo?._id.toString() === massage.to.toString() ){

        massage.display=!massage.display
        await massage.save()
        const massagea = await Massage.findOne({ _id:id }).lean()
        return res.send({msg:massagea})


    }

    return res.status(401).json({msg:"Not Allowed"})




    
}

const getOpinionsAllowed=async(req: Request,res: Response)=>{

    const {id} =req.params
    const massage = await Massage.find({to:id,display:true}) 
    console.log(massage)
    if(massage.length > 0)
        return res.json({msg:massage})
    return res.json({msg:[]})



    
}

const getLengthOfmassages=async(req: Request,res: Response)=>{


    const count=await Massage.find({to:req?.userInfo?._id}).countDocuments()

    return res.json({count})



}






export default {getOpinionsAllowed,deleteMassage,addReply,toggleFavorite,createMassage,checkExsitUser,getAllMassage,setStatusOfMassage,getLengthOfmassages}


