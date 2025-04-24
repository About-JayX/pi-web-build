/**
 * API 配置文件
 * 
 * 用于管理不同环境下的API地址
 * 
 * 主API:
 * 开发环境: https://fairmint.piweb3.xyz/api
 * 生产环境: https://mint.pi.sale/api
 * 
 * 用户API:
 * 开发环境: https://memestestspace.dexcc.cc
 * 生产环境: 根据配置（默认同开发环境）
 * 
 * 通过环境变量 NEXT_PUBLIC_API_ENV 进行切换:
 * - development: 开发环境
 * - production: 生产环境
 * 
 * 或直接通过环境变量指定完整的API地址:
 * - NEXT_PUBLIC_API_URL: 主API地址
 * - NEXT_PUBLIC_USER_API_URL: 用户API地址
 */

// 预定义的API环境
export const API_ENVIRONMENTS = {
  // 开发环境
  development: {
    baseUrl: 'https://fairmint.piweb3.xyz/api',
    userApiUrl: 'https://memestestspace.dexcc.cc',
    timeout: 10000,
    userApiTimeout: 15000,
  },
  // 生产环境
  production: {
    baseUrl: 'https://mint.pi.sale/api',
    userApiUrl: 'https://market.pi.sale', // 默认与开发环境相同，可以在.env.production中覆盖
    timeout: 15000,
    userApiTimeout: 15000,
  },
};

// 当前环境，默认为development
export const currentEnv = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_ENV) || 'development';

// 从环境变量读取API URL（如果存在）或使用预定义环境的URL
export const API_BASE_URL = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || 
  API_ENVIRONMENTS[currentEnv]?.baseUrl || 
  API_ENVIRONMENTS.development.baseUrl;

// 从环境变量读取用户API URL（如果存在）或使用预定义环境的URL
export const USER_API_URL = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_USER_API_URL) || 
  API_ENVIRONMENTS[currentEnv]?.userApiUrl || 
  API_ENVIRONMENTS.development.userApiUrl;

// 从环境变量读取超时设置（如果存在）或使用预定义环境的超时设置
export const API_TIMEOUT = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_TIMEOUT) ? 
  parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) : 
  API_ENVIRONMENTS[currentEnv]?.timeout || 
  API_ENVIRONMENTS.development.timeout;

// 从环境变量读取用户API超时设置（如果存在）或使用预定义环境的超时设置
export const USER_API_TIMEOUT = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_USER_API_TIMEOUT) ? 
  parseInt(process.env.NEXT_PUBLIC_USER_API_TIMEOUT) : 
  API_ENVIRONMENTS[currentEnv]?.userApiTimeout || 
  API_ENVIRONMENTS.development.userApiTimeout;

// 导出配置
export default {
  baseUrl: API_BASE_URL,
  userApiUrl: USER_API_URL,
  timeout: API_TIMEOUT,
  userApiTimeout: USER_API_TIMEOUT,
  currentEnv,
}; 