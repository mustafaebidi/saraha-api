

import { check } from 'express-validator';
const ObjectId = require('mongoose').Types.ObjectId;


import validatorMiddleware from "../middleware/validatorMiddleware";
import mongoose from "mongoose";

const createMassage=[
    check('body')
        .notEmpty()
        .withMessage('الرسالة فارغة'),


    check('id')
        .notEmpty()
        .withMessage('رقم الحساب مطلوب')
        .custom((val:string) =>{
            const isValid= mongoose.isValidObjectId(val);
            if(!isValid){
                return Promise.reject(new Error('رقم الحساب غير صالح'));
            }
            return true
        })
        .withMessage('رقم الحساب غير صالح'),


    validatorMiddleware,

]

const deleteMassage=[

    check('id')
        .notEmpty()
        .withMessage('id required')
        .custom((val:string) =>{
            const isValid= mongoose.isValidObjectId(val);
            if(!isValid){
                return Promise.reject(new Error('id not valid'));
            }
            return true
        })
        .withMessage('الرباط غير صالح'),


    validatorMiddleware,

]

const addReply=[
    check('id')
        .notEmpty()
        .withMessage('id required')
        .custom((val:string) =>{
            const isValid= ObjectId.isValid(val);
            if(!isValid){
                return Promise.reject(new Error('id not valid'));
            }
            return true
        }),


    check('reply')
        .notEmpty()
        .withMessage('يجب ان لا يكون الرد فارغ'),


        validatorMiddleware,
]


const checkExsitUser=[
    check('id')
        .custom((val:string) =>{
            const isValid= ObjectId.isValid(val);

            if(!isValid){

                return Promise.reject(new Error('id not valid'));
            }
            return true
        }),
    
    validatorMiddleware,

]



const getOpinionsAllowed=[
    check('id')
        .custom((val:string) =>{
            const isValid= ObjectId.isValid(val)
            if(!isValid){
                return Promise.reject(new Error('id not valid'));
            }
            return true
        }),

    validatorMiddleware,

]


const setStatus=[
    check('id')
        .custom((val:string) =>{
            const isValid= ObjectId.isValid(val)
            if(!isValid){
                return false
            }
            return true
        })
        .withMessage('الرابط غير صالح'),


    validatorMiddleware,

]


const toggleFavoure=[
    check('id')
        .custom((val:string) =>{
            const isValid= ObjectId.isValid(val)
            if(!isValid){
                return false
            }
            return true
        })
        .withMessage('الرابط غير صالح'),



    check('status').isBoolean().withMessage('يجب ان يكون ان true أو false'),



    validatorMiddleware,

]









export default {addReply,createMassage,checkExsitUser,getOpinionsAllowed,deleteMassage,setStatus,toggleFavoure}