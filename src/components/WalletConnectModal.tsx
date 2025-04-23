"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Flex,
  useColorModeValue,
  Divider,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserAPI } from "@/api";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { useSolana } from "@/contexts/solanaProvider";

// 支持的钱包类型
export type WalletType = "phantom" | "solflare" | "okx" | "bitget";

// 格式化钱包地址，显示前6位和后6位
const formatWalletAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

// 钱包配置
const WALLETS = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "/wallet-icons/phantom.png",
    downloadUrl: "https://phantom.app",
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "/wallet-icons/solflare.png",
    downloadUrl: "https://solflare.com",
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "/wallet-icons/okx.png",
    downloadUrl: "https://web3.okx.com/",
  },
  {
    id: "bitget",
    name: "Bitget Wallet",
    icon: "/wallet-icons/bitget.png",
    downloadUrl: "https://web3.bitget.com",
  },
];

// 钱包连接弹窗属性
interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (publicKey: string) => void;
}

const WalletConnectModal = ({ 
  isOpen, 
  onClose, 
  onConnect 
}: WalletConnectModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const { setPublicKey, setWalletType } = useSolana();

  // 颜色设置
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  // 连接钱包
  const connectWallet = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    setIsConnecting(true);

    try {
      let wallet: any;

      // 检查并获取对应的钱包实例
      switch (walletType) {
        case "phantom":
          wallet = window.solana;
          break;
        case "solflare":
          wallet = window.solflare;
          break;
        case "okx":
          wallet = window.okxwallet;
          break;
        case "bitget":
          wallet = window.bitkeep;
          break;
        default:
          throw new Error(t("walletNotSupported"));
      }

      // 检查钱包是否已安装
      if (!wallet) {
        // 获取下载链接
        const downloadUrl = WALLETS.find(w => w.id === walletType)?.downloadUrl;
        
        toast({
          title: t("walletNotInstalled"),
          description: (
            <Box color="white">
              <Text mb={2} fontWeight="bold" fontSize="md" color="white">{t("pleaseInstallWallet", { wallet: WALLETS.find(w => w.id === walletType)?.name })}</Text>
              <Button 
                as="a" 
                href={downloadUrl} 
                target="_blank" 
                size="sm" 
                colorScheme="whiteAlpha"
              >
                {t("downloadWallet")}
              </Button>
            </Box>
          ),
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
          variant: "solid",
          colorScheme: "blue",
        });
        setIsConnecting(false);
        return;
      }

      // 连接钱包
      const result = await wallet.connect();
      const publicKey = result.publicKey.toString();

      // 执行登录流程
      try {
        const message = "Hello from PiSale!";
        const encodedMessage = new TextEncoder().encode(message);
        const signed = await wallet.signMessage(encodedMessage, "utf8");
        const signatureBytes = new Uint8Array(signed.signature);

        const loginResult = await UserAPI.loginWithSolana({
          publicKey,
          message,
          signature: Array.from(signatureBytes),
          code: "K7QEISU9",
        });

        if (loginResult.data) {
          // 保存用户基本信息到localStorage
          localStorage.setItem("userId", loginResult.data.user.userId.toString());
          localStorage.setItem("nickname", loginResult.data.user.nickname || "用户");
          localStorage.setItem("avatar_url", loginResult.data.user.avatar_url || "");
          localStorage.setItem("wallet_type", walletType); // 保存所使用的钱包类型

          // 设置钱包类型到上下文
          setWalletType(walletType);
          
          // 设置公钥到上下文
          setPublicKey(publicKey);

          // 更新Redux状态
          dispatch(
            setUser({
              user: loginResult.data.user,
              authToken: loginResult.data.authToken,
            })
          );

          // 通知父组件连接成功
          onConnect(publicKey);

          // 显示成功消息
          toast({
            title: t("connectSuccess"),
            description: t("connectedWallet", { 
              address: formatWalletAddress(publicKey)
            }),
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });

          // 关闭弹窗
          onClose();
        }
      } catch (signError: any) {
        console.error("消息签名失败:", signError);
        
        // 检查是否是用户拒绝签名
        if (
          signError.message &&
          (signError.message.includes("User rejected") ||
           signError.message.includes("用户拒绝") ||
           signError.message.includes("cancelled") ||
           signError.message.includes("取消"))
        ) {
          toast({
            title: t("operationCancelled"),
            description: t("signCancelled"),
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          toast({
            title: t("signError"),
            description: t("signFailed"),
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      }
    } catch (connectError: any) {
      console.error("钱包连接失败:", connectError);
      
      // 检查是否是用户拒绝连接
      if (
        connectError.message &&
        (connectError.message.includes("User rejected") ||
         connectError.message.includes("用户拒绝") ||
         connectError.message.includes("cancelled") ||
         connectError.message.includes("取消"))
      ) {
        toast({
          title: t("connectError"),
          description: t("connectCancelled"),
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: t("connectError"),
          description: t("connectFailed"),
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent 
        bg={bgColor} 
        borderRadius="xl" 
        borderWidth="1px" 
        borderColor={borderColor}
        maxW="400px"
        overflow="hidden"
      >
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor} py={4}>
          {t("connectWalletTitle")}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={6}>
          <Text mb={6} fontSize="sm" color="gray.500">
            {t("chooseWalletDescription")}
          </Text>
          
          <VStack spacing={3} align="stretch">
            {WALLETS.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                justifyContent="flex-start"
                h="60px"
                borderRadius="lg"
                borderColor={borderColor}
                borderWidth="1px"
                onClick={() => connectWallet(wallet.id as WalletType)}
                isLoading={isConnecting && selectedWallet === wallet.id}
                _hover={{ bg: hoverBgColor }}
                position="relative"
                overflow="hidden"
              >
                <HStack spacing={4} width="100%">
                  <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    boxSize="32px"
                    objectFit="contain"
                  />
                  <Text fontWeight="600">{wallet.name}</Text>
                </HStack>
              </Button>
            ))}
          </VStack>
          
          <Text mt={6} fontSize="xs" color="gray.500" textAlign="center">
            {t("walletDisclaimerText")}
          </Text>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor={borderColor} py={3}>
          <Text fontSize="xs" color="gray.500">
            {t("newToSolana")}{" "}
            <Button
              as="a"
              href="https://solana.com"
              target="_blank"
              variant="link"
              colorScheme="purple"
              fontSize="xs"
            >
              {t("getWallet")}
            </Button>
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WalletConnectModal; 