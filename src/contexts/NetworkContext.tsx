'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NetworkContextType {
  network: string;
  handleNetworkChange: (newNetwork: string) => void;
}

export const NetworkContext = createContext<NetworkContextType>({
  network: 'SOL',
  handleNetworkChange: () => {},
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [network, setNetwork] = useState<string>('SOL');
  const pathname = usePathname();
  const initialNetwork = 'SOL';
  
  // 根据当前路径检测网络
  useEffect(() => {
    // 检查URL中是否包含特定网络的路径
    const isSOLPath = pathname.includes('/sol/');
    const isPiPath = pathname.includes('/pi/');

    if (isSOLPath) {
      setNetwork('SOL');
    } else if (isPiPath) {
      setNetwork('PI');
    } else if (network === initialNetwork) {
      // 如果当前网络与初始值相同，不需要重新设置
      return;
    } else if (localStorage && localStorage.getItem('selectedNetwork')) {
      // 使用本地存储的首选网络，但总是优先使用SOL
      const savedNetwork = localStorage.getItem('selectedNetwork');
      // 如果保存的网络不是SOL，检查我们是否想要使用保存的网络，这里我们设置为总是使用SOL
      setNetwork(initialNetwork);
    } else {
      // 确保默认使用SOL网络
      setNetwork(initialNetwork);
    }
  }, [pathname, network, initialNetwork]);

  const handleNetworkChange = (newNetwork: string) => {
    setNetwork(newNetwork);
    // 保存用户选择到localStorage
    localStorage.setItem('selectedNetwork', newNetwork);
    console.log(`Network switched to: ${newNetwork}`);
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