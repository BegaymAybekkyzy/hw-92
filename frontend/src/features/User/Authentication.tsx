import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import {authentication} from "./userThunks.ts";
import Typography from "@mui/material/Typography";
import {Box, Button, Grid, TextField} from "@mui/material";
import type {IUserForm} from "../../types";
import {selectAuthenticationErrors, selectAuthenticationLoading} from "./usersSlice.ts";

const Authentication = () => {
    const [form, setForm] = useState<IUserForm>({
        username: "",
        password: "",
    });

    const dispatch = useAppDispatch();
    const error = useAppSelector(selectAuthenticationErrors);
    const loading = useAppSelector(selectAuthenticationLoading);
    const navigate = useNavigate();

    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await dispatch(authentication(form)).unwrap();
        navigate("/");
    };

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    return (
        <div>
            <Typography
                variant={"h3"}
                color="textSecondary"
                textAlign="center"
                marginBottom={5}
            >Login</Typography>

            {error ?
                <Typography textAlign="center" color="#fa4d4d" marginBottom={4}>{error.error}</Typography>
                : null
            }

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <form onSubmit={onSubmitForm}>
                    <Grid container spacing={2} marginBottom={3}>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="username"
                                disabled={loading}
                                value={form.username}
                                onChange={onChangeInput}
                                variant="outlined" />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Password"
                                disabled={loading}
                                value={form.password}
                                name="password"
                                onChange={onChangeInput}
                                variant="outlined" />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        sx={{backgroundColor: "#aa73dc"}}
                        type="submit"
                        color="primary"
                        disabled={loading}
                    >log in</Button>
                </form>
            </Box>
        </div>
    );
};

export default Authentication;