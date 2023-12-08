import { SubscriptionInfoApi } from "@/utils/api/api";
import { IResponse, ITopicInfo } from "@/utils/api/model";
import { defineStore } from "pinia";

export const useSubscriptionsInfoStore = defineStore("subscriptionsInfo", {
    state: () => ({
        data: [] as ITopicInfo[], 
    }),
    getters: {
       
    },
    actions: {
        async getSubscriptionInfo() {
            try {
                const resp = await SubscriptionInfoApi()
                const data :IResponse  = resp.data
                const topicInfo :ITopicInfo = data.metadata
                Object.assign(this.$state.data, topicInfo)

                return true
            } catch(error) {
                throw error
            }
        },
    },
})