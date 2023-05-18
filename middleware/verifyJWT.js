"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../model/User"));
const verifyJWT = (expressRequest, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const req = expressRequest;
    const authHeader = req.headers.authorization;
    console.log("#############################################");
    console.log(authHeader);
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, "sasa", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json({ message: 'Forbidden' });
        let user = yield User_1.default.findOne({ _id: decoded.userInfo.id }).select("-password");
        if (user) {
            req.userInfo = user;
            user.isOnline = true;
            user.lastSeen = new Date();
            yield user.save();
        }
        next();
    }));
});
exports.default = verifyJWT;
