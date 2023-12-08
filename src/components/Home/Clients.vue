<template>
    <div class="clients-container">
      <div class="filter-container">
        <el-input v-model="clientIdentifie" placeholder="Input identifie" clearable style="width: 400px;"></el-input>
        <el-input v-model="clientAddress" placeholder="Input address" clearable style="width: 400px;"></el-input>
        <el-button @click="filterData" type="primary">Search</el-button> 
        <el-button @click="resetData" type="primary">Reset</el-button>
      </div>
      <div class="table-container custom-scrollbar">
        <el-table
          :data="clientData"
          empty-text="No Client Connect"
        >
          <el-table-column  label="Identifie" align="center" sortable >
            <template #default="scope">
                <el-link type="primary" :underline="false" @click="showSubInfo(scope.row)">
                  {{ scope.row.identifie }}
                </el-link>
            </template>
          </el-table-column>
          <el-table-column  label="Address" prop="address" align="center" />
          <el-table-column  label="Connect Time" prop="connect_time" align="center" :formatter="toDateString" sortable />
        </el-table>

        <el-drawer
          v-model="drawerVisible"
          :title="drawerTitle"
          direction="rtl"
          size="50%"
        
          :close-on-click-modal="false"
        >
          <div :class="[tableCustomScrollbar, tableDynamicClass]">
              <el-table
                ref="tableRef"
                empty-text="No Subscription"
                :data="drawerData.subscription_info"
              >
              <el-table-column v-if="user.data.isAdmin" type="selection" width="55" />
              <el-table-column  label="topic" prop="topic" align="center" />
              <el-table-column  label="group" prop="group" align="center"  />
            </el-table>
          </div>
          <div style="margin-top: 20px;" v-if="user.data.isAdmin">
            <el-button plain type="warning" :icon="Plus" @click="handleSubscribe()">Subscribe</el-button>
            <el-button plain type="danger" :icon="Delete" @click="handleUnsubscribe()" :loading="unsubscribeLoading" v-show="drawerData.subscription_info.length > 0">Unsubscribe</el-button>
          </div>
        </el-drawer>
      </div>
      <div>
        <el-dialog v-model="dialogVisible" title="Subscribe" width="30%" top="30vh" :before-close="handleCancelSubscribe">
          <el-form
            label-position="left"
            label-width="50px"
            :model="subscribeFormData"
          >
            <el-form-item label="Topic">
              <el-input v-model="subscribeFormData.topic" />
            </el-form-item>
            <el-form-item label="Group">
              <el-input v-model="subscribeFormData.group" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmitSubscribe" :loading="subscribeLoading">Submit</el-button>
              <el-button @click="handleCancelSubscribe">Cancel</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, computed} from 'vue'
import {useClientInfoStore, useUserStore} from '@/stores'
import {IClientInfo, ISubscription, IClientSubscription, IResponse} from '@/utils/api/model'
import {Delete, Plus} from '@element-plus/icons-vue'
import { ElTableType } from '@/utils/types';
import {SubscribeApi, UnsubscribeApi} from '@/utils/api/api'

// table
const clientInfo = useClientInfoStore()
const user = useUserStore()

onMounted(() => {
  clientInfo.getClientInfo()
})

const clientData = ref(clientInfo.data)

const clientIdentifie = ref<string>("")
const clientAddress = ref<string>("")
const filterData = () => {
  const identifie = clientIdentifie.value?.trim().toLowerCase() ;
  const address = clientAddress.value?.trim().toLowerCase();

  clientData.value = [...clientInfo.data]

  if (identifie === "" && address === "") {
    return clientData.value
  }

  clientData.value = clientData.value.filter(item => {
    const identifieMatch = item.identifie.toLowerCase() === identifie || identifie === ""
    const addressMatch =  item.address.toLowerCase() === address || address === ""
    
    return identifieMatch && addressMatch;
  })
}
const resetData = () => {
  clientIdentifie.value = ""
  clientAddress.value = ""
  
  clientData.value = [...clientInfo.data]
}

const toDateString = (row:any) :string => {
  const date = new Date(row.connect_time * 1000)
  return date.toLocaleString()
}

// Drawer
const tableRef = ref<ElTableType>()
const tableCustomScrollbar = 'custom-scrollbar'

const tableDynamicClass = computed(() => {
  return user.data.isAdmin ? 'drawer-table-container_admin' : 'drawer-table-container'
})

const drawerVisible = ref(false);
const drawerData = ref<IClientInfo>({} as IClientInfo);

const drawerTitle = computed(() => {
  return drawerData.value.identifie + "'s subscriptions"
})

const showSubInfo = (row :any) => {
  drawerVisible.value = true
  drawerData.value = row
}

const handleSubscribe = () => {
  dialogVisible.value = true
}

const unsubscribeLoading = ref(false)
const handleUnsubscribe = async () => {
  const rowData = tableRef.value!.getSelectionRows()
  if (rowData.length == 0) {
    ElNotification({
      title: 'Unsubscribe Result',
      message: "No subscription selected",
      type: 'error',
      duration: 1500,
    });
    return
  }

  unsubscribeLoading.value = true
  const unsubArray :ISubscription[] = rowData.map((element: IClientSubscription) => {
    const unsub :ISubscription = {
      identifie: drawerData.value.identifie,
      topic: element.topic,
      group: element.group
    }

    return unsub
  })

  try {
    await UnsubscribeApi(unsubArray).then((resp) => {
      const data :IResponse  = resp.data
      const metadata = data.metadata
      if (Array.isArray(metadata) && metadata.length > 0) {
        showNotification(data.metadata)
      } else {
        ElNotification({
          title: 'Unsubscribe Result',
          message: "success",
          type: 'success',
          duration: 1500,
        });

        clientInfo.getClientInfo().then(() => {
          clientData.value = clientInfo.data
          const findData = clientData.value.find(item => item.identifie === drawerData.value.identifie);
          if (findData !== undefined) {
            drawerData.value = findData
          }
        })
      }
    })
  } catch(error) {
    console.log("unsubscribe error = ", error)
  } finally {
    unsubscribeLoading.value = false
  }
}
const showNotification = (failedItems: ISubscription[]) => {
  const message = `
    <h4>part of topic unsubscribe fail:</h4>
    <ul>
      ${failedItems.map(item => `<li>${item.topic}</li>`).join('')}
    </ul>
  `;

  ElNotification({
    title: 'Unsubscribe Result',
    dangerouslyUseHTMLString: true,
    message: message,
    type: 'error',
    duration: 0 
  });
}

// dialog
const dialogVisible = ref(false)
const subscribeLoading = ref(false)
const subscribeFormData = ref<IClientSubscription>({
  topic: "",
  group: ""
})

const handleSubmitSubscribe = async () => {
  subscribeLoading.value = true
  const sub :ISubscription = {
    identifie: drawerData.value.identifie,
    topic: subscribeFormData.value.topic,
    group: subscribeFormData.value.group
  }
  try {
    await SubscribeApi(sub).then(() => {
      ElMessage.success("subscribe success")
      
      clientInfo.getClientInfo().then(() => {
          clientData.value = clientInfo.data
          const findData = clientData.value.find(item => item.identifie === drawerData.value.identifie);
          if (findData !== undefined) {
            drawerData.value = findData
          }
      })

      dialogVisible.value = false
    }) 
  } catch(error) {
    console.log("subscribe error = ", error)
  } finally {
    subscribeLoading.value = false
  }
}

const handleCancelSubscribe = () => {
  dialogVisible.value = false
  subscribeFormData.value.topic = ""
  subscribeFormData.value.group = ""
}
</script>

<style scoped>
.clients-container {
  height: 100%;
  padding: 5px;
}

.filter-container {
  display: flex;
  align-items: center;
  height: 10%;
  gap: 10px;
}

.table-container {
  max-height: 90%;
  overflow-y: auto;
}

.drawer-table-container_admin {
  max-height: 90%;
  overflow-y: auto;
}

.drawer-table-container {
  max-height: 100%;
  overflow-y: auto;
}

/* set table header fixed */
:deep(.el-table) {
  overflow: visible;
}

:deep(.el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 10;
}

:deep(.el-table__header tr th) {
  font-size: 20px;
}

:deep(.el-table__body tr:last-child td) {
  border-bottom: 3px solid rgba(223, 154, 141, 0.3) !important;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
}

:deep(.el-drawer__header .el-drawer__title) {
  font-size: 40px;
}
</style>