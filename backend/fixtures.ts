import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Message from "./models/Message";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection("users");
        await db.dropCollection("messages");
    } catch (error) {
        console.log("Collections were not present, skipping drop");
    }

    const bob = new User({
        username: "Bob",
        password: "111",
    });
    bob.generateToken();
    await bob.save();

    const alice = new User({
        username: "Alice",
        password: "111",
    });
    alice.generateToken();
    await alice.save();

    const baseDate = new Date("2025-05-19T18:00:00.000Z");
    const messages = [];

    for (let i = 1; i <= 32; i++) {
        messages.push({
            user: i % 2 === 0 ? bob._id : alice._id,
            text: `Hello World![${i}]`,
            datetime: new Date(baseDate.getTime() + i * 60000),
        });
    }

    await Message.create(...messages);
    await db.close();
}

run().catch(console.error);
