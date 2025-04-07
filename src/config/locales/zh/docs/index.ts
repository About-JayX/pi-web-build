import tutorials from './tutorials';
import api from './api';
import disclaimer from './disclaimer';
import privacy from './privacy';

// 通用文档键值对
const common = {
  'backToHome': '返回首页',
  'home': '首页',
};

export default {
  ...common,
  ...tutorials,
  ...api,
  ...disclaimer,
  ...privacy,
}; 