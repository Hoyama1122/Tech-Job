import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    const token = Cookies.get("token");

    let baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!baseUrl && process.env.NEXT_PUBLIC_API_URL) {
      baseUrl = process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/api\/?$/, "");
    }
    if (!baseUrl) {
      baseUrl = "http://localhost:5000";
    }

    socket = io(baseUrl, {
      withCredentials: true,
      transports: ["polling", "websocket"],
      extraHeaders: {
        "ngrok-skip-browser-warning": "69420",
      },
      auth: {
        token: token,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected to:", baseUrl, "ID:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
