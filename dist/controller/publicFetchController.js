"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNews = exports.fetchGitRepoByUser = exports.fetchGitRepo = void 0;
const axios_1 = __importDefault(require("axios"));
const redisClient_js_1 = __importStar(require("../lib/redisClient.js"));
const fetchGitRepo = async (req, res) => {
    const repo = await axios_1.default.get(`https://api.github.com/users`);
    return res.json({
        message: 'Fetched successfully',
        data: repo.data
    });
};
exports.fetchGitRepo = fetchGitRepo;
const fetchGitRepoByUser = async (req, res) => {
    const { userName } = req.params;
    const key = userName.toLowerCase();
    const data = (0, redisClient_js_1.isRedisConnected)() ? await redisClient_js_1.default.get(key) : null;
    if (data) {
        return res.json({
            message: 'Fetched Repositories from user successfully-catche',
            data: JSON.parse(data)
        });
    }
    const repo = await axios_1.default.get(`https://api.github.com/users/${userName}/repos`);
    if (repo.status === 200 && repo.data.length > 0) {
        const data = repo.data;
        const listData = data.map((item) => ({
            id: item.id,
            name: item.name,
            html_url: item.html_url,
            full_name: item.full_name,
            description: item.description,
            img: item.owner.avatar_url
        }));
        if ((0, redisClient_js_1.isRedisConnected)()) {
            await redisClient_js_1.default.set(key, JSON.stringify(listData));
        }
        return res.json({
            message: 'Fetched Repositories from user successfully',
            data: listData
        });
    }
    else {
        return res.json({
            message: 'No Repositories found for this user',
            data: []
        });
    }
};
exports.fetchGitRepoByUser = fetchGitRepoByUser;
const fetchNews = async (req, res) => {
    const newsData = await axios_1.default.get('http://api.mediastack.com/v1/news?access_key=8dac207b11663c2a0324f55f5038fdad');
    return res.json({
        message: 'News fetched successfully',
        data: newsData.data
    });
};
exports.fetchNews = fetchNews;
const publicFetchController = { fetchNews: exports.fetchNews, fetchGitRepo: exports.fetchGitRepo, fetchGitRepoByUser: exports.fetchGitRepoByUser };
exports.default = publicFetchController;
