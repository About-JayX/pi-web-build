import axios, { AxiosError } from 'axios'
import { store } from '@/store'
import apiConfig from './apiConfig'

// API服务器配置 - 从apiConfig获取API URL
const API_URL = apiConfig.baseUrl
const USER_API_URL = apiConfig.userApiUrl

// 创建主实例 (fair mint)
const fairMintInstance = axios.create({
  baseURL: "/api",
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 添加自定义配置到请求对象
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 固定2秒重试

// 创建用户API实例
const userInstance = axios.create({
  baseURL: USER_API_URL,
  timeout: apiConfig.userApiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// fairMint实例请求拦截器
fairMintInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
      console.log(`添加token到fairMint请求:`, config.url)
    }
    return config
  },
  error => Promise.reject(error)
)

// 添加环境信息到日志
console.log(`API环境: ${apiConfig.currentEnv}`)
console.log(`主API URL: ${API_URL}`)
console.log(`用户API URL: ${USER_API_URL}`)

// fairMint实例响应拦截器
fairMintInstance.interceptors.response.use(
  response => {
    // 成功时缓存响应
    if (response.config.method === 'get') {
      try {
        const cacheKey = `api_cache_${response.config.url}`;
        const dataToCache = {
          data: response.data,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
      } catch (err) {
        console.warn('缓存API响应失败:', err);
      }
    }
    return response.data;
  },
  async error => {
    const originalRequest = error.config;
    
    // 为请求添加重试计数器
    if (originalRequest._retryCount === undefined) {
      originalRequest._retryCount = 0;
    }
    
    // 如果是502错误且重试次数未超过限制
    if (
      error.response && 
      error.response.status === 502 && 
      originalRequest._retryCount < MAX_RETRIES
    ) {
      originalRequest._retryCount += 1;
      console.log(`正在重试请求 (${originalRequest._retryCount}/${MAX_RETRIES}): ${originalRequest.url}`);
      
      // 使用固定2秒间隔重试
      console.log(`将在2秒后重试...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      
      // 尝试从缓存获取数据
      if (originalRequest.method === 'get') {
        try {
          const cacheKey = `api_cache_${originalRequest.url}`;
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            const parsedCache = JSON.parse(cachedData);
            // 检查缓存是否过期 (24小时)
            const now = new Date().getTime();
            if (now - parsedCache.timestamp < 24 * 60 * 60 * 1000) {
              console.log('使用缓存的API响应:', originalRequest.url);
              return parsedCache.data;
            }
          }
        } catch (cacheErr) {
          console.warn('读取缓存数据失败:', cacheErr);
        }
      }
      
      // 如果没有缓存或缓存已过期，重新请求
      return fairMintInstance(originalRequest);
    } else if (error.response && error.response.status === 502 && originalRequest._retryCount >= MAX_RETRIES) {
      console.error(`达到最大重试次数 (${MAX_RETRIES})，请求失败: ${originalRequest.url}`);
    }
    
    // 记录请求错误
    handleAxiosError(error);
    
    // 对于GET请求，尝试从缓存获取数据
    if (error.config && error.config.method === 'get') {
      try {
        const cacheKey = `api_cache_${error.config.url}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          console.log('API请求失败，使用缓存数据:', error.config.url);
          return parsedCache.data;
        }
      } catch (cacheErr) {
        console.warn('获取缓存数据失败:', cacheErr);
      }
    }
    
    // 如果没有缓存或不是GET请求，则抛出错误
    return Promise.reject(error);
  }
)

// 用户实例请求拦截器
userInstance.interceptors.request.use(
  config => {
    // 优先从localStorage中获取token，这样在页面刷新后仍能保持登录状态
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
      console.log(`添加token到用户API请求: ${config.url}`)
    } else {
      // 如果localStorage中没有token，尝试从Redux store中获取
      const storeToken = store.getState().user.authToken
      if (storeToken) {
        config.headers.Authorization = storeToken
        console.log(`从Redux添加token到用户API请求: ${config.url}`)
      } else {
        console.log(`未找到token, 发送无认证请求: ${config.url}`)
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// 用户实例响应拦截器
userInstance.interceptors.response.use(
  response => {
    const { data } = response
    console.log(`API响应成功: ${response.config.url}`, data)
    if (!data.success) {
      throw new Error(data.msg || '请求失败')
    }
    return data
  },
  error => {
    handleAxiosError(error)
    return Promise.reject(error)
  }
)

// 统一的错误处理函数
const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    const url = error.config?.url || '未知URL'
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN'
    const params = error.config?.params
      ? JSON.stringify(error.config.params)
      : '{}'
    const status = error.response.status
    const statusText = error.response.statusText || '未知错误'
    const data = error.response.data

    console.error(
      `API错误 [${status} ${statusText}] ${method} ${url} ${params}`,
      data
    )

    switch (error.response.status) {
      case 401:
        console.log('未授权，请重新登录')
        localStorage.removeItem('token')
        break
      case 403:
        console.log('没有权限访问该资源')
        break
      case 404:
        console.log('请求的资源不存在:', url)
        break
      case 500:
        console.log('服务器内部错误:', url)
        console.log('请求参数:', params)
        break
      case 502:
        console.log('网关错误 (502 Bad Gateway):', url)
        console.log('这可能是由于服务器暂时过载或维护引起的')
        console.log('请求参数:', params)
        console.log('响应数据:', data)
        break
      default:
        console.log(`HTTP错误 ${status}:`, statusText)
    }
  } else if (error.request) {
    console.error('网络错误，请检查您的网络连接', error.request)
    console.log('请求URL:', error.config?.url)
    console.log('请求方法:', error.config?.method?.toUpperCase())
    console.log(
      '请求参数:',
      error.config?.params ? JSON.stringify(error.config.params) : '{}'
    )
  } else {
    console.error('请求配置错误:', error.message)
    console.log('请求配置:', error.config)
  }
}

export const fairMintApi = fairMintInstance
export const userApi = userInstance
export default fairMintInstance
