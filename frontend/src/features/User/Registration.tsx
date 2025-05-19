import React, {useState} from 'react';
import type {IUserForm} from "../../types";
import {Typography, Grid, TextField, Button, Box} from "@mui/material"
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import {selectRegistrationErrors, selectRegistrationLoading} from './usersSlice.ts';
import {registration} from "./userThunks.ts";

const Registration = () => {
    const [form, setForm] = useState<IUserForm>({
        username: "",
        password: "",
    });

    const dispatch = useAppDispatch();
    const error = useAppSelector(selectRegistrationErrors);
    const loading = useAppSelector(selectRegistrationLoading);
    const navigate = useNavigate();

    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await dispatch(registration(form)).unwrap();
        navigate("/");
    };

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const getErrors = (fieldName: string) => {
        try {
            if (error && 'errors' in error) {
                return error.errors[fieldName].message;
            }
        } catch (e) {
            return undefined;
        }
    };

    let errorIsUsername: React.ReactNode;

    if (error && "error" in error){
        errorIsUsername = (
            <Typography
                textAlign="center"
                color="#fa4d4d"
                marginBottom={4}
            >{error.error}</Typography>
        );
    }

    return (
        <div>
            <Typography
                variant={"h3"}
                color="textSecondary"
                textAlign="center"
                marginBottom={5}
            >Register</Typography>

            {errorIsUsername}

            <Box sx={{
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
                                helperText={getErrors("username")}
                                error={Boolean(getErrors("username"))}
                                value={form.username}
                                onChange={onChangeInput}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                label="Password"
                                disabled={loading}
                                helperText={getErrors("password")}
                                error={Boolean(getErrors("password"))}
                                value={form.password}
                                name="password"
                                onChange={onChangeInput}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        sx={{backgroundColor: "#aa73dc"}}
                        type="submit"
                        color="primary"
                        disabled={loading}
                    >Sign in
                    </Button>
                </form>
            </Box>
        </div>
    );
};

export default Registration;