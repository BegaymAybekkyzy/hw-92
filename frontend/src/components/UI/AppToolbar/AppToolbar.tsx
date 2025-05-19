import {AppBar, Grid, Toolbar, Box, Typography, Button} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {logout} from "../../../features/User/userThunks.ts";
import {selectUser, systemLogout} from "../../../features/User/usersSlice.ts";

const AppToolbar = () => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onLogout = () => {
        dispatch(logout()).unwrap;
        dispatch(systemLogout());
        navigate("/");
    }

    return (
        <AppBar position="static" sx={{backgroundColor: "#aa73dc", marginBottom: "50px"}}>
            <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                <Grid>
                    <Typography variant="h5">
                        <NavLink style={{color: "white", textDecoration: "none"}} to="/">
                            Chat
                        </NavLink>
                    </Typography>
                </Grid>
                <Grid>
                    {user
                        ? <Box display="flex" alignItems="center">
                            <Typography
                                sx={{borderRight: "1px solid white"}}
                                paddingRight={2}
                            >Welcome <b>{user.username}!</b></Typography>
                            <Button
                                sx={{color: "white"}}
                                component={NavLink} to="/login"
                                onClick={onLogout}
                            >Logout
                            </Button>
                            </Box>
                        : <Box>
                            <NavLink
                                className="nav-item text-white"
                                to="/registration"
                            >Registration</NavLink>
                            <span className="mx-2">or</span>
                            <NavLink
                                className="nav-item text-white"
                                to="/login"
                            >Login</NavLink>
                            </Box>
                    }
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;