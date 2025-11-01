"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.getProfile = exports.addUserData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../model/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltRounds = 10;
const jwtKey = process.env.JWT_CONFIG_KEY;
const addUserData = async (req, res) => {
    try {
        const { userMail, password, userName, contact } = req.body;
        if (!userMail || !password || !userName || !contact) {
            return res.status(400).json({ success: false, status: 400, msg: 'Missing required fields' });
        }
        const user = await user_1.default.findOne({ userMail }).lean();
        if (user) {
            return res.status(400).json({
                success: false,
                status: 400,
                msg: 'User with this email already exists',
            });
        }
        const hash = await bcrypt_1.default.hash(password, saltRounds);
        const data = {
            userName: userName,
            userMail: userMail,
            contact: contact,
            password: hash,
        };
        const resData = await user_1.default.create(data);
        return res.json({
            success: true,
            status: 200,
            msg: 'User registered successfully',
            data: resData,
        });
    }
    catch (e) {
        return res.status(400).json({
            success: false,
            status: 400,
            msg: e?.message || e,
        });
    }
};
exports.addUserData = addUserData;
const getProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await user_1.default.findById(userId).lean();
        if (user) {
            delete user.password;
            return res.json({
                success: true,
                status: 200,
                data: user,
                message: 'User profile fetched successfully',
            });
        }
        else {
            return res.status(404).json({
                success: false,
                status: 404,
                msg: 'User not found',
            });
        }
    }
    catch (e) {
        console.error('Fetch error:', e);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const login = async (req, res) => {
    try {
        const { userMail, password } = req.body;
        if (!userMail || !password) {
            return res.status(400).json({ success: false, status: 400, msg: 'Missing credentials' });
        }
        const user = await user_1.default.findOne({ userMail }).lean();
        if (!user) {
            return res.status(400).json({ success: false, status: 400, msg: 'Invalid Username' });
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, status: 400, msg: 'Invalid Password' });
        }
        const payload = {
            userId: user._id,
            userName: user.userName,
            is_admin: false,
        };
        const token = jsonwebtoken_1.default.sign(payload, jwtKey, { expiresIn: '7d' });
        return res.json({
            success: true,
            status: 200,
            data: {
                JWT: token,
                userName: user.userName,
                userMail: user.userMail,
            },
            msg: 'Logged in successfully',
        });
    }
    catch (e) {
        console.error('Login error:', e);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal server error' });
    }
};
exports.login = login;
const userController = { addUserData: exports.addUserData, login: exports.login, getProfile: exports.getProfile };
exports.default = userController;
