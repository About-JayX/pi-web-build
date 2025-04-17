import axios, { AxiosError } from 'axios'

// 创建主实例 (fair mint)
const fairMintInstance = axios.create({
  baseURL: 'https://fairmint.piweb3.xyz',
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
      config.headers.Authorization = `Bearer ${token}`
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
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 用户实例响应拦截器
userInstance.interceptors.response.use(
  response => {
    const { data } = response
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
    switch (error.response.status) {
      case 401:
        console.log('未授权，请重新登录')
        localStorage.removeItem('token')
        break
      case 403:
        console.log('没有权限访问该资源')
        break
      case 404:
        console.log('请求的资源不存在')
        break
      case 500:
        console.log('服务器错误')
        break
      default:
        console.log('其他错误')
    }
  } else if (error.request) {
    console.log('网络错误，请检查您的网络连接')
  } else {
    console.log('请求配置错误:', error.message)
  }
}

export const fairMintApi = fairMintInstance
export const userApi = userInstance
export default fairMintInstance
