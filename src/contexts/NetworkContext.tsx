'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NetworkContextType {
  network: string;
  handleNetworkChange: (newNetwork: string) => void;
}

export const NetworkContext = createContext<NetworkContextType>({
  network: 'Pi Network',
  handleNetworkChange: () => {},
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [network, setNetwork] = useState<string>('Pi Network');
  const pathname = usePathname();
  
  // 从localStorage初始化网络设置
  useEffect(() => {
    // 尝试从localStorage获取保存的网络设置
    const savedNetwork = localStorage.getItem('selectedNetwork');
    
    // 首先检查URL路径是否包含网络信息
    if (pathname) {
      const isSOLPath = pathname.includes('/mint/sol/');
      const isPiPath = pathname.includes('/mint/pi/');
      
      if (isSOLPath) {
        setNetwork('Solana');
        localStorage.setItem('selectedNetwork', 'Solana');
        return;
      } else if (isPiPath) {
        setNetwork('Pi Network');
        localStorage.setItem('selectedNetwork', 'Pi Network');
        return;
      }
    }
    
    // 如果URL中没有网络信息，则使用localStorage中保存的设置
    if (savedNetwork) {
      setNetwork(savedNetwork);
    }
  }, [pathname]);

  const handleNetworkChange = (newNetwork: string) => {
    setNetwork(newNetwork);
    // 保存用户选择到localStorage
    localStorage.setItem('selectedNetwork', newNetwork);
    console.log(`网络已切换到: ${newNetwork}`);
  };

  return (
    <NetworkContext.Provider
      value={{
        network,
        handleNetworkChange,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}; 