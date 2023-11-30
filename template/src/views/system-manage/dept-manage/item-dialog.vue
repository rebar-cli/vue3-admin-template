<template>
  <el-dialog :title="title" v-model="visible" width="600px" append-to-body @close="close">
    <el-form ref="formRef" :model="itemData" :rules="rules" label-width="80px">
      <el-form-item prop="tenantId" label="所属租户">
        <el-select v-model="itemData.tenantId" style="width: 100%">
          <el-option v-for="tenant in tenantList" :key="tenant.id" :value="tenant.id" :label="tenant.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentId">
        <dept-tree-select v-model="itemData.parentId" :tenantId="itemData.tenantId" />
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="itemData.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="itemData.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="负责人" prop="leaderUserId">
        <user-tree-select v-model="itemData.leaderUserId" :tenantId="itemData.tenantId" @change="handleChangeLeader" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="itemData.phone"
          :disabled="itemData.leaderUserId"
          placeholder="请输入联系电话"
          maxlength="11"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import DeptTreeSelect from '@/components/DeptTreeSelect';
import UserTreeSelect from '@/components/UserTreeSelect';
import { getTenantByPageApi } from '@/api/system-manage/tenant-manage';
import useUserStore from '@/store/modules/user';
import { rsaEncrypt } from '@/utils/encryptUserInfo';

const emits = defineEmits(['submit']);
const userStroe = useUserStore();

const title = ref('');
const visible = ref(false);
const formRef = ref();
const tenantList = ref([]);
const itemData = ref({
  sort: 1
});
const rules = {
  tenantId: [{ required: true, message: '所属租户不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
};

function init() {
  if (userStroe.isSuperAdmin) {
    getTenantList();
  }
}

function getTenantList() {
  const params = {
    current: 1,
    size: -1
  };
  getTenantByPageApi(params).then(res => {
    const datas = res.datas;
    tenantList.value = datas.records;
  });
}

function handleChangeLeader(data) {
  itemData.value.phone = data.phone;
}

function add() {
  init();
  title.value = '新增';
  visible.value = true;
}

function edit(row) {
  itemData.value = Object.assign(itemData.value, {
    ...row,
    // 一级部门没有上级部门，默认置空
    parentId: row.parentId === 0 ? null : row.parentId
  });
  init();
  title.value = '编辑';
  visible.value = true;
}

function close() {
  itemData.value = {
    sort: 1
  };
  formRef.value.resetFields();
  visible.value = false;
}

function submit() {
  formRef.value.validate(valid => {
    if (!valid) return;
    const params = {
      ...itemData.value,
      phone: rsaEncrypt(itemData.value.phone)
    };
    emits('submit', params);
    close();
  });
}

// 暴露组件实例的方法
defineExpose({
  add,
  edit
});
</script>

<style lang="scss" scoped></style>
