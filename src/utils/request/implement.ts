import Http from './request'
import { BASE_URL, TIME_OUT } from './config'
import { StatusMessage } from './status'

export const DefaultHttp = new Http ({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
    withCredentials: true,
    interceptors: {
        requestInterceptor: config => {
            return config
        },
        responseInterceptor: resp => {
            return resp
        },
        responseInterceptorCatch: err => {
            let errMsg = StatusMessage(err.response.status)
            ElMessage.error(errMsg)
        
            return Promise.reject(err)
        },
    }
})