"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Ngambil token dari header Authorization
    if (!token)
        return res.status(401).json({ message: "Unauthorized" }); // kalau token tidak ditemukan
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // ngecek tokennya benar atau tidak
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Invalid Token" }); // kalau gapunya token, maka "Invalid Token"
    }
};
exports.authenticate = authenticate;
