import axios from "axios";
import config from "../config.json";

export function getCurrentGuilds() {
    return axios.get(`${config.baseURL}/auth/account/current-guilds`, { withCredentials: true });
}

export function getCurrentSession() {
    return axios.get(`${config.baseURL}/auth/account/current-session`, { withCredentials: true });
}

export function getCurrentToken() {
    return axios.get(`${config.baseURL}/auth/account/current-token`, { withCredentials: true });
}

export function getCurrentUser() {
    return axios.get(`${config.baseURL}/auth/account/current-user`, { withCredentials: true });
}

export { createWebSocket } from "./websocket";