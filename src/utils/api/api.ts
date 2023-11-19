import { DefaultHttp } from "../request/implement";
import { IUserInfo } from "./model";

export const Login = (data :IUserInfo) => {
    return DefaultHttp.post("/login", data)
}