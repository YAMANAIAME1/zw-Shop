import { useMemberStore } from '@/stores'

/**
 * 请求和上传文件拦截器
 * 实现步骤
1.基础地址
2.超时时间
3.请求头标识
4.添加 token
 */

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 设置基地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 超时时间 默认60s
    options.timeout = 10000

    // 请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    const memberStore = useMemberStore()

    const token = memberStore.profile?.token
    // 添加 token
    if (token) {
      options.header.Authorization = token
    }
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)
