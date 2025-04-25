# Pi.Sale - Pi Network MEME代币发射平台

Pi.Sale是一个专注于Pi Network社区生态的MEME代币发射平台，旨在为Pi用户提供一站式代币创建、部署与交易的轻量化平台，鼓励社区创意、内容共创与自由流通。

## 技术栈

- **前端框架**: Next.js 15.2.4+
- **语言**: TypeScript 5+
- **UI组件库**: Chakra UI 2.8.0+
- **状态管理**: Redux Toolkit 2.6.1+
- **包管理工具**: Yarn
- **样式解决方案**: Tailwind CSS 4+
- **区块链集成**: Solana Web3.js 1.98.0+, SPL Token

## 功能特性

- 代币铸造管理与部署
- 多种代币发行模式（FairMint）
- 代币市场浏览与搜索
- 代币交换功能 (Swap)
- 多种部署模式选择（快速模式/标准模式）
- 国际化支持 (i18n)
- 多链支持 (Pi Network, Solana)
- 响应式设计，适配多种设备

## 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/your-username/pis-web-v2.git
cd pis-web-v2
```

2. 安装依赖

```bash
yarn install
```

3. 配置环境变量
   复制 `.env.development` 为 `.env.local` 并根据需要进行修改

4. 运行开发服务器

```bash
yarn dev
```

5. 构建生产版本

```bash
yarn build
```

6. 启动生产服务器

```bash
yarn start
```

## 项目结构

```
pis-web-v2/
├── src/
│   ├── app/          # 页面路由和布局
│   │   ├── api/      # API 路由
│   │   ├── market/   # 市场页面
│   │   ├── mint/     # 铸造页面
│   │   ├── swap/     # 交换页面
│   │   ├── deploy/   # 部署页面
│   │   └── [address]/# 代币详情页面
│   ├── components/   # 可复用组件
│   ├── contexts/     # React上下文
│   ├── hooks/        # 自定义React钩子
│   ├── store/        # Redux状态管理
│   ├── theme/        # 主题配置
│   ├── mock/         # 模拟数据
│   ├── utils/        # 工具函数
│   ├── types/        # TypeScript类型定义
│   └── web3/         # 区块链交互
│       └── fairMint/ # 公平铸造相关功能
├── public/           # 静态资源
└── ...
```

## 区块链集成

项目支持多个区块链网络：

1. **Pi Network** - 主要针对Pi Network生态系统
2. **Solana** - 利用Solana网络进行代币发行和交互

相关代码位于 `src/web3` 目录中，包含：
- 智能合约接口定义 (IDL)
- 交易构建和签名
- 链上数据读取和状态管理

## 国际化支持

项目使用i18next实现国际化，支持多语言切换功能。相关配置位于 `src/app/i18n` 目录。

## 部署说明

此项目可以部署在任何支持Node.js的环境中：
- **推荐**: Vercel, Netlify
- **其他选项**: AWS, Digital Ocean, Azure等

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

MIT

## 联系我们

- 电子邮件: contact@pi.sale
- 网站: [https://pi.sale](https://pi.sale)
- 社区: [Pi Network](https://minepi.com)
