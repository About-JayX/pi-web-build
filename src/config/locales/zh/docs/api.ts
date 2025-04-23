export default {
  // API文档页面
  'apiDocs': 'API文档',
  'apiIntroduction': 'API简介',
  'authentication': '认证',
  'tokenEndpoints': '代币端点',
  'marketEndpoints': '市场端点',
  'deployEndpoints': '部署端点',
  
  // API文档内容结构部分
  'apiVersion': 'API版本',
  'currentVersion': '当前版本',
  'baseUrl': '基础URL',
  'requestFormat': '请求格式',
  'responseFormat': '响应格式',
  'errorCodes': '错误代码',
  'rateLimit': '请求限制',
  'authenticationMethod': '认证方法',
  'authDescription': '所有API请求必须包含您的API密钥作为请求头的一部分。您可以在个人设置页面生成API密钥。',
  'apiKeyInstruction': '您可以在Pi.Sale平台的账户设置中获取您的API密钥。',
  'apiDescriptionText': 'Pi.Sale API 允许开发者与 Pi.Sale 平台交互，获取代币数据、部署代币合约，以及访问市场信息。本文档提供了所有可用 API 的详细信息。',
  'apiStatus': '状态',
  'apiStatusStable': '稳定',
  'rateLimitDescription': 'API 请求限制为每分钟 60 次。如果超过限制，您将收到 429 响应状态码。',
  
  // 端点描述
  'endpointTitle': '端点',
  'endpointDescription': '描述',
  'endpointMethod': '方法',
  'endpointExample': '示例',
  'requestParameters': '请求参数',
  'responseFields': '响应字段',
  'parameterName': '参数名',
  'parameterType': '类型',
  'parameterRequired': '必填',
  'parameterDescription': '描述',
  'fieldName': '字段名',
  'fieldType': '类型',
  'fieldDescription': '描述',
  'pageParamDesc': '页码 (默认: 1)',
  'limitParamDesc': '每页数量 (默认: 20, 最大: 100)',
  'sortParamDesc': '排序字段 (可选: created_at, name, symbol, market_cap)',
  'orderParamDesc': '排序方向 (可选: asc, desc)',
  'tokenIdParamDesc': '代币ID (可选)',
  'requestBodyTitle': '请求体',
  'exampleTokenName': '示例代币',
  'exampleTokenDesc': '这是一个示例代币',
  
  // 示例请求和响应
  'requestExample': '请求示例',
  'responseExample': '响应示例',
  'codeSnippet': '代码片段',

  // 代币相关端点
  'listTokensEndpoint': '获取代币列表',
  'listTokensDesc': '获取所有可用的代币列表',
  'getTokenDetailsEndpoint': '获取代币详情',
  'getTokenDetailsDesc': '获取指定代币的详细信息',
  'getTokenHoldersEndpoint': '获取代币持有者',
  'getTokenHoldersDesc': '获取指定代币的持有者列表',
  
  // 市场相关端点
  'getMarketOverviewEndpoint': '获取市场概览',
  'getMarketOverviewDesc': '获取市场整体数据和统计信息',
  'getTokenPriceEndpoint': '获取代币价格',
  'getTokenPriceDesc': '获取指定代币的实时价格信息',
  'getMarketHistoryEndpoint': '获取市场历史',
  'getMarketHistoryDesc': '获取历史市场数据和趋势',
  'getMarketTradesEndpoint': '获取最近交易记录',
  
  // 部署相关端点
  'createTokenEndpoint': '部署代币',
  'createTokenDesc': '创建新的代币项目',
  'deployTokenEndpoint': '部署代币',
  'deployTokenDesc': '将已创建的代币部署到区块链上',
  'getDeployStatusEndpoint': '获取部署状态',
  'getDeployStatusDesc': '获取指定代币部署过程的当前状态',
  
  // SDK和集成
  'sdkIntegration': 'SDK & 集成',
  'sdkDescription': 'Pi.Sale 提供了多种编程语言的SDK，方便开发者集成我们的API：',
  'javascriptSdk': 'JavaScript SDK',
  'pythonSdk': 'Python SDK',
  'javaSdk': 'Java SDK',
}; 