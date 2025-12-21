import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// import route
import route from "./routes/route";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, 
}));
app.use(express.json());

const port = process.env.PORT;

app.use("/api", route);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
