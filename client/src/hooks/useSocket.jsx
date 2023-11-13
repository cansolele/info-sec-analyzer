import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import config from "../config";

export default function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect(config.apiURL);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return socket;
}
