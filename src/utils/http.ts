import { useMemberStore } from '@/stores'

/**
 * 请求和上传文件拦截器
 * 实现步骤
1.基础地址
2.超时时间
3.请求头标识
4.添加 token
 */
const memberStore = useMemberStore()
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

    const token = memberStore.profile?.token
    // 添加 token
    if (token) {
      options.header.Authorization = token
    }
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */

type Data<T> = {
  msg: string
  code: string
  result: T
}

//2.2 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  //1. 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 请求成功
      success(res) {
        //2.1 提取核心数据 res.data
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 清理用户信息
          memberStore.clearProfile()
          // 跳回登录页
          uni.navigateTo({
            url: '/pages/login/login',
          })
          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求失败',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
