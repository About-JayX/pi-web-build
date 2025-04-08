import { mintingTokensPi, mintingTokensSol } from "@/mock";

// 添加 generateStaticParams 函数来支持静态生成
export async function generateStaticParams() {
  // 合并两个网络的所有代币，以支持所有路由
  const allTokens = [...(mintingTokensPi || []), ...(mintingTokensSol || [])];
  return allTokens.map((token) => ({
    address: token.contractAddress || token.id.toString(),
  }));
}

export default function MintAddressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
