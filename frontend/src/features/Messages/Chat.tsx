import {useEffect, useRef, useState} from 'react';
import {BASE_URL} from "../../globalConstants.ts";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectUserOnline} from "../User/usersSlice.ts";
import {fetchUsersOnline} from "../User/userThunks.ts";
import type {IMessageApi} from "../../types";

const Chat = () => {
    const ws = useRef<WebSocket | null>(null);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<IMessageApi[]>([]);
    console.log(messages);

    const onlineUsers = useAppSelector(selectUserOnline);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchUsersOnline());
        ws.current = new WebSocket("ws://" + BASE_URL + "/messages");
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "NEW_MESSAGE") {
                setMessages((prev) => [...message.payload, ...prev]);
            }
        };
        ws.current.onclose = () => console.log("Connection closed");
    }, [dispatch]);



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
                        {
                            onlineUsers.map((user) => (
                                <Grid key={user._id}>{user.username}</Grid>
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

                    <Box mt={2} height="60vh" overflow="auto" border="1px solid #ccc" borderRadius={1} p={2}>
                        {messages.map((msg) => (
                            <Box key={msg._id} mb={1}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {msg.user.username}
                                </Typography>
                                <Typography>{msg.text}</Typography>
                            </Box>
                        ))}
                    </Box>


                    <form>
                        <Grid alignItems="center">
                            <Grid alignItems="center">
                                <TextField
                                    // disabled={loading}
                                    onChange={(e) => setText(e.target.value)}
                                    variant="outlined"
                                />
                                <Button>Send</Button>
                            </Grid>
                        </Grid>
                    </form>

                </Grid>
            </Grid>
        </main>
    );
};

export default Chat;