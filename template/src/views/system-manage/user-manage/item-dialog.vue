<template>
  <el-dialog v-model="visible" :title="title" :close-on-click-modal="false" width="700px" @close="close">
    <el-form ref="formRef" :model="itemData" :rules="itemRules" label-position="right" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item prop="nickname" label="姓名">
            <el-input v-model="itemData.nickname" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="tenantId" label="所属租户">
            <el-select
              v-model="itemData.tenantId"
              :disabled="!userStroe.isSuperAdmin"
              style="width: 100%"
              @change="handleChangeTenantId"
            >
              <el-option
                v-for="tenant in tenantList"
                :key="tenant.id"
                :value="tenant.id"
                :label="tenant.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item prop="username" label="账号">
            <el-input v-model="itemData.username" placeholder="请输入账号，仅支持英文和数字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="deptId" label="所属部门">
            <dept-tree-select
              v-model="itemData.deptId"
              :tenantId="itemData.tenantId"
              :placeholder="itemData.tenantId ? '请选择' : '请先选择租户'"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item prop="mobile" label="手机号码">
            <el-input v-model="itemData.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="itemData.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item prop="sort" label="排序">
            <el-input-number v-model="itemData.sort" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="enabled" label="是否启用">
            <el-switch
              v-model="itemData.enabled"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item prop="roleIds" label="角色">
            <el-select
              v-model="itemData.roleIds"
              multiple
              value-key="roleId"
              style="width: 100%"
              :placeholder="itemData.tenantId ? '请选择' : '请先选择租户'"
            >
              <el-option
                v-for="role in roleList"
                :key="role.roleId"
                :value="role.roleId"
                :label="role.roleName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
// import { getRoleListByTenantApi, getTenantByPageApi } from '@/api/system-manage/tenant-manage';
import useUserStore from '@/store/modules/user';
import { rsaEncrypt } from '@/utils/encryptUserInfo';

const emits = defineEmits(['submit']);
const userStroe = useUserStore();

const visible = ref(false);
const title = ref('');
const formRef = ref();
const roleList = ref([]);
const tenantList = ref([]);
let oldPhone = '';
let oldEmail = '';
const itemData = ref({
  id: null,
  username: '',
  nickname: '',
  mobile: '',
  email: '',
  enabled: true,
  sort: 0,
  roleIds: [],
  deptId: null,
  deptName: '',
  tenantId: null
});
const itemRules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {
      required: true,
      pattern: /(^[0-9a-zA-Z]+$)/g,
      message: '请输入正确的格式，仅支持英文和数字',
      trigger: 'blur'
    }
  ],
  nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (oldPhone === value) {
          callback();
        }
        const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      },
      message: '请输入正确的手机号',
      trigger: ['blur', 'change']
    }
  ],
  roleIds: [{ required: true, message: '请选择角色' }],
  tenantId: [{ required: true, message: '请选择租户' }],
  deptId: [{ required: true, message: '请选择部门' }],
  email: [
    {
      validator: (rule, value, callback) => {
        if (oldEmail === '' || value === '' || oldEmail === value) {
          callback();
        }
        const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'));
        } else {
          callback();
        }
      },
      message: '请输入正确的邮箱',
      trigger: ['blur', 'change']
    }
  ]
});

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

function getRoleListByTenant() {
  const tenantId = itemData.value.tenantId;
  if (!tenantId) return;
  getRoleListByTenantApi(tenantId).then(res => {
    const datas = res.datas;
    roleList.value = datas;
  });
}

function handleChangeTenantId() {
  itemData.value.roleIds = [];
  itemData.value.deptId = null;
  getRoleListByTenant();
}

function init() {
  // getTenantList();
  // getRoleListByTenant();
}

function add() {
  if (!userStroe.isSuperAdmin) {
    itemData.value.tenantId = userStroe.tenantId;
  }
  init();
  title.value = '新增';
  visible.value = true;
}

function edit(row) {
  itemData.value = Object.assign(itemData.value, row);
  oldPhone = itemData.value.mobile;
  oldEmail = itemData.value.email;
  init();
  title.value = '编辑';
  visible.value = true;
}

function close() {
  oldPhone = '';
  oldEmail = '';
  itemData.value = {
    id: null,
    username: '',
    nickname: '',
    mobile: '',
    enabled: true,
    sort: 0,
    roleIds: [],
    deptId: null,
    deptName: '',
    tenantId: null
  };
  formRef.value.resetFields();
  visible.value = false;
}

function submit() {
  formRef.value.validate(valid => {
    if (!valid) return;
    const params = {
      ...itemData.value,
      mobile: rsaEncrypt(itemData.value.mobile),
      email: rsaEncrypt(itemData.value.email)
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
