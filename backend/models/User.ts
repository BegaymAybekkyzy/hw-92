import mongoose, {HydratedDocument, Model} from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {IUser} from "../types";

interface userMethods {
    comparePassword: (password: string) => Promise<boolean>;
    generateToken: () => void;
}

type userModel = Model<IUser, {}, userMethods>;

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
};

export const generateTokenJWT = (user: HydratedDocument<IUser>) => {
    return jwt.sign({_id: user._id}, JWT_SECRET, { expiresIn: "30d" })
}

export const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret";

const UserSchema = new mongoose.Schema<
    HydratedDocument<IUser>,
    userModel,
    userMethods,
    {}
>({
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
    },
    status: {
        required: true,
        type: Boolean,
        default: false,
    },
    token: {
        required: true,
        type: String,
    }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
});

UserSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        delete returnedObject.password;
        return returnedObject;
    }
});

UserSchema.methods.comparePassword = async function (password: string) {
    return await argon2.verify(this.password, password);
};

UserSchema.methods.generateToken = function () {
    this.token = generateTokenJWT(this);
}

const User = mongoose.model("User", UserSchema);
export default User;