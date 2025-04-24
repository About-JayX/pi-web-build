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
import { useEffect, useState, useMemo } from "react";
import { css, Global } from "@emotion/react";
import dynamic from "next/dynamic";
import { motion } from 'framer-motion';

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
        color: type === 'primary' ? "#fff" : "#9945FF",
        fontFamily: "Space-Grotesk, sans-serif",
        textTransform: "uppercase",
        borderRadius: "10px",
        height: isMobile ? "46px" : "56px",
        width: "100%",
        ...(type === 'primary' 
          ? { 
              background: "linear-gradient(90deg, #19FB9B 0%, #9945FF 100%)",
              padding: isMobile ? "10px 0" : "14px 0",
              border: "none"
            } 
          : {
              borderTop: "1px solid #9945FF",
              borderRight: "3px solid #9945FF",
              borderBottom: "1px solid #9945FF",
              borderLeft: "3px solid #9945FF",
              background: "rgba(0, 0, 0, 0.30)",
              backdropFilter: "blur(5px)"
            })
      }}
    >
      {children}
    </button>
  );
};

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
        backgroundImage: "url('/spacepi/bg.png')",
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
        backgroundImage: "url('/spacepi/bg/PiwarLOGO1.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        animation: `${rotateA} 5s linear infinite`,
        filter: "drop-shadow(0px 0px 15px rgba(153, 69, 255, 0.6))"
      },
      "&::before": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url('/spacepi/bg/PiwarLOGO2.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        animation: `${rotateB} 5s linear infinite`,
        filter: "drop-shadow(0px 0px 15px rgba(25, 251, 155, 0.5))"
      },
      ".logo-1": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "25%"
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
    background: linear-gradient(90deg, #19FB9B 0%, #9945FF 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: none;
  }

  .pi-war-color {
    background: linear-gradient(90deg, #19FB9B 0%, #9945FF 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pi-color{
    background-image: linear-gradient(90deg, #19FB9B 0%, #9945FF 100%);
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

// 工具函数和链接
const utils = {
  contractAddress: "D4985oNS95Ajjz4VvrSxXKpx9VrTQNA1XufhJA18pXPS", 
  x: {
    name: "𝕏",
    url: "https://x.com/SpacePi_Com",
  },
  tg: {
    name: "✈️",
    url: "https://t.me/SpacePi_token",
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
              : "linear-gradient(90deg, #19FB9B 0%, #9945FF 100%)",
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

// 星空背景组件
const StarryBackground = () => {
  const starCount = 100;
  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      animationDuration: Math.random() * 5 + 3
    }));
  }, []);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={1}
      overflow="hidden"
    >
      {stars.map(star => (
        <Box
          key={star.id}
          position="absolute"
          left={`${star.x}%`}
          top={`${star.y}%`}
          width={`${star.size}px`}
          height={`${star.size}px`}
          borderRadius="50%"
          background="white"
          sx={{
            animation: `twinkle ${star.animationDuration}s infinite alternate`,
            opacity: Math.random() * 0.7 + 0.3
          }}
        />
      ))}
    </Box>
  );
};

// 添加关键帧动画
const twinkleKeyframes = css`
  @keyframes float-1 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(10px, 15px) rotate(1deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  
  @keyframes float-2 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-10px, 10px) rotate(-1deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  
  @keyframes twinkle {
    0% { opacity: 0.3; box-shadow: 0 0 10px rgba(255, 255, 255, 0.2); }
    100% { opacity: 1; box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
  }
`;

export default function SpacePiPage() {
  const { t } = useTranslation();
  const [animationData, setAnimationData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [leftPlanePosition, setLeftPlanePosition] = useState(0);
  const [rightPlanePosition, setRightPlanePosition] = useState(0);

  useEffect(() => {
    // 检测设备是否为移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // 为飞船设置一些随机初始位置
    setLeftPlanePosition(Math.random() * 10);
    setRightPlanePosition(Math.random() * 10);
    
    // 加载背景图片
    const img = new window.Image();
    img.src = '/spacepi/bg.png';
    img.onload = () => setBackgroundLoaded(true);
    
    // 添加星星闪烁动画
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
      @keyframes twinkle {
        0% { opacity: 0.1; }
        50% { opacity: 0.8; }
        100% { opacity: 0.1; }
      }
    `;
    document.head.appendChild(styleSheet);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <>
      <Global styles={twinkleKeyframes} />
      <Box bg="#000" minH="100vh" color="white" position="relative" opacity={backgroundLoaded ? 1 : 0} transition="opacity 1s ease-in-out">
        <HomeBgBox>
          <Box className="pi-war-bg" position="relative" w="100%" h="100%">
            <Box 
              className="bg"
              bgImage="url('/spacepi/bg.png')"
              bgRepeat="no-repeat"
              bgSize="cover"
              bgPosition="center"
              w="100%"
              h="100vh"
              position="absolute"
              left={0}
              top={0}
            />
            
            {/* 星空背景 */}
            <StarryBackground />
            
            {/* 左侧飞船 */}
            <Box 
              position="absolute" 
              left={0} 
              bottom={`calc(-4vw + ${leftPlanePosition}px)`}
              width="40vw" 
              height="40vw"
              transition="all 0.5s ease"
              zIndex={2}
              sx={{
                "@media screen and (max-width: 768px)": {
                  width: "75vw",
                  height: "75vw",
                  bottom: "auto",
                  top: "15vw"
                }
              }}
            >
              <img 
                src="/spacepi/left-plane.png"
                alt="Left Plane"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  animation: "float-1 6s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite",
                  filter: "drop-shadow(0px 0px 15px rgba(25, 251, 155, 0.3))"
                }}
              />
            </Box>
            
            {/* 右侧飞船 */}
            <Box 
              position="absolute" 
              right={0} 
              bottom={`calc(0px + ${rightPlanePosition}px)`}
              width="40vw" 
              height="40vw"
              transition="all 0.5s ease"
              zIndex={2}
              sx={{
                "@media screen and (max-width: 768px)": {
                  width: "75vw",
                  height: "75vw",
                  bottom: "-20vw"
                }
              }}
            >
              <img 
                src="/spacepi/right-plane.png"
                alt="Right Plane"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  animation: "float-2 7s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite",
                  filter: "drop-shadow(0px 0px 15px rgba(153, 69, 255, 0.3))"
                }}
              />
            </Box>
          </Box>
        </HomeBgBox>
        
        <IndexBox style={{ marginTop: '0', marginBottom: '3rem' }}>
          <W1400>
            <P166>
              <HomeBox>
                <HomeContainerBox style={{ zIndex: 2 }}>
                  {/* 使用PiWar组件添加多边形旋转动画效果 */}
                  <Box
                    transition="transform 0.5s ease-in-out"
                    _hover={{ transform: "scale(1.05)" }}
                  >
                    <PiWar>
                      <Box className="pi-war-home-logo">
                        <Box className="logo-1">
                          <img 
                            src="/spacepi/spacepi-sol.png"
                            alt="SpacePi Logo" 
                            style={{ 
                              width: "100%", 
                              height: "auto",
                              objectFit: "contain",
                              filter: "drop-shadow(0px 0px 15px rgba(153, 69, 255, 0.4))"
                            }}
                          />
                        </Box>
                      </Box>
                    </PiWar>
                  </Box>
                  
                  <HomeBntBox
                    style={{
                      width: '-webkit-fill-available',
                      flexFlow: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <Box as="span" className="title" style={{ marginTop: -26, fontFamily: "EDIX, sans-serif", fontSize: "75px", fontWeight: 800, lineHeight: "1.2em", letterSpacing: "0px", textShadow: "0px 1px 2px rgba(0, 0, 0, 0.7)", color: "#fff" }}>
                      SPACE<Box as="span" sx={{ background: "linear-gradient(90deg, #19FB9B 0%, #9945FF 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "none" }}>PI</Box>
                    </Box>

                    <AddressTextBox
                      style={{
                        textAlign: 'center',
                        marginTop: -10,
                        color: '#CEDAFF'
                      }}
                    >
                      {t(`SpaceX & Pi Network's Meme`)}
                    </AddressTextBox>
                    
                    <Box
                      maxWidth="700px"
                      textAlign="center"
                      mt={2}
                      mb={3}
                      px={4}
                      color="rgba(206, 218, 255, 0.9)"
                      fontSize={{ base: "sm", md: "md" }}
                      lineHeight="1.6"
                    >
                      As a vital component of the Pi Network ecosystem, SpacePi is driving Pi Network's global development through innovative community-driven mechanisms and technological applications. We leverage strong community consensus and technical innovation to continuously enhance Pi Network's use cases and ecosystem value.
                    </Box>
                    
                    <Box style={{ display: "none" }}>
                      <ContractAddress address={utils.contractAddress} />
                    </Box>
                  </HomeBntBox>
                  <HomeBntBox style={{ marginTop: 0, gap: isMobile ? 8 : 12 }}>
                    <a href={utils.x.url} target="_blank" style={{ width: isMobile ? "calc(50% - 4px)" : "auto" }}>
                      <Button type="primary">{utils.x.name}</Button>
                    </a>
                    <Box style={{ display: "none" }}>
                      <a href={utils.tg.url} target="_blank" style={{ width: isMobile ? "calc(50% - 4px)" : "auto" }}>
                        <Button type="border">{utils.tg.name}</Button>
                      </a>
                    </Box>
                  </HomeBntBox>
                </HomeContainerBox>
              </HomeBox>
            </P166>
          </W1400>
        </IndexBox>
      </Box>
    </>
  );
} 