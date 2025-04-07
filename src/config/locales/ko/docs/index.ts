import tutorials from './tutorials';
import api from './api';
import disclaimer from './disclaimer';
import privacy from './privacy';

// Common docs keys
const common = {
  'backToHome': '홈으로 돌아가기',
  'home': '홈',
};

export default {
  ...common,
  ...tutorials,
  ...api,
  ...disclaimer,
  ...privacy,
}; 