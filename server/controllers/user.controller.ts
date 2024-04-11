require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import error_handler from "../utils/error_handler";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";

//register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new error_handler("Email already exist", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationcode = activationToken.activationcode;

      const data = {user: {name:user.name}, activationcode};
      const html = await ejs.renderFile(path.join(__dirname,""));

    } catch (error: any) {
      return next(new error_handler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationcode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationcode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationcode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationcode };
};
