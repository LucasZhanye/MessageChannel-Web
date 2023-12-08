<template>
  <div class="home-node">
    <div class="header">
      <el-row>
        <el-col :span="8">
          <el-statistic title="Total Clinet" :value="sysInfoData.total_client" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="Total Subscription" :value="sysInfoData.total_subscription"/>
        </el-col>
      </el-row>
    </div>
    <el-descriptions title="Node System Info" :column="1" large="large" class="descriptions">
      <el-descriptions-item label="Name:"  class-name="descriptions-item" label-class-name="descriptions-item-label">{{ sysInfoData.name }}</el-descriptions-item>
      <el-descriptions-item label="Version:" class-name="descriptions-item" label-class-name="descriptions-item-label">{{ sysInfoData.version }}</el-descriptions-item>
      <el-descriptions-item label="Engine:" class-name="descriptions-item" label-class-name="descriptions-item-label">{{ sysInfoData.engine }}</el-descriptions-item>
    </el-descriptions>
  </div> 
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import {useSystemInfoStore} from "@/stores"

const sysInfo = useSystemInfoStore()
const sysInfoData = ref(sysInfo.data)

onMounted(() => {
  sysInfo.getSystemInfo()
})



</script>

<style scoped>

.home-node {
  width: 100%;
  height: 100%;
}

.home-node .header {
  padding-left: 20px;
  padding-top: 10px;
  height: 10%;
}

.home-node .header .el-col {
  text-align: center;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.home-node .descriptions {
  height: 90%;
}

:deep(.descriptions .el-descriptions__header) {
  height: 10%;
  margin: 0;
  padding-left: 20px;
}

:deep(.descriptions .el-descriptions__header .el-descriptions__title) {
  font-size: 24px;
  font-weight: 500;
}

:deep(.descriptions .el-descriptions__body) {
  background: none;
}

:deep(.descriptions .el-descriptions__body .el-descriptions__cell) {
  padding-top: 10px;
}

:deep(.descriptions-item) {
  display: inline-block;
  font-size: 20px;
  text-align: left;
  color: rgb(115, 180, 223);
}

:deep(.descriptions-item-label) {
  padding-left: 20px;
  font-size: 20px;
  display: inline-block;
  width: 100px;
  text-align: left;
}
</style>