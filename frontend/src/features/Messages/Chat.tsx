import {useEffect, useRef, useState} from 'react';
import {BASE_URL} from "../../globalConstants.ts";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectUserOnline} from "../User/usersSlice.ts";
import {fetchUsersOnline} from "../User/userThunks.ts";
import type {IMessageApi} from "../../types";
import dayjs from "dayjs";

const Chat = () => {
    const ws = useRef<WebSocket | null>(null);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<IMessageApi[]>([]);

    const onlineUsers = useAppSelector(selectUserOnline);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchUsersOnline());

        ws.current = new WebSocket("ws://" + BASE_URL + "/messages");
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "NEW_MESSAGE") {
                setMessages((prev) => [...prev, ...message.payload]);
            }
        };
        ws.current.onclose = () => console.log("Connection closed");
    }, [dispatch]);

    const sendMessage = () => {
        if (!ws.current) return;
        const newMessage = {
            type: "SEND_MESSAGE",
            payload: text
        }

        ws.current.send(JSON.stringify(newMessage));
        setText('');
    }

    return (
        <main>
            <Grid container spacing={3}>
                <Grid
                    size={4}
                    border="1px solid black"
                    borderRadius={2}
                    height="80vh"
                    padding={2}
                >
                    <Typography variant="h4">Online users</Typography>
                    <hr/>
                    <Box display="flex" flexDirection="column">
                        {onlineUsers
                            .map((user) => (
                                <Typography
                                    key={user._id}
                                    fontSize={20}
                                >{user.username}</Typography>
                            ))
                        }
                    </Box>
                </Grid>
                <Grid
                    size={8}
                    padding={2}
                    border="1px solid black"
                    borderRadius={2}
                >
                    <Typography variant="h4">Chat room</Typography>
                    <hr/>

                    <Box mb={4} height="60vh" overflow="auto">
                        {messages.map((message) => (
                            <Box
                                key={message._id}
                                mb={1}
                                border="1px solid #ccc"
                                borderRadius={1}
                                padding={2}
                            >
                                <Grid container justifyContent="space-between">
                                    <Grid>
                                        <Typography fontWeight="bold">
                                            {message.user.username}
                                        </Typography>
                                    </Grid>


                                    <Grid>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {dayjs(message.datetime).format('DD.MM.YYYY HH:MM')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography>{message.text}</Typography>
                            </Box>
                        ))}
                    </Box>


                    <form>
                        <Grid container alignItems="center">
                            <Grid size={10}>
                                <TextField
                                    fullWidth
                                    // disabled={loading}
                                    onChange={(e) => setText(e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={2}>
                                <Button onClick={sendMessage}>Send</Button>
                            </Grid>
                        </Grid>
                    </form>

                </Grid>
            </Grid>
        </main>
    );
};

export default Chat;