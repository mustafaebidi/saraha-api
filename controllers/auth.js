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
const User_1 = __importDefault(require("../model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const shortid = require('shortid');
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user = yield User_1.default.findOne({ email });
    ///If the WRITE USERNAME instead OF EMAIL
    if (!user)
        user = yield User_1.default.findOne({ username: email });
    if (!user)
        return res.status(401).json({ msg: 'يوجد خطا في كلمة السر او البريد الالكتروني' });
    const match = yield bcrypt_1.default.compare(password, user.password);
    const { _id, username } = user;
    if (!match)
        return res.status(401).json({ msg: 'يوجد خطا في كلمة السر او البريد الالكتروني' });
    const accessToken = jsonwebtoken_1.default.sign({
        "userInfo": {
            "id": _id,
            "roles": user.roles
        }
    }, "sasa", { expiresIn: '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ "id": _id }, "sasa", { expiresIn: '16h' });
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    });
    user.isOnline = true;
    user.lastSeen = new Date();
    yield user.save();
    let userInfo = Object.assign({}, user === null || user === void 0 ? void 0 : user._doc);
    return res.json(Object.assign({ token: accessToken }, userInfo));
});
const registration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    let uniqueName = "";
    const exsit = yield User_1.default.findOne({ email });
    if (exsit)
        return res.status(401).json({ msg: "هذا البريد الالكتروني مستخدم من قبل" });
    if (req === null || req === void 0 ? void 0 : req.files) {
        let photoInfo = req.files;
        let avatar = photoInfo.avatar;
        console.log(req.files);
        const filename = avatar === null || avatar === void 0 ? void 0 : avatar.name;
        let lengthl = filename.split(".").length - 1;
        uniqueName = `${shortid.generate()}.${filename.split(".")[lengthl]}`;
        avatar.mv(__dirname + "/../" + "/public/profile/" + uniqueName);
    }
    const hasedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield User_1.default.create({
        username,
        email,
        password: hasedPassword,
        img: uniqueName
    });
    res.status(201).json({ msg: "Successfully Registered" });
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        return res.sendStatus(204); //No content
    let user = yield User_1.default.findOne({ _id: (_a = req === null || req === void 0 ? void 0 : req.userInfo) === null || _a === void 0 ? void 0 : _a._id });
    console.log("8888888888888888888888888888888888888888888888888888888");
    console.log(req === null || req === void 0 ? void 0 : req.userInfo);
    if (user) {
        user.isOnline = false;
        user.lastSeen = new Date();
        yield user.save();
    }
    console.log("8888888888888888888888888888888888888888888888888888888");
    console.log(user);
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    });
    res.json({ message: 'Cookie cleared' });
});
const refresh = (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        console.log(805);
        return res.status(401).json({ message: 'ahmed' });
    }
    const refreshToken = cookies.jwt;
    jsonwebtoken_1.default.verify(refreshToken, "sasa", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(403).json({ message: 'Forbidden' });
        const foundUser = yield User_1.default.findOne({ _id: decoded.id }).select("-password");
        if (!foundUser)
            return res.status(401).json({ message: 'Unauthorized' });
        const accessToken = jsonwebtoken_1.default.sign({
            "userInfo": {
                "id": foundUser._id,
                "roles": foundUser.roles
            }
        }, "sasa", { expiresIn: '15m' });
        foundUser.isOnline = true;
        foundUser.lastSeen = new Date();
        foundUser.save();
        return res.json(Object.assign({ token: accessToken }, foundUser._doc));
    }));
};
const sendForgetPaswword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const foundUser = yield User_1.default.findOne({ email });
    console.log(foundUser);
    if (!foundUser)
        return res.status(401).json({ err: "لا يوجد اميل بهذا العنوان" });
    const seccret = foundUser.password + "sasa";
    const accses = yield jsonwebtoken_1.default.sign({
        email
    }, seccret, { expiresIn: '15m' });
    foundUser.forgetPasswordToken = accses;
    yield foundUser.save();
    console.log(`http://localhost:3000/forgetPassword/${foundUser._id}/${accses}`);
    return res.json({ link: `http://localhost:3850/auth/forgetPaswword/${foundUser._id}/${accses}` });
});
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    let user = yield User_1.default.findOne({ _id: id, forgetPasswordToken: token });
    const secret = (user === null || user === void 0 ? void 0 : user.password) + "sasa";
    try {
        const verify = yield jsonwebtoken_1.default.verify(token, secret);
        return res.json({ msg: "succsfull" });
    }
    catch (_b) {
        return res.sendStatus(403);
    }
});
const restPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.params;
    const { password } = req.body;
    console.log(password);
    console.log(id, token);
    let user = yield User_1.default.findOne({ _id: id, forgetPasswordToken: token });
    if (!user) {
        return res.status(403).json({ "msg": "User Not Exists!" });
    }
    const secret = (user === null || user === void 0 ? void 0 : user.password) + "sasa";
    try {
        const verify = yield jsonwebtoken_1.default.verify(token, secret);
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        user.password = encryptedPassword;
        user.forgetPasswordToken = "";
        yield user.save();
        res.json({ msg: "Successfully" });
    }
    catch (_c) {
        return res.sendStatus(403);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(44);
    const { password } = req.body;
    const user = req.userInfo;
    console.log(user);
    const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
    user.password = encryptedPassword;
    yield user.save();
    return res.json({ "msg": "successfully" });
});
const setPrivacy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const { privacy } = req.body;
    yield User_1.default.findOneAndUpdate({ _id: (_d = req === null || req === void 0 ? void 0 : req.userInfo) === null || _d === void 0 ? void 0 : _d._id }, { privacy: privacy });
    const user = yield User_1.default.findOne({ _id: (_e = req === null || req === void 0 ? void 0 : req.userInfo) === null || _e === void 0 ? void 0 : _e._id }).lean();
    res.json(Object.assign({}, user));
});
const getPrivateData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const user = yield User_1.default.findOne({ _id: (_f = req === null || req === void 0 ? void 0 : req.userInfo) === null || _f === void 0 ? void 0 : _f._id }).lean();
    res.json(Object.assign({}, user));
});
const setGeneralSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { username, brief } = req.body;
    console.log(username, brief);
    console.log(req === null || req === void 0 ? void 0 : req.userInfo);
    const user = yield User_1.default.findOne({ _id: (_g = req === null || req === void 0 ? void 0 : req.userInfo) === null || _g === void 0 ? void 0 : _g._id });
    console.log(user);
    user.username = username;
    if (brief) {
        user.brief = brief;
    }
    yield user.save();
    return res.json({ msg: "succful" });
});
const changePhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    console.log("mustafa enid");
    if (!(req === null || req === void 0 ? void 0 : req.files)) {
        return res.status(401).json({ msg: "لا يوجد صورة في الطلب" });
    }
    let photo;
    photo = req.files;
    photo = photo.photo;
    console.log(photo);
    const filename = photo === null || photo === void 0 ? void 0 : photo.name;
    console.log(filename.split(".").length);
    let lengthl = filename.split(".").length - 1;
    let uniqeName = `${shortid.generate()}.${filename.split(".")[lengthl]}`;
    console.log(uniqeName);
    photo.mv(__dirname + "/../" + "/public/profile/" + uniqeName);
    const user = yield User_1.default.findOne({ _id: (_h = req === null || req === void 0 ? void 0 : req.userInfo) === null || _h === void 0 ? void 0 : _h._id });
    user.img = uniqeName;
    yield user.save();
    return res.json({ img: uniqeName });
});
exports.default = { login, registration, refresh, forgetPassword, sendForgetPaswword, restPassword, logout, changePassword, setPrivacy, getPrivateData, setGeneralSettings, changePhoto };
