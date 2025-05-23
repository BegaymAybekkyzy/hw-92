import expressRouter from "express";
import {Error} from "mongoose";
import User from "../models/User";

const userRouter = expressRouter();

userRouter.post("/", async (req, res, next) => {
    try {
        const existingUser = await User.findOne({username: req.body.username});

        if (existingUser) {
            res.status(400).send({error: `The user '${req.body.username}' already exists`});
            return;
        }

        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
        });

        newUser.generateToken();
        await newUser.save();

        res.cookie('token', newUser.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        const user = {
            _id: newUser._id,
            username: newUser.username,
        };

        res.send({message: 'User registered successfully.', user});

    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

userRouter.post('/sessions', async (req, res, _next) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({error: 'Fill in the username and password fields'});
        return;
    }

    const user = await User.findOne({username: req.body.username});

    if (!user) {
        res.status(404).send({error: "User not found"});
        return;
    }

    const isMath = await user.comparePassword(req.body.password);

    if (!isMath) {
        res.status(400).send({error: 'Password is incorrect'});
        return;
    }

    user.generateToken();
    await user.save();

    res.cookie('token', user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    const safeUser = {
        _id: user._id,
        username: user.username,
    };

    res.send({message: 'Username and password is correct', user: safeUser});
});

userRouter.delete('/sessions', async (req, res, next) => {
    try {
        const token = req.cookies.token;

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        const user = await User.findOne({token});

        if (user) {
            user.generateToken();
            await user.save();
        }

        res.send({message: 'Logout successful'});
    } catch (e) {
        next(e);
    }
});

export default userRouter;