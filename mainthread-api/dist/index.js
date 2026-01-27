"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// import route
dotenv_1.default.config();
const route_1 = __importDefault(require("./routes/route"));
const app = (0, express_1.default)();
const allowedOrigins = [process.env.CLIENT_URL];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
}));
app.use(express_1.default.json());
const port = process.env.PORT;
app.use("/api", route_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
