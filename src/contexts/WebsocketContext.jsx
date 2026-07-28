/* eslint-disable react-refresh/only-export-components */
import { createContext } from "react";
import { io } from "socket.io-client";
const { VITE_APP_URL_BACKEND } = import.meta.env;

const socketUrl = VITE_APP_URL_BACKEND || "http://localhost:3000";
export const socket = io(socketUrl);
export const WebsocketContext = createContext(socket)

export const WebsocketProvider = WebsocketContext.Provider;