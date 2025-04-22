/* 
  全局wss
  1. 连接成功后，发送ping
  2. 收到pong后，设置状态为true
  3. 每30秒更新一次代币
  4. 收到close或error后，设置状态为false
  5. 收到new_msg后，更新代币
*/
"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { userApi } from "@/config/axios";

interface WssContextType {
  socket: WebSocket | null;
  updateToken: (tokenAddress: string) => void;
}

export const WssContext = createContext<WssContextType>({
  socket: null,
  updateToken: () => {},
});

export const useWss = () => useContext(WssContext);

export const WssProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<boolean>(false);

  const wsUrl = userApi.defaults.baseURL
    ? userApi.defaults.baseURL.replace(/^http:\/\//i, 'ws://').replace(/^https:\/\//i, 'wss://') + '/ws'
    : '';
  const socket = new WebSocket(wsUrl);
  socket.onopen = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ mode: "ping", data: "ping" }));
      setStatus(true);
      console.log("socket onopen");
    }
  };

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    if (response.message === "pong") {
      const data = response.data;
      console.log("socket onmessage start updateToken");
      const interval = setInterval(async () => {
        if (status) {
          data.forEach(async (item: string) => {
            await updateToken(item);
          });
        } else {
          clearInterval(interval);
        }
      }, 30000);
    }
  };

  socket.onclose = () => {
    setStatus(false);
  };

  socket.onerror = () => {
    setStatus(false);
  };

  const updateToken = async (tokenAddress: string) => {
    if (!tokenAddress) return;
    try {
      const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
      const response = await fetch(url);
      const data = await response.json();

      if (socket && socket.readyState === WebSocket.OPEN) {
        const new_msg = {
          mode: "up_dexscreener",
          data: { tokenAddress: tokenAddress, ...data },
        };
        socket.send(JSON.stringify(new_msg));
        // log(new_msg);
      }
    } catch (error) {
      // console.error("更新代币失败:", error);
      // log(`更新代币失败: ${error}`);
      console.log("updateToken error", error);
    }
  };

  return (
    <WssContext.Provider value={{ socket, updateToken }}>
      {children}
    </WssContext.Provider>
  );
};
