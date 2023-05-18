

const { check, body } = require('express-validator');

import User from "../model/User";

import validatorMiddleware from "../middleware/validatorMiddleware";
const ObjectId = require('mongoose').Types.ObjectId;


const login=[
    check('email')
        .notEmpty()
        .withMessage('البريد الالكتروني مطلوب'),


    check('password')
        .notEmpty()
        .withMessage("كلمه السر مطلوبة")
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    validatorMiddleware,

]

const registration=[
    check('username')
        .notEmpty()
        .withMessage('الاسم مطلوب'),


    check('email')
        .notEmpty()
        .withMessage('البريد الالكتروني مطلوب')
        .isEmail()
        .withMessage('غنوان البريد الالكتروني غير صالح')
        .custom((val:string) =>
            User.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error('هذا البريد الالكتروني موجود مسبقا'));
            }
            })
        ),

    check('password')
        .notEmpty()
        .withMessage('الرقم السري مطلوب')
        .isLength({ min: 6 })
        .withMessage('يجب ان تكون كلمة السر مكونة من 6 ارقام او احرف علي الاقل'),

    validatorMiddleware,

]


const setPrivacy=[
    check('privacy')
        .notEmpty()
        .withMessage('privacy required')
        .isObject(),



    validatorMiddleware,

]


const setGeneralSettings=[
    check('username')
        .notEmpty()
        .withMessage('اسم المستخدم مطلوب')
        .isLength({ min: 3}),



    check('brief')
            .optional({checkFalsy: true})
            .isLength({ min: 3})
            .withMessage('يجب ان تكون الحالة مكونه من 3 احرف علي الاقل'),



    validatorMiddleware,

]

const restPassword=[
    check('id')
        .notEmpty()
        .custom((val:string) =>{
            const isValid= ObjectId.isValid(val)
            if(!isValid){
                return Promise.reject(new Error('Link not valid'));
            }
            return true
        })
        .withMessage('Link Not Valid'),


    check('token')
            .notEmpty()
            .withMessage('Link Not Valid'),


    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),


    validatorMiddleware,

]


const sendForgetPassword=[
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address'),


    validatorMiddleware,

]

const ChangePassword=[
    check('password')
        .notEmpty()
        .withMessage('password required')
        .isLength({min: 6})
        .withMessage('يجب ان يكون الرقم السري مكون من 6 ارقام علي الافل'),


    validatorMiddleware,

]






export default {registration,login,setPrivacy,setGeneralSettings,restPassword,sendForgetPassword,ChangePassword}