import tutorials from './tutorials';
import api from './api';
import disclaimer from './disclaimer';
import privacy from './privacy';

// Common docs keys
const common = {
  'backToHome': 'Back to Home',
  'home': 'Home',
};

export default {
  ...common,
  ...tutorials,
  ...api,
  ...disclaimer,
  ...privacy,
}; 