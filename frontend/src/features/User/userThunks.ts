import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axiosAPI from "../../axiosAPI.ts";
import type {IErrorMessage, IUserApi, IUserForm, IValidationError} from "../../types";

export const registration = createAsyncThunk<
  IUserApi,
  IUserForm,
  { rejectValue: IValidationError | IErrorMessage }
>("users/registration", async (newUser, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.post("users", newUser);
    return response.data.user;

  } catch (error) {
    if (isAxiosError(error) && error.response && error.response.status === 400) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const authentication = createAsyncThunk<
    IUserApi,
    IUserForm,
  { rejectValue: IErrorMessage }
>("users/authentication", async (user, { rejectWithValue }) => {
  try {
    const response = await axiosAPI.post("users/sessions", user);
    return response.data.user;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      return rejectWithValue(error.response.data);
    }
    throw error;
  }
});

export const logout = createAsyncThunk<void, void>("users/logout", async () => {
  await axiosAPI.delete("users/sessions", {withCredentials: true});
});
