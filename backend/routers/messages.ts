import { Router } from "express";
import { WebSocket } from "ws";
import Message from "../models/Message";
import { IIncomingMessage } from "../types";
import jwt from "jsonwebtoken";
import User, { JWT_SECRET } from "../models/User";

const messageRouter = Router();
const connectedClients: WebSocket[] = [];

export const registerMessageWs = () => {
    messageRouter.ws('/', async (ws, req) => {
        try {
            const jwtoken = req.headers.cookie;

            if (!jwtoken) {
                ws.send(JSON.stringify({ error: "Unauthorized" }));
                ws.close();
                return;
            }

            const token = jwtoken
                .split(";")
                .find(cookie => cookie.trim().startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                ws.send(JSON.stringify({ error: "Unauthorized" }));
                ws.close();
                return;
            }

            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
            const user = await User.findOne({_id: decoded.id, token });

            if (!user) {
                ws.send(JSON.stringify({ error: "Unauthorized" }));
                ws.close();
                return;
            }

            user.status = true
            await user.save();
            console.log('Client connected');

            connectedClients.push(ws);

            const allMessages = await Message.find()
                .sort({datetime: -1})
                .limit(30)
                .populate({
                    path: 'user',
                    select: 'username'
                });

            if (allMessages.length > 0) {
                ws.send(JSON.stringify({
                    type: "NEW_MESSAGE",
                    payload: allMessages
                }));
            }

            ws.on("message", async (message) => {
                try {
                    const decodedMessage = JSON.parse(message.toString()) as IIncomingMessage;

                    if (decodedMessage.type === "SEND_MESSAGE") {
                        const newMessage = new Message({
                            user: user._id,
                            text: decodedMessage.payload,
                            datetime: new Date(),
                        });

                        await newMessage.save();

                        const response = {
                            type: "NEW_MESSAGE",
                            payload: [newMessage],
                        };

                        connectedClients.forEach(client => {
                            if (client.readyState === client.OPEN) {
                                client.send(JSON.stringify(response));
                            }
                        });
                    }
                } catch (e) {
                    ws.send(JSON.stringify({ error: "Invalid message" }));
                }
            });

            ws.on("close", async () => {
                const index = connectedClients.indexOf(ws);
                if (index !== -1) connectedClients.splice(index, 1);
                console.log(`User ${user.username} disconnected`);
                user.status = false;
                await user.save();
            });

        } catch (err) {
            ws.send(JSON.stringify({ error: "Authentication error" }));
            ws.close();
        }
    });
};

export { messageRouter };
