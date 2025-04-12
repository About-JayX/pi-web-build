import axios from 'axios'

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://192.168.1.97:8888',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在这里可以添加token等认证信息
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 可以统一处理响应数据
    return response.data
  },
  error => {
    // 统一处理错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权错误
          break
        case 404:
          // 处理未找到错误
          break
        case 500:
          // 处理服务器错误
          break
        default:
          break
      }
    }
    return Promise.reject(error)
  }
)

export default instance
