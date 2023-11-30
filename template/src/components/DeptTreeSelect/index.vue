<template>
  <el-tree-select
    :modelValue="modelValue"
    :data="deptTreeData"
    node-key="id"
    :props="{ label: 'name', children: 'children' }"
    check-strictly
    :render-after-expand="false"
    :placeholder="placeholder || '请选择'"
    @update:modelValue="handleChange"
  />
</template>

<script setup>
import { getDeptTreeByTenantApi } from '@/api/system-manage/dept-manage';
import { nextTick, ref, watch } from 'vue';

const props = defineProps(['modelValue', 'tenantId', 'placeholder']);
const emits = defineEmits(['update:modelValue', 'change']);

watch(
  () => props.tenantId,
  newTenantId => {
    nextTick(() => {
      if (newTenantId) {
        getDeptTreeByTenant();
      } else {
        deptTreeData.value = [];
      }
    });
  },
  {
    immediate: true
  }
);

const deptTreeData = ref([]);

function getDeptTreeByTenant() {
  getDeptTreeByTenantApi(props.tenantId).then(res => {
    const datas = res.datas;
    deptTreeData.value = datas[0].deptTree;
  });
}

function handleChange(val) {
  emits('update:modelValue', val);
  emits('change', val);
}
</script>

<style lang="scss" scoped></style>
