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
      console.log(`Token added to fairMint request:`, config.url)
    }
    return config
  },
  error => Promise.reject(error)
)

// 添加环境信息到日志
console.log(`API environment: ${apiConfig.currentEnv}`)
console.log(`Main API URL: ${API_URL}`)
console.log(`User API URL: ${USER_API_URL}`)

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
        console.warn('Failed to cache API response:', err);
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
      console.log(`Retrying request (${originalRequest._retryCount}/${MAX_RETRIES}): ${originalRequest.url}`);
      
      // 使用固定2秒间隔重试
      console.log(`Retrying in 2s...`);
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
              console.log('Using cached API response:', originalRequest.url);
              return parsedCache.data;
            }
          }
        } catch (cacheErr) {
          console.warn('Failed to read cache data:', cacheErr);
        }
      }
      
      // 如果没有缓存或缓存已过期，重新请求
      return fairMintInstance(originalRequest);
    } else if (error.response && error.response.status === 502 && originalRequest._retryCount >= MAX_RETRIES) {
      console.error(`Max retries (${MAX_RETRIES}) reached, request failed: ${originalRequest.url}`);
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
          console.log('API request failed, using cached data:', error.config.url);
          return parsedCache.data;
        }
      } catch (cacheErr) {
        console.warn('Failed to retrieve cached data:', cacheErr);
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
      console.log(`Token added to user API request: ${config.url}`)
    } else {
      // 如果localStorage中没有token，尝试从Redux store中获取
      const storeToken = store.getState().user.authToken
      if (storeToken) {
        config.headers.Authorization = storeToken
        console.log(`Token from Redux added to user API request: ${config.url}`)
      } else {
        console.log(`No token found, sending unauthenticated request: ${config.url}`)
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
    console.log(`API response successful: ${response.config.url}`, data)
    if (!data.success) {
      throw new Error(data.msg || 'Request failed')
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
    const url = error.config?.url || 'Unknown URL'
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN'
    const params = error.config?.params
      ? JSON.stringify(error.config.params)
      : '{}'
    const status = error.response.status
    const statusText = error.response.statusText || 'Unknown error'
    const data = error.response.data

    console.error(
      `API error [${status} ${statusText}] ${method} ${url} ${params}`,
      data
    )

    switch (error.response.status) {
      case 401:
        console.log('Unauthorized, please login again')
        localStorage.removeItem('token')
        break
      case 403:
        console.log('Access forbidden')
        break
      case 404:
        console.log('Resource not found:', url)
        break
      case 500:
        console.log('Internal server error:', url)
        console.log('Request params:', params)
        break
      case 502:
        console.log('Gateway error (502 Bad Gateway):', url)
        console.log('This may be due to temporary server overload or maintenance')
        console.log('Request params:', params)
        console.log('Response data:', data)
        break
      default:
        console.log(`HTTP error ${status}:`, statusText)
    }
  } else if (error.request) {
    console.error('Network error, please check your connection', error.request)
    console.log('Request URL:', error.config?.url)
    console.log('Request method:', error.config?.method?.toUpperCase())
    console.log(
      'Request params:',
      error.config?.params ? JSON.stringify(error.config.params) : '{}'
    )
  } else {
    console.error('Request configuration error:', error.message)
    console.log('Request config:', error.config)
  }
}

export const fairMintApi = fairMintInstance
export const userApi = userInstance
export default fairMintInstance
