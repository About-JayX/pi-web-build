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
  const initialNetwork = 'Pi Network';
  
  // 根据当前路径检测网络
  useEffect(() => {
    // 检查URL中是否包含特定网络的路径
    const isSOLPath = pathname.includes('/sol/');
    const isPiPath = pathname.includes('/pi/');

    if (isSOLPath) {
      setNetwork('Solana');
    } else if (isPiPath) {
      setNetwork('Pi Network');
    } else if (network === initialNetwork) {
      // 如果当前网络与初始值相同，不需要重新设置
      return;
    } else if (localStorage && localStorage.getItem('preferred_network')) {
      // 使用本地存储的首选网络
      setNetwork(localStorage.getItem('preferred_network') || initialNetwork);
    }
  }, [pathname, network, initialNetwork]);

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