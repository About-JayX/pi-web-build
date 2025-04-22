import { mintingTokensPi } from '@/mock';

// 添加 generateStaticParams 函数来支持静态生成
export async function generateStaticParams() {
  // 返回预定义的地址列表，这些将在构建时被预渲染
  return (mintingTokensPi || []).map(token => ({
    address: token.contractAddress || token.id.toString(),
  }));
}

export default function MintPiAddressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 