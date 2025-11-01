"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const publicFetchRouter_1 = __importDefault(require("./router/publicFetchRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.use('/api/user', userRouter_1.default);
app.use('/api/public', publicFetchRouter_1.default);
app.get('/healthCheck', (req, res) => {
    return res.json({
        msg: "server is running successfully"
    });
});
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};
const url = process.env.MONGO_URL;
mongoose_1.default.connect(url, options);
mongoose_1.default.connection.on("connected", function (ref) {
    console.log("connected to mongo server.");
});
app.listen(PORT, () => {
    console.log('Server started at ' + PORT);
});
