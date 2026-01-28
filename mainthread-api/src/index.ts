import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// import route

dotenv.config();

import route from "./routes/route";

const app = express();

const allowedOrigins = [process.env.CLIENT_URL!];

app.options('*', cors(
    {
    origin: allowedOrigins, // if need to send cookies, enable these lines
    // credentials: true,
    }
));
app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));


app.use(express.json());

const port = process.env.PORT;

app.use("/api", route);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
