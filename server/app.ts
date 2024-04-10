require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";

export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { request } from "http";

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie-parser
app.use(cookieParser());

//cors => cross origin resouce sharing
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || []; // Split by comma and handle potential undefined value

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Api is working",
  });
});

//unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
