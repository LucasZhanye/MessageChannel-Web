import { ClientInfoApi } from "@/utils/api/api";
import { IResponse, IClientInfo } from "@/utils/api/model";
import { defineStore } from "pinia";

export const useClientInfoStore = defineStore("clientInfo", {
    state: () => ({
        data: [] as IClientInfo[], 
    }),
    getters: {
       
    },
    actions: {
        async getClientInfo() {
            try {
                const resp = await ClientInfoApi()
                const data :IResponse  = resp.data
                const clientInfo :IClientInfo = data.metadata
                
                Object.assign(this.$state.data, clientInfo)

                return true
            } catch(error) {
                throw error
            }
        },
    },
})