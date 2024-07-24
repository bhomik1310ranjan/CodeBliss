import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { JSON_PAYLOAD_LIMIT } from "./constants";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: JSON_PAYLOAD_LIMIT }));
app.use(cookieParser());

import userRouter from "./routes/user.routes";
import projectRouter from "./routes/project.routes";
import { errorHandler } from "./middlewares/error.middleware";

app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);

app.use(errorHandler);

export default app;
