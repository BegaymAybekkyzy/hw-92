import axios from "axios";
import {BASE_URL} from "./globalConstants.ts";

const axiosAPI = axios.create({
  baseURL: "http://" + BASE_URL + "/",
});

axiosAPI.defaults.withCredentials = true;

export default axiosAPI;
