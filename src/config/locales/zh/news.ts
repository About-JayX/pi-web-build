export default {
  // 页面文本
  'title': '平台公告与更新',
  'noData': '暂无公告内容',
  
  // 筛选器
  'filter.all': '全部公告',
  'filter.feature': '新功能',
  'filter.update': '更新',
  'filter.maintenance': '维护',
  
  // 标签（可复用筛选器文本）
  
  // 公告数据
  'data': JSON.stringify([
    {
      id: '001',
      date: '2025-04-10',
      type: 'feature',
      titleKey: 'post.beta.title',
      contentKey: 'post.beta.content'
    },
    {
      id: '002',
      date: '2025-04-05',
      type: 'update',
      titleKey: 'post.mint.title',
      contentKey: 'post.mint.content'
    },
    {
      id: '003',
      date: '2025-04-01',
      type: 'maintenance',
      titleKey: 'post.maintain.title',
      contentKey: 'post.maintain.content'
    }
  ]),
  
  // 公告内容
  'post.beta.title': 'Pi.Sale 平台测试版发布',
  'post.beta.content': 'Pi.Sale 平台测试版现已正式发布。本版本仅供测试使用，所有数据均为模拟演示，不代表实际情况。\n\n用户可探索平台功能并提供反馈意见，协助改进用户体验。',
  
  'post.mint.title': '铸造流程优化',
  'post.mint.content': 'Pi.Sale 平台铸造功能已完成多项技术优化：\n\n- 简化代币创建流程\n- 增强自定义选项\n- 提升错误处理机制\n- 加快交易处理速度\n\n此次优化旨在提高平台使用效率与用户体验。',
  
  'post.maintain.title': '系统维护通知',
  'post.maintain.content': 'Pi.Sale 平台将进行系统维护，以提升服务性能和稳定性。\n\n维护期间，平台服务可能出现短暂中断。对由此带来的不便，敬请谅解。\n\n维护时间：2025年4月15日，UTC时间2:00-5:00。',
}; 