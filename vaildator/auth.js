"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { check, body } = require('express-validator');
const User_1 = __importDefault(require("../model/User"));
const validatorMiddleware_1 = __importDefault(require("../middleware/validatorMiddleware"));
const ObjectId = require('mongoose').Types.ObjectId;
const login = [
    check('email')
        .notEmpty()
        .withMessage('البريد الالكتروني مطلوب'),
    check('password')
        .notEmpty()
        .withMessage("كلمه السر مطلوبة")
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    validatorMiddleware_1.default,
];
const registration = [
    check('username')
        .notEmpty()
        .withMessage('الاسم مطلوب'),
    check('email')
        .notEmpty()
        .withMessage('البريد الالكتروني مطلوب')
        .isEmail()
        .withMessage('غنوان البريد الالكتروني غير صالح')
        .custom((val) => User_1.default.findOne({ email: val }).then((user) => {
        if (user) {
            return Promise.reject(new Error('هذا البريد الالكتروني موجود مسبقا'));
        }
    })),
    check('password')
        .notEmpty()
        .withMessage('الرقم السري مطلوب')
        .isLength({ min: 6 })
        .withMessage('يجب ان تكون كلمة السر مكونة من 6 ارقام او احرف علي الاقل'),
    validatorMiddleware_1.default,
];
const setPrivacy = [
    check('privacy')
        .notEmpty()
        .withMessage('privacy required')
        .isObject(),
    validatorMiddleware_1.default,
];
const setGeneralSettings = [
    check('username')
        .notEmpty()
        .withMessage('اسم المستخدم مطلوب')
        .isLength({ min: 3 }),
    check('brief')
        .optional({ checkFalsy: true })
        .isLength({ min: 3 })
        .withMessage('يجب ان تكون الحالة مكونه من 3 احرف علي الاقل'),
    validatorMiddleware_1.default,
];
const restPassword = [
    check('id')
        .notEmpty()
        .custom((val) => {
        const isValid = ObjectId.isValid(val);
        if (!isValid) {
            return Promise.reject(new Error('Link not valid'));
        }
        return true;
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
    validatorMiddleware_1.default,
];
const sendForgetPassword = [
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address'),
    validatorMiddleware_1.default,
];
const ChangePassword = [
    check('password')
        .notEmpty()
        .withMessage('password required')
        .isLength({ min: 6 })
        .withMessage('يجب ان يكون الرقم السري مكون من 6 ارقام علي الافل'),
    validatorMiddleware_1.default,
];
exports.default = { registration, login, setPrivacy, setGeneralSettings, restPassword, sendForgetPassword, ChangePassword };
