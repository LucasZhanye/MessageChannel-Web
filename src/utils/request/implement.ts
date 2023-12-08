import Http from './request'
import { BASE_URL, TIME_OUT } from './config'
import { IResponse } from '../api/model'
import Vrouter from "@/router"
import { useUserStore } from '@/stores'

export const DefaultHttp = new Http ({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
    withCredentials: true,
    interceptors: {
        requestInterceptor: config => {
            if (config.url != "/login") {
                const user = useUserStore()
                config.headers.set("token", user.data.token)
            }
            return config
        },
        responseInterceptor: resp => {
            if (resp.status == 200) {
                let data :IResponse = resp.data
                if (data.code != 200) {
                    if (data.message != "") {
                        ElMessage({
                            message: data.message,
                            type: 'error',
                            duration: 1500
                        })
                    } else {
                        ElMessage({
                            message: data.reason,
                            type: 'error',
                            duration: 1500
                        })
                    }
                    throw new Error(data.message || data.reason || 'Unknown Error');
                } else {
                    return resp
                }
            }   
            return resp
        },
        responseInterceptorCatch: err => {
            if (err.response.status == 401) {
                ElMessage.error(err.response.statusText)
                
                const router = Vrouter
                const user = useUserStore()
                user.$reset()
                router.push({ name: "Login" })

                return new Promise(() => {});
            } else {
                ElMessage.error(err.message)
                return Promise.reject(err)
            }
        },
    }
})