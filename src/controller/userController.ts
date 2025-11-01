import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import userRegistration from '../model/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const saltRounds: number = 10;
const jwtKey: string | any = process.env.JWT_CONFIG_KEY;

interface UserPayload {
    userName: string;
    userMail: string;
    contact: string;
    password: string;
}

interface jwtPayload {
    userId: string;
    userName: string;
    is_admin: boolean;
}

interface loginPayload { 
    userMail: string;
    password: string;
}

export const addUserData = async (req: Request, res: Response) => {
    try {
        const { userMail, password, userName, contact } = req.body;

          if (!userMail || !password || !userName || !contact) {
            return res.status(400).json({ success: false, status: 400, msg: 'Missing required fields' });
        }

        const user: any = await userRegistration.findOne({ userMail }).lean();

        if (user) {
            return res.status(400).json({
                success: false,
                status: 400,
                msg: 'User with this email already exists',
            });
        }
        const hash: string = await bcrypt.hash(password, saltRounds);
        const data: UserPayload = {
            userName: userName,
            userMail: userMail,
            contact: contact,
            password: hash,
        };

        const resData: any = await userRegistration.create(data);

        return res.json({
            success: true,
            status: 200,
            msg: 'User registered successfully',
            data: resData,
        });
    } catch (e: any) {
        return res.status(400).json({
            success: false,
            status: 400,
            msg: e?.message || e,
        });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.user;
        const user: any = await userRegistration.findById(userId).lean();
        if (user) {
            delete user.password; 
            return res.json({
                success: true,
                status: 200,
                data: user,
                message: 'User profile fetched successfully',
            });
        } else {
            return res.status(404).json({
                success: false,
                status: 404,
                msg: 'User not found',
            });
        }
    } catch (e: any) {
        console.error('Fetch error:', e);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { userMail, password }: loginPayload = req.body;
        if (!userMail || !password) {
            return res.status(400).json({ success: false, status: 400, msg: 'Missing credentials' });
        }

        const user: any = await userRegistration.findOne({ userMail }).lean();
        if (!user) {
            return res.status(400).json({ success: false, status: 400, msg: 'Invalid Username' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, status: 400, msg: 'Invalid Password' });
        }

        const payload: jwtPayload = {
            userId: user._id,
            userName: user.userName,
            is_admin: false,
        };

        const token = jwt.sign(payload, jwtKey, { expiresIn: '7d' });

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
    } catch (e: any) {
        console.error('Login error:', e);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal server error' });
    }
};

const userController = { addUserData, login, getProfile };

export default userController;