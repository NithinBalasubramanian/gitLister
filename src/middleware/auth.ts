import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const jwtKey = process.env.JWT_CONFIG_KEY || '8989sdnfndsifndfmksdnfjnkjdsnjf';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const Auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      msg: 'Token missing',
      status: 401,
      success: false,
    });
  }

  jwt.verify(token, jwtKey, (err, decoded) => {
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

export default Auth;