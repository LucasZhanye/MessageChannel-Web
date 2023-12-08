import { LoginApi } from "@/utils/api/api";
import { IResponse, IUserInfo, ILoginUserInfo, UserAccount} from "@/utils/api/model";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        data : {} as ILoginUserInfo,
    }),
    getters: {
        getAuthenticated() :boolean {
            return this.data.isAuthenticated
        }
    },
    actions: {
        async login(userInfo :IUserInfo) {
            try {
                const resp = await LoginApi(userInfo)
                const data :IResponse  = resp.data
                const userLoginInfo :ILoginUserInfo = data.metadata
                
                Object.assign(this.$state.data, userLoginInfo)
            
                this.data.isAuthenticated = true

                this.data.isAdmin = this.data.username == UserAccount.Admin ? true : false;

                return true
            } catch(error) {
                throw error
            }
        },
        setAuthenticated(isAuthenticated: boolean) {
            this.data.isAuthenticated = isAuthenticated
        }
    },
    persist: true,
})