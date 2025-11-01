"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_js_1 = __importDefault(require("../controller/userController.js"));
const userRouter = express_1.default.Router();
userRouter.get('/addUser', userController_js_1.default.addUserData);
exports.default = userRouter;
