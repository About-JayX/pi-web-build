"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
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
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { css, Global } from "@emotion/react";
import dynamic from "next/dynamic";

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
      gap: "22px",
      "& a": {
        flex: 1,
        gap: "8px",
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

  a {
    color: #fff !important;
    text-decoration: none;
  }
`;

// 合作伙伴数据
const partners = [
  { img: "/xpi/partners/dexscreener.png", url: "https://dexscreener.com" },
  { img: "/xpi/partners/gmgn.png", url: "https://gmgn.io" },
  { img: "/xpi/partners/pump.png", url: "https://pump.fun" },
  { img: "/xpi/partners/BMX.png", url: "https://bmx.io" },
  { img: "/xpi/partners/avedex.png", url: "https://ave.ai" },
  { img: "/xpi/partners/coingecko.svg", url: "https://coingecko.com" },
  { img: "/xpi/partners/coinmarketcap.svg", url: "https://coinmarketcap.com" },
];

// 工具函数和链接
const utils = {
  contractAddress: "0x1234567890123456789012345678901234567890", 
  x: {
    name: "Twitter",
    url: "https://twitter.com/xpi_official",
  },
  tg: {
    name: "Telegram",
    url: "https://t.me/xpi_official",
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
  return (
    <Box 
      className="contract-address"
      width="-webkit-fill-available"
      display="flex"
      justifyContent="center"
    >
      <Box
        className="container"
        display="grid"
        gridTemplateColumns="1fr 30px"
        alignItems="center"
        width={{ base: "-webkit-fill-available", md: "400px" }}
        borderRadius="6px"
        borderTop="0.5px solid #6366f1"
        borderRight="2px solid #6366f1"
        borderBottom="0.5px solid #6366f1"
        borderLeft="2px solid #6366f1"
        background="rgba(0, 0, 0, 0.4)"
        backdropFilter="blur(5px)"
        padding="10px 16px"
        paddingRight="12px"
        fontSize="18px"
        fontWeight={600}
        color="#fff"
        cursor="pointer"
        onClick={() => navigator.clipboard.writeText(address || '')}
        _hover={{
          opacity: 0.95
        }}
      >
        <Text 
          fontFamily="Space-Grotesk, monospace" 
          isTruncated 
          flex="1"
          width="100%"
          textAlign="left"
          wordBreak="keep-all"
        >
          {address}
        </Text>
        <Box 
          className="copy-icon" 
          background="linear-gradient(90deg, #9747FE 0%, #1973FB 100%)"
          color="white"
          borderRadius="6px"
          padding="4px"
          width="30px"
          height="30px"
          transition="all 0.5s ease-in-out"
          _hover={{
            transform: "scale(1.1)"
          }}
        >
          <svg viewBox="0 0 16 16" fill="#fff" width="100%" height="100%">
            <path d="M4.00029 12.6667H12.0003V4.66667H4.00029V12.6667ZM4.00029 14C3.26696 14 2.66696 13.4 2.66696 12.6667V4.66667C2.66696 3.93333 3.26696 3.33333 4.00029 3.33333H12.0003C12.7336 3.33333 13.3336 3.93333 13.3336 4.66667V12.6667C13.3336 13.4 12.7336 14 12.0003 14H4.00029ZM6.00029 2H13.3336C14.0703 2 14.6703 2.6 14.6703 3.33333V10.6667H13.3336V3.33333H6.00029V2Z"/>
          </svg>
        </Box>
      </Box>
    </Box>
  );
}

export default function XpiPage() {
  const { t } = useTranslation();
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // 动态导入 JSON 数据
    fetch('/xpi/data.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch(err => console.error("Error loading animation data:", err));
  }, []);

  return (
    <>
      <Head>
        <style>{globalStyles}</style>
        <title>xPI</title>
        <meta name="description" content="xPI - Next Generation Protocol" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
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

                    <Image 
                      src="/xpi/pisol.png" 
                      style={{ width: '100%', maxWidth: '420px' }} 
                      alt="xPI" 
                    />

                    <AddressTextBox
                      style={{
                        textAlign: 'center',
                        marginTop: -10,
                        color: '#CEDAFF'
                      }}
                    >
                      {t('合约地址')}
                    </AddressTextBox>
                    <ContractAddress address={utils.contractAddress} />
                  </HomeBntBox>
                  <HomeBntBox style={{ marginTop: 0, gap: 12 }}>
                    <Box as="a" href={utils.x.url} target="_blank" rel="noopener noreferrer">
                      <Button 
                        colorScheme="twitter" 
                        variant="solid"
                        fontWeight="normal"
                        height="40px"
                        borderRadius="4px"
                        px={6}
                        py={4}
                        fontFamily="Space-Grotesk, sans-serif"
                        _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                        transition="all 0.3s ease"
                        className="primary-button"
                        sx={{
                          background: "linear-gradient(90deg, #336BFE 0%, #0EBAFD 100%)",
                          boxShadow: "0 0 10px rgba(51, 107, 254, 0.5)",
                          border: "none",
                          color: "#fff"
                        }}
                      >{utils.x.name}</Button>
                    </Box>
                    <Box as="a" href={utils.tg.url} target="_blank" rel="noopener noreferrer">
                      <Button 
                        variant="outline" 
                        colorScheme="blue"
                        fontWeight="normal"
                        height="40px"
                        borderRadius="4px"
                        px={6}
                        py={4}
                        fontFamily="Space-Grotesk, sans-serif"
                        _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                        transition="all 0.3s ease"
                        className="border-button"
                        sx={{
                          borderColor: "#336BFE",
                          color: "#fff",
                          boxShadow: "0 0 10px rgba(51, 107, 254, 0.3)"
                        }}
                      >{utils.tg.name}</Button>
                    </Box>
                  </HomeBntBox>
                  <Flex 
                    gap={3} 
                    flexWrap="wrap" 
                    justifyContent="center" 
                    mt={2} 
                    className="partners-container"
                    sx={{
                      marginTop: "16px"
                    }}
                  >
                    {partners.map((partner, index) => (
                      <Box
                        key={index}
                        as="a"
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="partner-item"
                        sx={{
                          width: "56px",
                          height: "56px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(8px)",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          padding: "8px",
                          borderWidth: "2px 2px 0.5px 0.5px",
                          borderColor: "#6366f1",
                          transition: "all 0.5s ease",
                          _hover: { transform: "scale(1.1)" }
                        }}
                      >
                        <Image 
                          src={partner.img} 
                          alt={`Partner ${index + 1}`}
                          className="aspect-square" 
                          width="100%"
                          height="100%"
                          objectFit="contain"
                        />
                      </Box>
                    ))}
                  </Flex>
                </HomeContainerBox>
              </HomeBox>
            </P166>
          </W1400>
        </IndexBox>
      </Box>
    </>
  );
} 