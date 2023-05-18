"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const ObjectId = require('mongoose').Types.ObjectId;
const validatorMiddleware_1 = __importDefault(require("../middleware/validatorMiddleware"));
const mongoose_1 = __importDefault(require("mongoose"));
const createMassage = [
    (0, express_validator_1.check)('body')
        .notEmpty()
        .withMessage('الرسالة فارغة'),
    (0, express_validator_1.check)('id')
        .notEmpty()
        .withMessage('رقم الحساب مطلوب')
        .custom((val) => {
        const isValid = mongoose_1.default.isValidObjectId(val);
        if (!isValid) {
            return Promise.reject(new Error('رقم الحساب غير صالح'));
        }
        return true;
    })
        .withMessage('رقم الحساب غير صالح'),
    validatorMiddleware_1.default,
];
const deleteMassage = [
    (0, express_validator_1.check)('id')
        .notEmpty()
        .withMessage('id required')
        .custom((val) => {
        const isValid = mongoose_1.default.isValidObjectId(val);
        if (!isValid) {
            return Promise.reject(new Error('id not valid'));
        }
        return true;
    })
        .withMessage('الرباط غير صالح'),
    validatorMiddleware_1.default,
];
const addReply = [
    (0, express_validator_1.check)('id')
        .notEmpty()
        .withMessage('id required')
        .custom((val) => {
        const isValid = ObjectId.isValid(val);
        if (!isValid) {
            return Promise.reject(new Error('id not valid'));
        }
        return true;
    }),
    (0, express_validator_1.check)('reply')
        .notEmpty()
        .withMessage('يجب ان لا يكون الرد فارغ'),
    validatorMiddleware_1.default,
];
const checkExsitUser = [
    (0, express_validator_1.check)('id')
        .custom((val) => {
        const isValid = ObjectId.isValid(val);
        if (!isValid) {
            return Promise.reject(new Error('id not valid'));
        }
        return true;
    }),
    validatorMiddleware_1.default,
];
const getOpinionsAllowed = [
    (0, express_validator_1.check)('id')
        .custom((val) => {
        const isValid = ObjectId.isValid(val);
        if (!isValid) {
            return Promise.reject(new Error('id not valid'));
        }
        return true;
    }),
    validatorMiddleware_1.default,
];
const setStatus = [
    (0, express_validator_1.check)('id')
        .custom((val) => {
        const isValid = ObjectId.isValid(val);
        if (!isValid) {
            return false;
        }
        return true;
    })
        .withMessage('الرابط غير صالح'),
    validatorMiddleware_1.default,
];
const toggleFavoure = [
    (0, express_validator_1.check)('id')
        .custom((val) => {
        const isValid = ObjectId.isValid(val);
        if (!isValid) {
            return false;
        }
        return true;
    })
        .withMessage('الرابط غير صالح'),
    (0, express_validator_1.check)('status').isBoolean().withMessage('يجب ان يكون ان true أو false'),
    validatorMiddleware_1.default,
];
exports.default = { addReply, createMassage, checkExsitUser, getOpinionsAllowed, deleteMassage, setStatus, toggleFavoure };
