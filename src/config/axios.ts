import axios, { AxiosError } from 'axios'
import { store } from '@/store'

// API服务器配置
const API_URL = '/api' //'https://fairmint.piweb3.xyz/api'  // 主服务器

// 创建主实例 (fair mint)
const fairMintInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 创建用户API实例
const userInstance = axios.create({
  baseURL: 'https://memestestspace.dexcc.cc',
  timeout: 15000,
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

// fairMint实例响应拦截器
fairMintInstance.interceptors.response.use(
  response => response.data,
  error => {
    handleAxiosError(error)
    return Promise.reject(error)
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
