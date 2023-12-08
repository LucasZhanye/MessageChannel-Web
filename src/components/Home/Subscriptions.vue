<template>
  <div class="subscriptions-container">
    <div class="filter-container">
      <el-input v-model="search.topic_name" placeholder="topic name" clearable style="width: 400px;"></el-input>
      <el-input v-model="search.group_name" placeholder="group name" clearable style="width: 400px;"></el-input>
      <el-input v-model="search.identifie" placeholder="client identifie" clearable style="width: 400px;"></el-input>
      <el-button @click="filterTree" type="primary">Search</el-button> 
      <el-button @click="resetData" type="primary">Reset</el-button>
    </div>
    <div :class="[treeCustomScrollbar, treeDynamicClass]">
      <el-tree
        ref="treeRef"
        :data="treeData"
        empty-text="No Subscription"
        node-key="id"
        :indent="20"
        :show-checkbox="showCheckbox"
        :default-expand-all="true"
        style="font-size: 20px;"
      >
        <template #default="{ node, data }">
          <span v-if="data.isSubscription">
            <el-popover
              placement="right"
              title="ClientInfo"
              width="300"
              trigger="click"
              popper-class="subscriptions-clientInfo-popover"
            >
              <template #reference>
                  <span>{{ node.label }}</span>
              </template>
              
              <template #default>
                  <p>Identifier: {{ data.identifie }}</p>
                  <p>Address: {{ data.address }}</p>
                  <p>Connect Time: {{ toDateString(data.connect_time) }}</p>
              </template>
            </el-popover>
          </span>
          
          <span v-else>{{ node.label }}</span>
          
        </template>
      </el-tree>
    </div>
    <div class="handle-container" v-if="user.data.isAdmin && treeData.length > 0">
      <el-button plain type="danger" @click="handleUnsubscribe" :loading="unsubscribeLoading">Unsubscribe</el-button>
    </div>
  </div>    
</template>

<script lang="ts" setup>
import {useSubscriptionsInfoStore, useUserStore} from '@/stores'
import { UnsubscribeApi } from '@/utils/api/api';
import { ITopicInfo, IGroupInfo, IClientBaseInfo, ISubscription, IResponse} from '@/utils/api/model';
import { ElTreeType } from '@/utils/types';
import { TreeKey } from 'element-plus/es/components/tree/src/tree.type';
import { onMounted, ref, computed} from 'vue';

const treeRef = ref<ElTreeType>()
const treeCustomScrollbar = "custom-scrollbar"
const treeDynamicClass = computed(() => {
  return user.data.isAdmin ? "tree-container_admin" : "tree-container"
})

const unsubscribeLoading = ref(false)
const handleUnsubscribe = async () => {
  const checkedKeys = treeRef.value!.getCheckedKeys(true)

  if (checkedKeys.length == 0) {
    ElNotification({
      title: 'Unsubscribe Result',
      message: "No subscription selected",
      type: 'error',
      duration: 1500,
    });
    return
  }
  unsubscribeLoading.value = true
  
  const subscriptions: ISubscription[] = [];
  checkedKeys.forEach((item: TreeKey) => {
    const stringItem = item as string;
    const parts = stringItem.split('.');
    if (parts.length === 3) {
      const [topic, group, identifie] = parts;
      const subscription: ISubscription = {
        identifie: identifie,
        topic: topic,
        group: group
      };
      subscriptions.push(subscription);
    } 
  });

  try {
    await UnsubscribeApi(subscriptions).then((resp) => {
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

        subscriptionInfo.getSubscriptionInfo().then(() => {
          treeData.value = convertToTree(subscriptionInfo.data);
          topicData.value = treeData.value;
        });
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
      ${failedItems.map(item => `<li>${item.topic}-${item.group}-${item.identifie}</li>`).join('')}
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

const treeData = ref<ITopicInfo[]>([]);
const topicData = ref<ITopicInfo[]>([]);

const convertToTree = (data: ITopicInfo[]): any[] => {
  return data.reduce((result: any, topic: ITopicInfo) => {
    const topicNode = {
      id: topic.topic_name,
      label: topic.topic_name,
      children: topic.group.reduce((groups :any, group: IGroupInfo) => {
        if (group.subscription.length > 0) {
          groups.push({
            id: topic.topic_name + "." + group.group_name,
            label: group.group_name,
            children: group.subscription.map((sub: IClientBaseInfo) => ({
              id: topic.topic_name + "." + group.group_name + "." + sub.identifie,
              label: sub.identifie,
              isSubscription: true,
              identifie: sub.identifie,
              address: sub.address,
              connect_time: sub.connect_time,
            })),
          });
        }
        return groups;
      }, []),
    };

    if (topicNode.children.length > 0) {
      result.push(topicNode);
    }

    return result;
  }, []);
};


interface Search {
  topic_name :string
  group_name :string
  identifie :string
}
const search = ref<Search>({
  topic_name: '',
  group_name: '',
  identifie: '',
});

const filterTree = () => {
  const topicName = search.value.topic_name?.trim().toLowerCase();
  const groupName = search.value.group_name?.trim().toLowerCase();
  const identifie = search.value.identifie?.trim().toLowerCase();

  treeData.value = [...topicData.value]

  if (topicName === "" && groupName === "" && identifie == "") {
    return
  }

  treeData.value =  treeData.value.filter((topic: any) => {
    return (
      (search.value.topic_name === '' || topic.label.toLowerCase().includes(search.value.topic_name.toLowerCase())) &&
      topic.children.some((group: any) => {
        return (
          (search.value.group_name === '' || group.label.toLowerCase().includes(search.value.group_name.toLowerCase())) &&
          group.children.some((client: any) => {
            return (
              (search.value.identifie === '' || client.identifie.toLowerCase().includes(search.value.identifie.toLowerCase()))
            );
          })
        );
      })
    );
  });
};

const resetData = () => {
  search.value = {
    topic_name: '',
    group_name: '',
    identifie: '',
  }
  treeData.value = [...topicData.value]
}

const subscriptionInfo = useSubscriptionsInfoStore()
onMounted(() => {
  subscriptionInfo.getSubscriptionInfo().then(() => {
    treeData.value = convertToTree(subscriptionInfo.data)
    topicData.value = treeData.value
  })
})

const user = useUserStore()
const showCheckbox = ref(user.data.isAdmin)

const toDateString = (connect_time :number) :string => {
  const date = new Date(connect_time * 1000)
  return date.toLocaleString()
}
</script>

<style>

.subscriptions-container {
  height: 100%;
  padding: 5px;
}

.subscriptions-container .filter-container {
  display: flex;
  align-items: center;
  height: 10%;
  gap: 10px;
}

.subscriptions-container .tree-container {
  max-height: 90%;
  overflow-y: auto;
}

.subscriptions-container .tree-container_admin {
  max-height: 85%;
  overflow-y: auto;
}

.subscriptions-clientInfo-popover {
  background-color: #D1E9FF   !important;
}

.subscriptions-clientInfo-popover .el-popper__arrow::before {
  background-color: #D1E9FF   !important;
}

.subscriptions-container .handle-container {
  height: 5%;
  margin-top: 20px;
}
</style>