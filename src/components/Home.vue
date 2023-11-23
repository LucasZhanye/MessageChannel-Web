<script setup lang="ts">
import { ref } from 'vue'
import { UserFilled, Setting, Moon, Sunny} from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'

const activeIndex = ref('0')

const handleUserCommand = (command: string | number | object) => {
    ElMessage(`click on item ${command}`)
}

const isDark = useDark({
    storageKey: 'useDark',
    valueLight: 'light',
    valueDark: 'dark'
})

const isDarkTeme = ref(localStorage.getItem('useDark') === 'dark')

const toggleDark = useToggle(isDark)

</script>

<template>
    <div class="header">
        <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            :ellipsis="false"
            class="menu"
        >
            <el-menu-item index="0">
                <div style="display: flex; align-items: center;">
                    <img src="../../public/messagechannel.svg" style="width: 50px;"/>
                </div>
                
            </el-menu-item>

            <el-menu-item index="1">
                <svg-icon iconName="icon-svgkehuduanliebiao" style="font-size: 30px"></svg-icon>
                <span style="font-size: 20px;">Clients</span>
            </el-menu-item>

            <el-menu-item index="2">
                <svg-icon iconName="icon-svgdingyue" style="font-size: 30px"></svg-icon>
                <span style="font-size: 20px;">Subscriptions</span>
            </el-menu-item>
          
            <div style="flex-grow: 1"></div>

            <div class="dark-switch">
                <el-switch 
                v-model="isDarkTeme" 
                inline-prompt 
                :active-icon="Moon" 
                :inactive-icon="Sunny" 
                @change="toggleDark()"
                />
            </div>

            <div class="user-menu">
                <el-dropdown @command="handleUserCommand" trigger="click">
                    <span >
                        <el-icon size="30">
                            <UserFilled />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item :icon="Setting" command="setting">Setting</el-dropdown-item>
                            <el-dropdown-item command="logout">
                                <svg-icon iconName="icon-svglogout"></svg-icon>Logout
                            </el-dropdown-item>
                            
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

        
        </el-menu>
    </div>
</template>

<style>
.header {
    height: 10vh;
}

.header .menu {
    height: 100%;
}

.header .menu .user-menu, .dark-switch{
    display: flex; 
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
}

</style>