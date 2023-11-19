import axios from "axios"
import type {AxiosInstance, AxiosResponse} from 'axios'
import type {HttpConfig, HttpInterceptors} from "./interceptors"


export default class Http {
    instance: AxiosInstance
    interceptors?: HttpInterceptors

    public constructor(config :HttpConfig) {
        this.instance = axios.create(config)
        this.interceptors = config.interceptors

        this.instance.interceptors.request.use(
           this.interceptors?.requestInterceptor,
        )

        this.instance.interceptors.response.use(
           this.interceptors?.responseInterceptor,
           this.interceptors?.responseInterceptorCatch
        )
    }

    public request(config :HttpConfig) :Promise<AxiosResponse> {
        if (config.interceptors?.requestInterceptor) {
            config = config.interceptors.requestInterceptor(config as any)
        }

        return new Promise((resolve, reject) => {
            this.instance.request(config).then(
                resp => {
                    if (config.interceptors?.responseInterceptor) {
                        resp = config.interceptors.responseInterceptor(resp)
                    }
                    return resolve(resp)
                }
            ).catch(err => {
                if (config.interceptors?.responseInterceptorCatch) {
                    err = config.interceptors.responseInterceptorCatch(err)
                }

                return reject(err)
            })
        })
    }

    public get<T = any>(url :string, params?: T, config?: HttpConfig) :Promise<any> {
        return this.request({ ...config, url, method: 'GET', params })
    }

    public post<T = any>(url: string, data: T, config?: HttpConfig): Promise<any> {
        return this.request({ ...config, url, method: 'POST', data })
    }
    
    public put<T = any>(url: string, data: T, config?: HttpConfig): Promise<any> {
        return this.request({ ...config, url, method: 'PUT', data })
    }
    
    public delete<T = any>(url: string, data: T, config?: HttpConfig): Promise<any> {
        return this.request({ ...config, url, method: 'DELETE', data })
    }
    
    public options<T = any>(url: string, params?: T, config?: HttpConfig): Promise<any> {
        return this.request({ ...config, url, method: 'OPTIONS', params })
    }
}