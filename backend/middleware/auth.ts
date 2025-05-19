import {HydratedDocument} from "mongoose";
import {IUser} from "../types";
import {NextFunction, Request, Response} from "express";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import User, {JWT_SECRET} from "../models/User";

export interface IAuth extends Request {
    user: HydratedDocument<IUser>;
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
    try {
        const req = expressReq as IAuth;
        const jwtoken = req.get("Authorization")?.replace("Bearer ", "");

        if (!jwtoken) {
            res.status(401).json({message: "Unauthorized"});
            return
        }
        const decoded = jwt.verify(jwtoken, JWT_SECRET) as {_id: string};
        const user = await User.findOne({_id: decoded._id, token: jwtoken});

        if (!user) {
            res.status(401).json({message: "Unauthorized"});
            return
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).send({ error: "Token expired" });
        } else {
            res.status(401).send({ error: "Please login to authenticate" });
        }
    }
};

export default auth;