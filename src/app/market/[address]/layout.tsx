// import { mintingTokensPi, mintingTokensSol } from "@/mock";

// 添加 generateStaticParams 函数来支持静态生成
export async function generateStaticParams() {
  return [];
}

export default function MintAddressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
