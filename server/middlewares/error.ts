import { Request, Response, NextFunction } from "express";

import error_handler from "../utils/error_handler";

const error_middleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new error_handler(message, 400);
  }

  //Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new error_handler(message, 400);
  }

  //wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    err = new error_handler(message, 400);
  }

  //JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired`;
    err = new error_handler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};


export default error_middleware;