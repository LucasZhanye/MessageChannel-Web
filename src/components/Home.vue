<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { UserFilled, Setting} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useClientInfoStore, useSettingStore, useSubscriptionsInfoStore, useSystemInfoStore, useUserStore } from '@/stores';

// Menu
const activeIndex = ref('/home/node')

// User
const user = useUserStore()

const handleUserCommand = (command: string | number | object) => {
    if (command == "logout") {
        ElMessage({
            message: "Logout Success",
            type: "success",
            duration: 1000,
        })
        user.$reset()
        router.push({"name": "/"})
    } else if (command == "setting") {
        router.push({"name": "Setting"})
    }
}


// Home
const router = useRouter()
const sysInfo = useSystemInfoStore()
const clientInfo = useClientInfoStore()
const subscriptionInfo = useSubscriptionsInfoStore()
const settingInfo = useSettingStore()
const refreshTime = ref(settingInfo.data.refresh_time)
const refreshInterval = ref()
const isRefreshing = ref(false)

watch(() => settingInfo.data.refresh_time, (newVal: number) => {
    refreshTime.value = newVal;
    clearInterval(refreshInterval.value); 
    startRefreshingData(); 
});

const startRefreshingData = () => {
    if (refreshTime.value === 0) {
        return ;
    }
    if (isRefreshing.value) return;

    refreshInterval.value = setInterval(() => {
        refreshData()
    }, refreshTime.value * 1000)
}

const refreshData = async () => {
    if (refreshTime.value === 0) {
        return ;
    }
    if (isRefreshing.value) return;

    try {
        isRefreshing.value = true
        await sysInfo.getSystemInfo()
        await clientInfo.getClientInfo()
        await subscriptionInfo.getSubscriptionInfo()
        isRefreshing.value = false
    } catch(error) {
        console.error('Error while refreshing data:', error);
        isRefreshing.value = false
    }
}

onBeforeUnmount(() => {
    clearInterval(refreshInterval.value);
});

onMounted(() => {
    startRefreshingData();
    router.push(activeIndex.value)
})

</script>

<template>
    <div class="home-container">
        <div class="header">
            <el-menu
                :router="true"
                :default-active="activeIndex"
                mode="horizontal"
                :ellipsis="false"
                class="menu"
            >
                <el-menu-item index="/home/node">
                    <img
                        src="../../public/messagechannel.svg"
                    />
                </el-menu-item>

                <el-menu-item index="/home/clients">
                    <svg-icon iconName="icon-kehuduanliebiao" style="font-size: 30px"></svg-icon>
                    <span style="font-size: 20px;">Clients</span>
                </el-menu-item>

                <el-menu-item index="/home/subscriptions">
                    <svg-icon iconName="icon-dingyue" style="font-size: 30px"></svg-icon>
                    <span style="font-size: 20px;">Subscriptions</span>
                </el-menu-item>
            
                <el-menu-item index="/home/config">
                    <svg-icon iconName="icon-peizhi1" style="font-size: 30px"></svg-icon>
                    <span style="font-size: 20px;">Config</span>
                </el-menu-item>

                <el-menu-item index="/home/debug">
                    <svg-icon iconName="icon-debug" style="font-size: 30px"></svg-icon>
                    <span style="font-size: 20px;">Debug</span>
                </el-menu-item>

                <div style="flex-grow: 1"></div>

                <div class="user-menu">
                    <el-dropdown @command="handleUserCommand" trigger="click">   
                        <span style="display: flex; align-items: center;"> 
                            <el-icon size="30">
                                <UserFilled />
                            </el-icon>
                            <span style="font-size: 18px;padding-left: 5px;">{{ user.data.username }}</span>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :icon="Setting" command="setting">Setting</el-dropdown-item>
                                <el-dropdown-item command="logout">
                                    <svg-icon iconName="icon-logout"></svg-icon>Logout
                                </el-dropdown-item>
                                
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-menu>
        </div>
        <div class="content">
            <router-view v-slot="{ Component }">
                <!-- <keep-alive> -->
                    <component :is="Component" />
                <!-- </keep-alive> -->
            </router-view>
        </div>
    </div>
</template>

<style scoped>
.home-container {
    width: 100%;
    height: 100%;
}
.home-container .header {
    height: 5%;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
}

.header .menu {
    width: 100%;
}

.header .menu .el-menu-item {
    display: flex;
    align-items: center;
}
.header .menu img {
    height: 100%;
}

.header .menu .user-menu, .dark-switch{
    display: flex; 
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
}

.home-container .content {
    height: 85%;
}
</style>