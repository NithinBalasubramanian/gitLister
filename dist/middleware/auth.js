"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtKey = process.env.JWT_CONFIG_KEY || '8989sdnfndsifndfmksdnfjnkjdsnjf';
const Auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            msg: 'Token missing',
            status: 401,
            success: false,
        });
    }
    jsonwebtoken_1.default.verify(token, jwtKey, (err, decoded) => {
        if (err) {
            console.error('JWT verify error:', err?.message || err);
            return res.status(401).json({
                msg: 'Invalid Token',
                error: err?.message || err,
                status: 401,
                success: false,
            });
        }
        req.user = decoded;
        next();
    });
};
exports.default = Auth;
