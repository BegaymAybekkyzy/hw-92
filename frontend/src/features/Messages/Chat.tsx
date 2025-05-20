import {useEffect, useRef, useState} from 'react';
import {BASE_URL} from "../../globalConstants.ts";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import type {IMessageApi} from "../../types";
import dayjs from "dayjs";
import {selectUsersOnline, setOnlineUsers} from "../User/usersSlice.ts";
import PersonIcon from '@mui/icons-material/Person';

const Chat = () => {
    const ws = useRef<WebSocket | null>(null);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<IMessageApi[]>([]);
    const onlineUsers = useAppSelector(selectUsersOnline);

    const dispatch = useAppDispatch();

    useEffect(() => {
        let reconnectTimeout: NodeJS.Timeout;
        ws.current = new WebSocket("ws://" + BASE_URL + "/messages");

        ws.current.onopen = () => console.log("Connection opened");

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "ONLINE_USERS") {
                dispatch(setOnlineUsers(message.payload));
            }

            if (message.type === "NEW_MESSAGE") {
                setMessages((prev) => [...message.payload, ...prev]);
            }
        };

        ws.current.onclose = () => {
            console.log("Connection closed")
            reconnectTimeout = setTimeout(() => {
                ws.current = new WebSocket("ws://" + BASE_URL + "/messages");
            }, 3000);
        };

        ws.current.onerror = (error) => {
            console.error( error);
            ws.current?.close();
        };

        return () => {
            clearTimeout(reconnectTimeout);
            ws.current?.close();
        };

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
                    size={3}
                    border="1px solid black"
                    borderRadius={2}
                    height="80vh"
                    padding={2}
                >
                    <Typography variant="h5">Online users</Typography>
                    <hr/>
                    <Box display="flex" flexDirection="column" gap={1}>
                        {onlineUsers
                            .map((user) => (
                                <Box
                                    key={user._id} display="flex" alignItems="center" gap={1}>
                                    <PersonIcon fontSize="small" />
                                    <Typography fontSize={18}>{user.username}</Typography>
                                </Box>
                            ))
                        }
                    </Box>
                </Grid>
                <Grid
                    size={9}
                    padding={2}
                    height="80vh"
                    border="1px solid black"
                    borderRadius={2}
                >
                    <Typography variant="h5">Chat room</Typography>
                    <hr/>

                    <Box mb={4} height="58vh" overflow="auto">
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
                    <hr style={{marginBottom: 20}}/>
                    <form>
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            justifyContent="center"
                        ><Grid size={10}>
                                <TextField
                                    fullWidth
                                    label="Enter a message"
                                    onChange={(e) => setText(e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid size={2}>
                                <Button
                                    variant="contained"
                                    onClick={sendMessage}
                                    sx={{backgroundColor: "#aa73dc"}}
                                >Send</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </main>
    );
};

export default Chat;