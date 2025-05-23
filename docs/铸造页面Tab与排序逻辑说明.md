# 铸造页面Tab与排序逻辑说明

## 一、Tab分类与功能

铸造页面共有四个主要Tab分类，每个Tab对应不同的代币筛选方式：

| Tab索引 | Tab名称 | 类别参数 | 功能说明 |
|---------|---------|----------|----------|
| 0 | 热门铸造 | category=hot | 显示当前热门的代币铸造项目，默认按铸造进度降序排列 |
| 1 | 所有代币 | 无category参数 | 显示所有代币项目，默认按铸造进度降序排列 |
| 2 | 最新部署 | category=latest | 显示最新发布的代币项目，默认按部署时间降序排列 |
| 3 | 铸造结束 | category=completed | 显示已完成铸造的代币项目，默认按部署时间降序排列 |

### Tab切换逻辑

1. **用户偏好记忆**：系统会记住用户上次选择的Tab索引，存储在localStorage中的`mint_tab_index`键下
2. **不同Tab的默认排序**：
   - 热门铸造：默认按`progress`（进度）降序排列
   - 所有代币：默认按`progress`（进度）降序排列
   - 最新部署：无默认排序（按API返回顺序，通常是按部署时间降序）
   - 铸造结束：默认按`deployAt`（部署时间）降序排列

### Tab筛选规则

1. **热门铸造Tab**：
   - 包含`category=hot`参数
   - 会筛选掉持有人数量小于2的项目
   - 只显示总供应量为314,000,000或1,000,000,000的正式项目

2. **所有代币Tab**：
   - 无特定category参数
   - 只显示总供应量为314,000,000或1,000,000,000的正式项目
   - 在测试环境下也会显示总供应量为1,000,000的测试项目

3. **最新部署Tab**：
   - 包含`category=latest`参数
   - 只显示总供应量为314,000,000或1,000,000,000的正式项目

4. **铸造结束Tab**：
   - 包含`category=completed`参数
   - 只显示总供应量为314,000,000或1,000,000,000的正式项目

## 二、排序逻辑

### 可排序列

铸造页面支持以下排序字段：

| 排序字段 | 说明 | 默认排序方向 | 用途 |
|---------|------|------------|------|
| progress | 代币铸造进度 | DESC（降序） | 用户可以优先查看接近完成的铸造项目 |
| target | 目标铸造金额 | DESC（降序） | 按项目规模大小排序，查看大型代币项目 |
| raised | 已筹集金额 | DESC（降序） | 查看已筹集资金多的热门项目 |
| minterCounts | 代币持有人数量 | DESC（降序） | 了解社区参与度和项目受欢迎程度 |
| deployAt | 代币部署时间 | DESC（降序） | 查看最新上线或最早部署的项目 |

### 排序菜单与展示

排序菜单位于页面上方，根据当前所选Tab有不同的默认显示：
- **热门铸造Tab**：默认显示"铸造进度"
- **所有代币Tab**：默认显示"铸造进度"
- **最新部署Tab**：默认显示"部署时间"
- **铸造结束Tab**：默认显示"部署时间"

菜单中的每个选项在被选中时都会显示当前的排序方向指示器（向上/向下箭头）。

### 排序状态管理

1. **排序状态**：
   - `sortColumn`：当前排序的列名
   - `sortDirection`：当前排序方向，'ASC'（升序）或'DESC'（降序）

2. **排序切换逻辑**：
   - 当用户点击已经是降序排列的列时，会切换为升序
   - 当用户点击其他列时，默认使用降序排列

3. **Tab切换时的排序重置**：
   - 切换到不同Tab时，排序字段会重置为该Tab的默认排序字段
   - 排序方向一般重置为'DESC'（降序）

### 排序API请求参数

排序请求参数构建方式：

```typescript
const params = {
  page: currentPage,
  limit: pageSize,
  order: sortDirection.toUpperCase(), // 'ASC'或'DESC'
  sort_by: sortColumn,
  ...(category && { category }), // 根据当前Tab添加category参数
};
```

### 特殊处理

1. **最新部署Tab**：
   - 当`sortColumn`为空字符串时，菜单仍显示"部署时间"
   - 这是因为API默认会按部署时间排序，无需显式指定

2. **排序状态保存**：
   - 用户的排序选择不会被保存到本地存储
   - 每次切换Tab或刷新页面时会重置为默认排序

## 三、性能优化策略

为了避免重复请求和提升用户体验，系统实现了多项优化策略：

### 1. 状态缓存与防抖

1. **会话参数缓存**：
   - 使用`sessionStorage`存储上一次的请求参数
   - 请求参数相同时不重复发起请求

2. **操作标记**：
   - 使用`tabChangeInProgress`等标记跟踪UI操作状态
   - Tab切换和排序操作时防止触发额外的数据请求

3. **防抖请求**：
   - 使用延时处理（setTimeout）确保UI状态更新完成后再发起请求
   - 防止Tab切换或排序操作过快导致的重复请求

### 2. 用户体验优化

1. **用户偏好记忆**：
   - 记住用户的视图模式（卡片/列表），存储在`mint_view_mode`
   - 记住用户的每页显示数量，存储在`mint_page_size`
   - 记住用户的最后选择的Tab，存储在`mint_tab_index`

2. **自动滚动**：
   - 数据加载前后自动滚动到页面顶部，提升用户体验
   - 使用`scrollToTop`函数确保页面位置一致

3. **响应式设计**：
   - 在移动设备上强制使用卡片视图，提升移动端用户体验
   - 根据屏幕尺寸自动调整布局和展示方式

## 四、数据请求流程

### 1. Tab切换时的数据请求流程

```
用户点击Tab
↓
设置tabChangeInProgress标记，防止重复请求
↓
更新Tab索引和排序字段
↓
构建请求参数
↓
清空当前数据，显示加载状态
↓
发起API请求
↓
请求完成后重置标记
↓
展示新数据
```

### 2. 排序操作时的数据请求流程

```
用户点击排序列
↓
设置sortingInProgress标记，防止重复请求
↓
计算新的排序方向
↓
更新排序状态
↓
构建请求参数
↓
清空当前数据，显示加载状态
↓
发起API请求
↓
请求完成后重置标记
↓
展示新数据
```

## 五、实施建议与注意事项

1. **代码维护建议**：
   - 推荐使用Redux Toolkit的RTK Query替代当前的请求方式，以减少手动状态管理的复杂性
   - 考虑将Tab和排序逻辑提取到独立的自定义Hook中，提高代码复用性

2. **性能注意事项**：
   - 当列表数据量增大时，考虑实现虚拟滚动（Virtual Scrolling）
   - 优先使用服务端排序而非前端排序，以减轻客户端负担

3. **用户体验改进**：
   - 考虑在Tab切换和排序操作时使用骨架屏（Skeleton）替代简单的Spinner
   - 可添加筛选功能，允许用户在各Tab中进一步筛选代币

## 六、常见问题解答（FAQ）

### 1. 为什么Tab切换时会出现短暂的空白页面？

**解答**：Tab切换时会先清空当前数据，显示加载状态，再进行API请求。这是为了避免不同Tab的数据混淆，提高用户体验。如果出现较长时间的空白，可能是网络请求较慢，可以考虑使用骨架屏（Skeleton）替代简单的加载指示器。

### 2. 为什么有些代币在某些Tab中不显示？

**解答**：每个Tab有不同的筛选规则。例如，在热门铸造Tab中，会筛选掉持有人数量小于2的项目，并且只显示特定总供应量的代币。确保代币符合对应Tab的筛选条件。

### 3. 代币排序逻辑如何影响用户体验？

**解答**：默认排序根据每个Tab的特性设计：热门铸造和所有代币Tab默认按进度排序，让用户优先看到接近完成的项目；最新部署Tab显示最新上线的项目；铸造结束Tab按部署时间排序。这种设计让用户能够快速找到感兴趣的代币。

### 4. 列表视图和卡片视图有什么区别？

**解答**：
- **卡片视图**：更直观，显示代币图片和关键信息，适合浏览和发现新代币
- **列表视图**：更紧凑，同时展示更多代币，适合比较和分析不同代币的数据
- 在移动设备上强制使用卡片视图，以提供更好的移动端体验

### 5. 如何避免在开发过程中引入性能问题？

**解答**：
- 遵循现有的参数缓存和防抖机制
- 避免在组件内声明复杂函数，尽量使用useCallback和useMemo优化
- 使用Redux DevTools和React DevTools检测不必要的重渲染和状态变化
- 避免在排序和Tab切换逻辑中引入复杂的前端计算

### 6. API参数如何影响返回的数据？

**解答**：
- **category参数**：决定返回的代币类别（热门、最新、已完成等）
- **sort_by参数**：决定数据的排序字段（进度、部署时间、价格等）
- **order参数**：决定排序方向（升序ASC或降序DESC）
- **page和limit参数**：控制分页，每次加载多少条数据 