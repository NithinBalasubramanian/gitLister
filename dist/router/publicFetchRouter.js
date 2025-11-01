"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publicFetchController_1 = __importDefault(require("../controller/publicFetchController"));
const auth_1 = __importDefault(require("../middleware/auth"));
const publicFetchRouter = express_1.default.Router();
publicFetchRouter.get('/fetchGitRepo', auth_1.default, publicFetchController_1.default.fetchGitRepo);
publicFetchRouter.get('/fetchGitRepoByUser/:userName', auth_1.default, publicFetchController_1.default.fetchGitRepoByUser);
publicFetchRouter.get('/fetchNews', auth_1.default, publicFetchController_1.default.fetchNews);
exports.default = publicFetchRouter;
