"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  HStack,
  Image,
  chakra,
  Stack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { css, Global } from "@emotion/react";
import dynamic from "next/dynamic";

// 自定义按钮组件
interface ButtonProps {
  children?: React.ReactNode;
  type?: 'primary' | 'border';
  onClick?: () => void;
}

const Button = ({ children, type = 'primary', onClick }: ButtonProps) => {
  const buttonClass = type === 'border' ? 'pi-border-button' : 'pi-primary-button';
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  return (
    <button 
      className={`pi-button ${buttonClass}`} 
      onClick={onClick}
      style={{
        transition: "all 0.5s ease-in-out",
        cursor: "pointer",
        minWidth: isMobile ? "120px" : "196px",
        fontSize: isMobile ? "16px" : "18px",
        color: type === 'primary' ? "#fff" : "#fff",
        fontFamily: "Space-Grotesk, sans-serif",
        textTransform: "uppercase",
        borderRadius: "10px",
        height: isMobile ? "46px" : "56px",
        width: "100%",
        ...(type === 'primary' 
          ? { 
              background: "linear-gradient(90deg, #9747FE 0%, #1973FB 100%)",
              padding: isMobile ? "10px 0" : "14px 0",
              border: "none"
            } 
          : {
              borderTop: "1px solid #1D71FA",
              borderRight: "3px solid #1D71FA",
              borderBottom: "1px solid #1D71FA",
              borderLeft: "3px solid #1D71FA",
              background: "rgba(0, 0, 0, 0.30)",
              backdropFilter: "blur(5px)"
            })
      }}
    >
      {children}
    </button>
  );
};

// 动态导入 Lottie 组件
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

// 定义动画关键帧
const rotateA = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const rotateB = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

// 模拟 xpi-web-frontend 中的样式组件
const IndexBox = chakra(Box, {
  baseStyle: {
    display: "grid",
    height: "min-content",
    justifyItems: "center",
    padding: "55px 0",
    position: "relative",
    zIndex: 1,
    ".pi": {
      fontFamily: "EDIX !important",
    },
    "@media screen and (max-width: 768px)": {
      padding: "36px 0"
    },
    "@media screen and (min-width: 768px) and (max-width: 1400px)": {
      padding: "36px 0"
    }
  },
});

const HomeBgBox = chakra(Box, {
  baseStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "-webkit-fill-available",
    marginTop: "-60px",
    height: "100vh",
    zIndex: 0,
    ".pi-war-bg": {
      position: "relative",
      width: "100%",
      height: "100%",
      ".bg": {
        backgroundImage: "url('/xpi/bg/bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 0,
      }
    }
  },
});

const HomeBox = chakra(Flex, {
  baseStyle: {
    display: "grid",
    height: "min-content",
    gridAutoFlow: "column",
    gridAutoColumns: "1fr 1fr",
    alignItems: "center",
    ".title": {
      fontSize: "75px",
      fontWeight: 800,
      lineHeight: "1.2em",
      letterSpacing: "0px",
      textShadow: "0px 1px 2px rgba(0, 0, 0, 0.7)",
      fontFamily: "EDIX, sans-serif !important",
      color: "#fff",
      "@media screen and (max-width: 768px)": {
        fontSize: "60px",
      },
    },
    "@media screen and (max-width: 1024px)": {
      gridAutoFlow: "row",
    },
  },
});

const HomeContainerBox = chakra(Box, {
  baseStyle: {
    display: "grid",
    gap: "1rem",
    justifyItems: "center",
    height: "min-content",
    "@media screen and (max-width: 768px)": {
      gap: "8px",
    },
  },
});

const PiWar = chakra(Box, {
  baseStyle: {
    ".pi-war-home-logo": {
      width: "24rem",
      height: "24rem",
      position: "relative",
      "&::after": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url('/xpi/bg/PiwarLOGO1.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        animation: `${rotateA} 5s linear infinite`,
      },
      "&::before": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url('/xpi/bg/PiwarLOGO2.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        animation: `${rotateB} 5s linear infinite`,
      },
      ".logo-1": {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundImage: "url('/xpi/bg/PiwarLOGO3.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%"
      },
      "@media screen and (max-width: 768px)": {
        width: "20rem",
        height: "20rem",
      },
    },
  },
});

const HomeBntBox = chakra(Flex, {
  baseStyle: {
    width: "-webkit-fill-available",
    display: "flex",
    gap: "26px",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    "@media screen and (max-width: 768px)": {
      gap: "12px",
      "& a": {
        flex: "1 1 auto",
        minWidth: "140px",
        maxWidth: "48%",
        marginTop: "8px",
      },
    },
  },
});

const HomeText = chakra(Box, {
  baseStyle: {
    fontSize: "16px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#336bfe",
    width: "fit-content",
  },
});

const HomeTitle = chakra(Box, {
  baseStyle: {
    color: "#ffffff",
    fontSize: "60px",
    fontWeight: 800,
    lineHeight: "1.36em",
    letterSpacing: "0px",
    fontFamily: "Space-Grotesk, Sans-serif !important",
    whiteSpace: "pre-line",
    "@media screen and (max-width: 768px)": {
      fontSize: "30px",
    },
  },
});

const TextBox = chakra(Text, {
  baseStyle: {
    color: "#A4A9AC",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: 1.46,
    whiteSpace: "pre-line",
    textShadow: "0px 1px 2px #000",
    textAlign: "left",
    wordBreak: "keep-all",
    overflow: "hidden",
    fontFamily: "Space-Grotesk, sans-serif",
    "@media screen and (max-width: 768px)": {
      fontSize: "15px",
    },
  },
});

const AddressTextBox = chakra(TextBox, {
  baseStyle: {
    textAlign: "center",
    marginTop: "-10px",
    width: "700px",
    "@media screen and (max-width: 768px)": {
      width: "-webkit-fill-available",
    },
  },
});

const W1400 = chakra(Box, {
  baseStyle: {
    maxWidth: "1400px",
    width: "-webkit-fill-available",
    padding: "0 16px",
    position: "relative",
    zIndex: 2,
  },
});

const P166 = chakra(Box, {
  baseStyle: {
    padding: "0 126px",
    "@media screen and (max-width: 768px)": {
      padding: 0,
    },
    "@media screen and (min-width: 768px) and (max-width: 1200px)": {
      padding: "0 36px",
    },
  },
});

// CSS 全局样式声明
const globalStyles = `
  @font-face {
    font-family: 'EDIX';
    src: url('/fonts/EDIX.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'Space-Grotesk';
    src: url('/fonts/Space-Grotesk.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  html, body {
    background: #000;
    background-color: #000;
    font-family: Space-Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #fff;
    overflow-x: hidden;
  }

  body {
    min-height: 100vh;
    background-color: #000;
  }

  #__next, main {
    background-color: #000;
    color: #fff;
  }

  .title {
    font-family: EDIX, sans-serif !important;
    font-size: 75px;
    font-weight: 800;
    line-height: 1.2em;
    letter-spacing: 0px;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.7);
  }

  @media screen and (max-width: 768px) {
    .title {
      font-size: 60px;
      margin-bottom: -10px;
    }
  }

  .sol-color {
    background: linear-gradient(90deg, #9447FE 0%, #306BFB 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: none;
  }

  .pi-war-color {
    background: linear-gradient(90deg, #18acde 0%, #ef45b8 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pi-color{
    background-image: linear-gradient(90deg, #336bfe 0%, #0ebafd 100%);
    background-size: cover;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
  }
  
  button, input, select, textarea {
    font-family: Space-Grotesk, sans-serif !important;
  }

  * {
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    -moz-tap-highlight-color: transparent;
    -ms-tap-highlight-color: transparent;
    box-sizing: border-box;
  }

  *::-webkit-scrollbar-track {
    background-color: transparent;
    margin: 6px 0;
  }

  *::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: #111;
  }

  *::-webkit-scrollbar-thumb {
    background-color: rgba(51,107,254,1);
    border-radius: 100px;
  }

  /* 修改链接样式，排除页脚中的链接 */
  a:not(footer a) {
    color: #fff;
    text-decoration: none;
  }
  
  /* 确保页脚文本颜色正确 */
  footer, footer * {
    color: inherit;
  }
`;

// 合作伙伴数据
const partners = [
  {
    img: '/xpi/partners/BMX.png',
    url: 'https://www.bitmart.com/invite/VSACBD/en-US',
  },
  {
    img: '/xpi/partners/coinmarketcap.svg',
    url: 'https://coinmarketcap.com/currencies/xpi/',
  },
  {
    img: '/xpi/partners/dexscreener.png',
    url: 'https://dexscreener.com/solana/6st2zwhtvs38r34n3iawbs8bv6b8ee5uicjq3btkywxa',
  },
  // {
  //   img: '/xpi/partners/gmgn.png',
  //   url: 'https://gmgn.ai/sol/token/BoMbSn3KcWsUe1dgz5ddJrRaM6v44fpeARNA9t7Dpump',
  // },
  {
    img: '/xpi/partners/coingecko.svg',
    url: 'https://www.coingecko.com/en/coins/xpi',
  },
  {
    img: '/xpi/partners/pump.png',
    url: 'https://pump.fun/coin/BoMbSn3KcWsUe1dgz5ddJrRaM6v44fpeARNA9t7Dpump',
  }
];

// 工具函数和链接
const utils = {
  contractAddress: "BoMbSn3KcWsUe1dgz5ddJrRaM6v44fpeARNA9t7Dpump", 
  x: {
    name: "𝕏",
    url: "https://x.com/X_Pi_S",
  },
  tg: {
    name: "✈️",
    url: "https://t.me/XPi_S",
  },
  shows: {
    home: {
      advertise: false, 
      links: false,
    }
  }
};

// 合约地址组件
function ContractAddress({ address }: { address?: string }) {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const truncatedAddress = address 
    ? `${address.substring(0, 12)}...${address.substring(address.length - 16)}`
    : '';
    
  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="contract-address" style={{
      width: "-webkit-fill-available",
      display: "flex",
      justifyContent: "center"
    }}>
      <div 
        className="container" 
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 30px",
          alignItems: "center",
          width: isMobile ? "calc(100% - 20px)" : "400px",
          borderTop: "0.5px solid #6366f1",
          borderRight: "2px solid #6366f1",
          borderBottom: "0.5px solid #6366f1",
          borderLeft: "2px solid #6366f1",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          padding: isMobile ? "8px 12px 8px 12px" : "10px 16px",
          paddingRight: isMobile ? "8px" : "12px",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          fontSize: isMobile ? "14px" : "18px",
          fontWeight: 600,
          color: "#fff",
          cursor: "pointer",
          borderRadius: "6px"
        }}
        onClick={handleCopy}
      >
        <div 
          style={{ 
            flex: 1, 
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {truncatedAddress}
        </div>
        <div 
          className="copy-icon" 
          style={{
            background: copied 
              ? "linear-gradient(90deg, #22c55e, #16a34a)" 
              : "linear-gradient(90deg, #9747FE 0%, #1973FB 100%)",
            color: "white",
            borderRadius: "6px",
            padding: "4px",
            width: "30px",
            height: "30px",
            transition: "all 0.5s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" fill="#fff" width="16px" height="16px">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="#fff" width="100%" height="100%">
              <path d="M4.00029 12.6667H12.0003V4.66667H4.00029V12.6667ZM4.00029 14C3.26696 14 2.66696 13.4 2.66696 12.6667V4.66667C2.66696 3.93333 3.26696 3.33333 4.00029 3.33333H12.0003C12.7336 3.33333 13.3336 3.93333 13.3336 4.66667V12.6667C13.3336 13.4 12.7336 14 12.0003 14H4.00029ZM6.00029 2H13.3336C14.0703 2 14.6703 2.6 14.6703 3.33333V10.6667H13.3336V3.33333H6.00029V2Z"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export default function XpiPage() {
  const { t } = useTranslation();
  const [animationData, setAnimationData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 动态导入 JSON 数据
    fetch('/xpi/data.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch(err => console.error("Error loading animation data:", err));
      
    // 检测设备是否为移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <Global styles={css`${globalStyles}`} />
      <Box bg="#000" minH="100vh" color="white" position="relative">
        <HomeBgBox>
          <Box className="pi-war-bg" position="relative" w="100%" h="100%">
            <Box 
              className="bg"
              bgImage="url('/xpi/bg/bg.png')"
              bgRepeat="no-repeat"
              bgSize="cover"
              bgPosition="center"
              w="100%"
              h="100vh"
              position="absolute"
              left={0}
              top={0}
            />
            {animationData && <Lottie animationData={animationData} />}
          </Box>
        </HomeBgBox>
        
        <IndexBox style={{ marginTop: '0', marginBottom: '3rem' }}>
          <W1400>
            <P166>
              <HomeBox>
                <HomeContainerBox style={{ zIndex: 2 }}>
                  <PiWar>
                    <Box className="pi-war-home-logo">
                      <Box className="logo-1" />
                    </Box>
                  </PiWar>
                  <HomeBntBox
                    style={{
                      width: '-webkit-fill-available',
                      flexFlow: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Box as="span" className="title" style={{ marginTop: -26 }}>
                      x<Box as="span" className="sol-color">PI</Box>
                    </Box>

                    <img src="/xpi/pisol.png" style={{ width: '100%' }} />

                    <AddressTextBox
                      style={{
                        textAlign: 'center',
                        marginTop: -10,
                        color: '#CEDAFF'
                      }}
                    >
                      {t(`𝕏ℙ𝕚 - X + Pi
                   SPACE - AI - WEB3 - DESCI`)}
                    </AddressTextBox>
                    <ContractAddress address={utils.contractAddress} />
                  </HomeBntBox>
                  <HomeBntBox style={{ marginTop: 0, gap: isMobile ? 8 : 12 }}>
                    <a href={utils.x.url} target="_blank" style={{ width: isMobile ? "calc(50% - 4px)" : "auto" }}>
                      <Button type="primary">{utils.x.name}</Button>
                    </a>
                    <a href={utils.tg.url} target="_blank" style={{ width: isMobile ? "calc(50% - 4px)" : "auto" }}>
                      <Button type="border">{utils.tg.name}</Button>
                    </a>
                  </HomeBntBox>
                  <div style={{
                    display: "flex",
                    gap: isMobile ? "8px" : "12px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: "16px",
                    width: "100%",
                    padding: isMobile ? "0 10px" : "0"
                  }}>
                    {partners.map((partner) => (
                      <a
                        key={partner.img}
                        href={partner.url}
                        target="_blank"
                        style={{
                          transition: "all 0.5s ease",
                          width: isMobile ? "48px" : "56px",
                          height: isMobile ? "48px" : "56px",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(8px)",
                          padding: isMobile ? "6px" : "8px",
                          borderTop: "0.5px solid #6366f1",
                          borderRight: "2px solid #6366f1",
                          borderBottom: "0.5px solid #6366f1",
                          borderLeft: "2px solid #6366f1"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <img src={partner.img} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </a>
                    ))}
                  </div>
                </HomeContainerBox>
              </HomeBox>
            </P166>
          </W1400>
        </IndexBox>
        <IndexBox />
      </Box>
    </>
  );
} 