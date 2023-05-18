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
const massage_1 = __importDefault(require("../model/massage"));
const User_1 = __importDefault(require("../model/User"));
const getAllMassages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { page } = req.params;
    let limit = 10;
    console.log(page);
    let newPage = Number(page);
    console.log(newPage);
    const skip = ((newPage - 1) * limit);
    const lenOfReslts = yield massage_1.default.find().countDocuments();
    const massages = yield massage_1.default.find({ to: (_a = req === null || req === void 0 ? void 0 : req.userInfo) === null || _a === void 0 ? void 0 : _a._id }).skip(skip).limit(limit).lean();
    const hasNextPage = lenOfReslts > ((newPage) * limit) ? true : false;
    const nextPage = hasNextPage ? page + 1 : null;
    if (massages.length > 0)
        return res.json({ msg: massages, count: lenOfReslts, hasNextPage, nextPage });
    return res.json({ msg: [], count: 0 });
});
const getAllMassage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    let { skip } = req.params;
    let limit = 10;
    const { sort } = req.query;
    let massages;
    let d = parseInt(skip);
    console.log((sort === "1") ? "Sdsadasdasdasdadada" : "red rea asd ad sad asd ad as asd asd as");
    let r = yield massage_1.default.find({ to: (_b = req === null || req === void 0 ? void 0 : req.userInfo) === null || _b === void 0 ? void 0 : _b._id }).sort({ createdAt: "desc" });
    console.log(r);
    const lenOfReslts = yield massage_1.default.find({ to: (_c = req === null || req === void 0 ? void 0 : req.userInfo) === null || _c === void 0 ? void 0 : _c._id }).countDocuments();
    massages = (sort === "1") ? yield massage_1.default.find({ to: (_d = req === null || req === void 0 ? void 0 : req.userInfo) === null || _d === void 0 ? void 0 : _d._id }).sort({ createdAt: "asc" }).skip(d).limit(limit).lean() : yield massage_1.default.find({ to: (_e = req === null || req === void 0 ? void 0 : req.userInfo) === null || _e === void 0 ? void 0 : _e._id }).sort({ createdAt: "desc" }).skip(d).limit(limit).lean();
    const hasNextPage = lenOfReslts > d + limit ? true : false;
    if (massages.length > 0)
        return res.json({ msg: massages, count: lenOfReslts, hasNextPage });
    return res.json({ msg: [], count: 0 });
});
const createMassage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { body } = req.body;
    const { id } = req.params;
    const user = yield User_1.default.findOne({ _id: id });
    if (!user)
        res.status(401).json({ msg: "no user found" });
    const massage = new massage_1.default({
        to: id,
        body
    });
    yield massage.save();
    return res.json({ msg: "sussful" });
});
const toggleFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const { id } = req.params;
    const { status } = req.body;
    const massage = yield massage_1.default.findOne({ _id: id });
    if (!massage)
        return res.json({ msg: "not found" });
    if (((_f = req === null || req === void 0 ? void 0 : req.userInfo) === null || _f === void 0 ? void 0 : _f._id.toString()) === massage.to.toString()) {
        massage.favorite = status;
        yield massage.save();
        const massagea = yield massage_1.default.findOne({ _id: id }).lean();
        return res.send({ msg: massagea });
    }
});
const addReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { reply } = req.body;
    const { id } = req.params;
    const massage = yield massage_1.default.findOne({ _id: id });
    if (!massage)
        return res.json({ msg: "Not Found" });
    if (((_g = req === null || req === void 0 ? void 0 : req.userInfo) === null || _g === void 0 ? void 0 : _g._id.toString()) === massage.to.toString()) {
        massage.reply = reply;
        yield massage.save();
        const massagea = yield massage_1.default.findOne({ _id: id }).lean();
        return res.send({ msg: massagea });
    }
    return res.status(401).json({ msg: "Not Allowed" });
});
const deleteMassage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const { id } = req.params;
    const massage = yield massage_1.default.findOne({ _id: id });
    if (((_h = req === null || req === void 0 ? void 0 : req.userInfo) === null || _h === void 0 ? void 0 : _h._id.toString()) === (massage === null || massage === void 0 ? void 0 : massage.to.toString())) {
        ///const massage = await Massage.deleteOne({ _id:id }) 
        massage === null || massage === void 0 ? void 0 : massage.delete();
        return res.json({ msg: "Sussfuly" });
    }
    return res.status(401).json({ msg: "Not Allowed" });
});
const checkExsitUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, fistTime } = req.params;
    const user = yield User_1.default.findOne({ _id: id });
    if (!user)
        return res.status(401).json({ msg: "not found" });
    res.json({ msg: { username: user.username, brief: user.brief, img: user.img, privacy: user.privacy, visits: user.visits, isOnline: user.isOnline, lastSeen: user.lastSeen } });
    user.visits = user.visits + 1;
    yield user.save();
    return;
});
const setStatusOfMassage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const { id } = req.params;
    const massage = yield massage_1.default.findOne({ _id: id });
    if (!massage)
        return res.status(401).json({ msg: "not found" });
    if (((_j = req === null || req === void 0 ? void 0 : req.userInfo) === null || _j === void 0 ? void 0 : _j._id.toString()) === massage.to.toString()) {
        massage.display = !massage.display;
        yield massage.save();
        const massagea = yield massage_1.default.findOne({ _id: id }).lean();
        return res.send({ msg: massagea });
    }
    return res.status(401).json({ msg: "Not Allowed" });
});
const getOpinionsAllowed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const massage = yield massage_1.default.find({ to: id, display: true });
    console.log(massage);
    if (massage.length > 0)
        return res.json({ msg: massage });
    return res.json({ msg: [] });
});
const getLengthOfmassages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const count = yield massage_1.default.find({ to: (_k = req === null || req === void 0 ? void 0 : req.userInfo) === null || _k === void 0 ? void 0 : _k._id }).countDocuments();
    return res.json({ count });
});
exports.default = { getOpinionsAllowed, deleteMassage, addReply, toggleFavorite, createMassage, checkExsitUser, getAllMassage, setStatusOfMassage, getLengthOfmassages };
