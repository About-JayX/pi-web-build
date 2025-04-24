/* 
  全局wss
  1. 连接成功后，发送ping
  2. 收到pong后，设置状态为true
  3. 每30秒更新一次代币
  4. 收到close或error后，设置状态为false
  5. 收到new_msg后，更新代币
*/
"use client"
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react"
import { userApi } from "@/config/axios"
import { usePathname } from "next/navigation"

interface WssContextType {
  socket: WebSocket | null
  updateToken: (tokenAddress: string) => void
}

export const WssContext = createContext<WssContextType>({
  socket: null,
  updateToken: () => {},
})

export const useWss = () => useContext(WssContext)

export const WssProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<boolean>(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const tokenAddressesRef = useRef<string[]>([])
  const pathname = usePathname()

  // 检查当前路径是否是/market或其子路径
  const isMarketPage =
    pathname === "/market" || pathname?.startsWith("/market/")
  // 检查是否是points页面
  const isPointsPage =
    pathname === "/points" || pathname?.startsWith("/points/")

  // 使用useEffect管理WebSocket连接
  useEffect(() => {
    // 如果不是需要连接的页面，则不建立WebSocket连接
    if (!isMarketPage && !isPointsPage) return

    const wsUrl = userApi.defaults.baseURL
      ? userApi.defaults.baseURL
          .replace(/^http:\/\//i, "ws://")
          .replace(/^https:\/\//i, "wss://") + "/ws"
      : ""

    if (!wsUrl) return

    const ws = new WebSocket(wsUrl)
    setSocket(ws)

    ws.onopen = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ mode: "ping", data: "ping" }))
        setStatus(true)
        console.log("socket onopen")
      }
    }

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data)
        // console.log("收到WebSocket消息:", response)

        if (response.message === "pong") {
          const data = response.data
          console.log("收到pong消息，代币地址列表:", data)
          // 只在market页面执行更新token操作
          if (isMarketPage) {
            // 立即执行一次更新
            data.forEach(async (item: string) => {
              tokenAddressesRef.current.push(item)
            })
          }
        }

        if (response.message === "go") {
          // 只在market页面执行更新token操作
          if (isMarketPage) {
            // console.log("收到go消息，开始更新代币")
            tokenAddressesRef.current.forEach(async (item: string) => {
              const new_msg = await updateToken(item)
              if (new_msg) {
                ws.send(JSON.stringify(new_msg))
              }
            })
            // Reset tokenAddressesRef
            tokenAddressesRef.current = []
            //Get Token Data again
            ws.send(JSON.stringify({ mode: "ping", data: "ping" }))
          }
        }
      } catch (error) {
        console.error("解析WebSocket消息失败:", error)
      }
    }

    ws.onclose = () => {
      console.log("WebSocket连接关闭")
      setStatus(false)
    }

    ws.onerror = (error) => {
      console.error("WebSocket错误:", error)
      setStatus(false)
    }

    // 清理函数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (ws) {
        ws.close()
      }
    }
  }, [isMarketPage, isPointsPage, pathname]) // 添加pathname作为依赖，当路径改变时重新评估

  const updateToken = async (tokenAddress: string) => {
    try {
      const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
      const response = await fetch(url)
      const data = await response.json()
      const new_msg = {
        mode: "up_dexscreener",
        data: { tokenAddress: tokenAddress, ...data },
      }
      return new_msg
      // if (ws && ws.readyState === WebSocket.OPEN) {
      // const new_msg = {
      //   mode: "up_dexscreener",
      //   data: { tokenAddress: tokenAddress, ...data },
      // }
      //   ws.send(JSON.stringify(new_msg))
      //   console.log("Token updated:", tokenAddress)
      // }
    } catch (error) {
      console.log("updateToken error", error)
    }
  }

  return (
    <WssContext.Provider value={{ socket, updateToken }}>
      {children}
    </WssContext.Provider>
  )
}
