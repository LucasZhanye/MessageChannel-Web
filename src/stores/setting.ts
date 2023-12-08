
import { defineStore } from "pinia";
import {ISetting} from '@/utils/api/model'

export const useSettingStore = defineStore("setting", {
    state: () => ({
        data:  {
            refresh_time: 10,
            dark_theme: false,
        } as ISetting
    }),
    getters: {
        getSetting() :ISetting {
            return this.data
        }
    },
    actions: {
    },
    persist: true,
})