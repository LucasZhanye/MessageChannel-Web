<template>
    <div class="setting-container">
        <div class="header">
          <el-icon size="30" class="icon"> <Setting /></el-icon>
          <div class="title">Settings</div>
        </div>
        <div class="content">
            <el-form :model="settingData" label-width="120px">
                <el-form-item label="Dark Theme">
                    <el-switch 
                      v-model="settingData.dark_theme"
                      inline-prompt 
                      active-text="ON"
                      inactive-text="OFF"
                      @change="toggleDark()"
                    />
                </el-form-item>
                <el-form-item label="Refresh Time">
                    <el-select v-model="settingData.refresh_time" placeholder="Select">
                        <el-option
                            v-for="item in refreshOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {Setting} from '@element-plus/icons-vue'
import { useSettingStore } from '@/stores';
import { ISetting, Theme, ThemeKey } from '@/utils/api/model';
import { useDark, useToggle } from '@vueuse/core'

const settingInfo = useSettingStore()
const settingData = ref<ISetting>({} as ISetting)
onMounted(() => {
  settingData.value = settingInfo.getSetting
})

const refreshOptions = [
  {
    value: 5,
    label: "Refresh every 5 seconds"
  },
  {
    value: 10,
    label: "Refresh every 10 seconds"
  },
  {
    value: 30,
    label: "Refresh every 30 seconds"
  },
  {
    value: 0,
    label: "Do not refresh"
  }
]

const isDark = useDark({
    storageKey: ThemeKey,
    valueLight: Theme.Light,
    valueDark: Theme.Dark
})
const toggleDark = useToggle(isDark)

</script>

<style scoped>
.setting-container {
    width: 100%;
    height: 100%;
}

.setting-container .header {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
}

.header .icon {
  padding-left: 20px;
}

.header .title {
    font-size: 30px;
}

.content {
    margin-top: 20px;
}
</style>