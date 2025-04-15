import axios from 'axios'

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'https://fairmint.piweb3.xyz', //https://fairmint.piweb3.xyz/api
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    console.log('请求拦截器 - 发送请求:', config.url)

    // 在这里可以统一添加 token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    return config
  },
  error => {
    console.error('请求拦截器 - 错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    console.log('响应拦截器 - 接收数据:', response.config.url)

    // 这里可以统一处理响应数据
    const data = response.data

    // 可以根据后端的响应结构进行统一处理
    // if (data.code === 0) {
    //   return data.data
    // } else {
    //   return Promise.reject(new Error(data.message || '请求失败'))
    // }

    return data
  },
  error => {
    console.error('响应拦截器 - 错误:', error)

    // 处理特定的错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，可以在这里处理登出逻辑
          console.log('未授权，请重新登录')
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
      // 请求已经发出，但没有收到响应
      console.log('网络错误，请检查您的网络连接')
    } else {
      // 请求配置出错
      console.log('请求配置错误:', error.message)
    }

    return Promise.reject(error)
  }
)

export default instance
