import { createSlice } from "@reduxjs/toolkit";
import { authentication, registration } from './userThunks.ts';
import type {RootState} from "../../app/store.ts";
import type {IErrorMessage, IUserApi, IValidationError} from "../../types";


interface userState {
  user: IUserApi | null;
  registrationLoading: boolean;
  registrationErrors: IValidationError | IErrorMessage | null;
  authenticationLoading: boolean;
  authenticationErrors: IErrorMessage | null;
}

const initialState: userState = {
  user: null,
  registrationLoading: false,
  registrationErrors: null,
  authenticationLoading: false,
  authenticationErrors: null,
};

export const selectUser = (state: RootState) => state.users.user;
export const selectRegistrationErrors = (state: RootState) =>
  state.users.registrationErrors;
export const selectAuthenticationErrors = (state: RootState) =>
  state.users.authenticationErrors;
export const selectRegistrationLoading = (state: RootState) =>
  state.users.registrationLoading;
export const selectAuthenticationLoading = (state: RootState) =>
  state.users.authenticationLoading;

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    systemLogout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registration.pending, (state) => {
        state.registrationLoading = true;
        state.registrationErrors = null;
      })
      .addCase(registration.fulfilled, (state, { payload: user }) => {
        state.registrationLoading = false;
        state.registrationErrors = null;
        state.user = user;
      })
      .addCase(registration.rejected, (state, { payload: error }) => {
        state.registrationLoading = false;
        state.registrationErrors = error || null;
        console.log(error);
      })

      .addCase(authentication.pending, (state) => {
        state.authenticationLoading = true;
        state.authenticationErrors = null;
      })
      .addCase(authentication.fulfilled, (state, { payload: user }) => {
        state.authenticationLoading = false;
        state.authenticationErrors = null;
        state.user = user;
      })
      .addCase(authentication.rejected, (state, { payload: error }) => {
        state.authenticationLoading = false;
        state.authenticationErrors = error || null;
      })
  },
});

export const userReducer = usersSlice.reducer;
export const { systemLogout } = usersSlice.actions;
