import { DefaultHttp } from "../request/implement";
import { IUserInfo, ISubscription } from "./model";

export const LoginApi = (data :IUserInfo) => {
    return DefaultHttp.post("/login", data)
}

export const SystemInfoApi = () => {
    return DefaultHttp.get("/dashboard/sysinfo")
}

export const ClientInfoApi = () => {
    return DefaultHttp.get("/dashboard/clients")
}

export const SubscriptionInfoApi = () => {
    return DefaultHttp.get("/dashboard/subscriptions")
}

export const SubscribeApi = (data :ISubscription) => {
    return DefaultHttp.post("/dashboard/subscribe", data)
}

export const UnsubscribeApi = (data :ISubscription[]) => {
    return DefaultHttp.post("/dashboard/unsubscribe", data)
}