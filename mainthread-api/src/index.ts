import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// import route

dotenv.config();

import route from "./routes/route";

const app = express();

const allowedOrigins = [process.env.CLIENT_URL!];

app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, 
}));

app.options('*', cors());

app.use(express.json());

const port = process.env.PORT;

app.use("/api", route);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
