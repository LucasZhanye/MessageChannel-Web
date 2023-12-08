import { SystemInfoApi } from "@/utils/api/api";
import { ISystemInfo, IResponse } from "@/utils/api/model";
import { defineStore } from "pinia";

export const useSystemInfoStore = defineStore("sysinfo", {
    state: () => ({
        data: {} as ISystemInfo,
    }),
    getters: {
       
    },
    actions: {
        async getSystemInfo() {
            try {
                const resp = await SystemInfoApi()
                const data :IResponse  = resp.data
                const sysInfo :ISystemInfo = data.metadata
                
                Object.assign(this.$state.data, sysInfo)

                return true
            } catch(error) {
                throw error
            }
        },
    },
})