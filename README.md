# Pi.Sale - Pi Network MEME代币发射平台

Pi.Sale是一个专注于Pi Network社区生态的MEME代币发射平台，旨在为Pi用户提供一站式代币创建、部署与交易的轻量化平台，鼓励社区创意、内容共创与自由流通。

## 技术栈

- **前端框架**: Next.js 14+
- **语言**: TypeScript
- **UI组件库**: Chakra UI
- **包管理工具**: Yarn
- **样式解决方案**: Tailwind CSS

## 功能特性

- 代币铸造管理
- 铸造中的代币展示
- 代币市场浏览与搜索
- 多种部署模式选择（快速模式/标准模式）
- 响应式设计，适配多种设备

## 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/your-username/pi-sale-web.git
cd pi-sale-web
```

2. 安装依赖

```bash
yarn install
```

3. 运行开发服务器

```bash
yarn dev
```

4. 构建生产版本

```bash
yarn build
```

5. 启动生产服务器

```bash
yarn start
```

## 项目结构

```
pi-sale-web/
├── src/
│   ├── app/         # 页面路由
│   ├── components/  # 可复用组件
│   ├── theme/       # 主题配置
│   ├── mock/        # 模拟数据
│   ├── utils/       # 工具函数
│   └── types/       # TypeScript类型定义
├── public/          # 静态资源
└── ...
```

## 模拟数据

项目中的模拟数据位于 `src/mock` 目录，结构如下：

```
mock/
├── index.ts        # 导出所有模拟数据
├── tokens.ts       # 代币基本信息
├── market.ts       # 市场相关数据
├── minting.ts      # 铸造中的代币数据
├── stats.ts        # 平台统计数据
└── types.ts        # 数据类型定义
```

要替换模拟数据为真实的API数据，可以：

1. 保持相同的数据结构
2. 创建API服务，替换对应的模拟数据文件
3. 更新导入路径，从API服务获取数据

## 部署说明

此项目可以部署在任何支持Node.js的环境中，如Vercel、Netlify、AWS、Digital Ocean等。

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
