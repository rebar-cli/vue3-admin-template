<template>
  <el-tree-select
    :modelValue="modelValue"
    :data="userTreeData"
    node-key="id"
    :props="{ label: 'name', children: 'children' }"
    filterable
    :filter-node-method="filterNodeMethod"
    :render-after-expand="false"
    @node-click="handleClickNode"
  >
    <template #default="{ data }">
      <span style="display: flex; align-items: center">
        <el-icon class="mr-5">
          <User v-if="data.isUser" />
          <Folder v-if="data.isDept" />
        </el-icon>
        {{ data.name }}
      </span>
    </template>
  </el-tree-select>
</template>

<script setup>
import { getDeptUserTreeApi } from '@/api/system-manage/dept-manage';
import { ref, watch } from 'vue';

const props = defineProps(['modelValue', 'tenantId']);
const emits = defineEmits(['update:modelValue', 'change']);

let originUserTreeData = [];
const userTreeData = ref([]);

watch(
  () => props.tenantId,
  newTenantId => {
    if (newTenantId) {
      getDeptUserTree();
    } else {
      userTreeData.value = [];
    }
  },
  {
    immediate: true
  }
);

function getDeptUserTree() {
  getDeptUserTreeApi(props.tenantId).then(res => {
    const datas = res.datas;
    originUserTreeData = transferTree(datas);
    userTreeData.value = originUserTreeData;
  });
}

// 将用户拼接到子部门中
function transferTree(tree) {
  tree = tree || [];
  return tree.map(item => ({
    ...item,
    children: transferTree(item.children).concat(transferUsers(item.users)),
    isDept: true
  }));
}

// 转换用户字段
function transferUsers(users) {
  users = users || [];
  return users.map(item => ({
    id: item.userId,
    name: item.nickName,
    phone: item.phone,
    isUser: true
  }));
}

function filterNodeMethod(name, data) {
  if (!name) return true;
  return data.name.includes(name);
}

function handleClickNode(data) {
  if (data.isUser) {
    emits('update:modelValue', data.id);
    emits('change', data);
  }
}
</script>

<style lang="scss" scoped></style>
