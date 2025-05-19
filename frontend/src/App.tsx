import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import {Container, Typography} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Authentication from "./features/User/Authentication.tsx";
import Registration from "./features/User/Registration.tsx";
import {useAppSelector} from "./app/hooks.ts";
import {selectUser} from "./features/User/usersSlice.ts";
import ProtectedRoute from "./components/UI/ProtectedRoute/ProtectedRoute.tsx";
import Chat from "./features/Messages/Chat.tsx";

const App = () => {
    const user = useAppSelector(selectUser);

  return (
    <>
      <header>
        <AppToolbar/>
      </header>
      <Container style={{marginBottom: 70}}>
        <Routes>
          <Route path="/registration" element={<Registration/>}/>
          <Route path="/" element={
            <ProtectedRoute isAllowed={Boolean(user)}><Chat/></ProtectedRoute>
          }/>
          <Route path="/login" element={<Authentication/>}/>
          <Route path="*" element={<Typography variant={"h3"} color="textSecondary">Page not found</Typography>}/>
        </Routes>
      </Container>
    </>
  )
};

export default App
