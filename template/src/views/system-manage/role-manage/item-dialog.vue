<template>
  <el-dialog v-model="visible" :title="title" :close-on-click-modal="false" width="500px" @close="close">
    <el-form ref="formRef" :model="itemData" :rules="itemRules" label-width="100px">
      <el-form-item prop="name" label="角色名称">
        <el-input v-model="itemData.name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="角色code">
        <el-input v-model="itemData.code" placeholder="请输入角色code"></el-input>
      </el-form-item>
      <el-form-item prop="description" label="角色说明">
        <el-input v-model="itemData.description" placeholder="请输入角色说明"></el-input>
      </el-form-item>
      <el-form-item prop="authTree" label="权限设置">
        <div class="tree-container">
          <el-checkbox v-model="expandMenu" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
          <el-checkbox v-model="checkedAllMenu" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuTree"
            show-checkbox
            node-key="id"
            :props="{ label: 'menuName', children: 'subMenus' }"
            ref="menuTreeRef"
            @check="handleCheckNode"
          ></el-tree>
        </div>
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
import { getMenuIdByRole, getMenuListApi, getMenuTreeApi } from '@/api/system-manage/menu-manage';

const emits = defineEmits(['submit']);

const visible = ref(false);
const title = ref('');
const formRef = ref();
const menuTreeRef = ref();
const itemData = ref({
  id: null,
  name: '',
  code: '',
  description: ''
});
const menuTree = ref([]);
const checkedMenuIds = ref([]);
const itemRules = reactive({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入角色code'));
        }
        var reg = /^[A-Za-z0-9]+$/; // /\p{Unified_Ideograph}/u
        if (!reg.test(value)) {
          return callback(new Error('code只能包含字母和数字'));
        }
        callback();
      },
      trigger: 'blur'
    }
  ]
});
const menuList = ref([]);
const expandMenu = ref(false);
const checkedAllMenu = ref(false);

watch(visible, newVal => {
  if (newVal) {
    getRoleMenu();
  }
});

async function getRoleMenu() {
  const { datas: menuTreeData } = await getMenuTreeApi();
  menuTree.value = menuTreeData;
  const roleId = itemData.value.id;
  if (roleId) {
    const { datas: menuIds } = await getMenuIdByRole(roleId);
    const { datas: allMenu } = await getMenuListApi();
    checkedMenuIds.value = menuIds;
    menuIds.forEach(id => {
      menuTreeRef.value.setChecked(id, true, false);
    });
    // 若拥有所有菜单权限则勾选全选按钮
    menuList.value = allMenu;
    const haveAllMenuPerm = allMenu.every(item => menuIds.includes(item.id));
    checkedAllMenu.value = haveAllMenuPerm;
  }
}

function add() {
  title.value = '新增';
  visible.value = true;
}

function edit(row) {
  title.value = '编辑';
  visible.value = true;
  itemData.value = Object.assign(itemData.value, row);
}

function close() {
  itemData.value = {
    id: null,
    name: '',
    code: '',
    description: ''
  };
  formRef.value.resetFields();
  visible.value = false;
}

function submit() {
  formRef.value.validate(valid => {
    if (!valid) return;
    const checkedKey = menuTreeRef.value.getCheckedKeys();
    const halfCheckedKey = menuTreeRef.value.getHalfCheckedKeys();
    const menuIds = [...halfCheckedKey, ...checkedKey];
    const params = {
      role: itemData.value,
      menuIds
    };
    emits('submit', params);
    close();
  });
}

// 展开/折叠
function handleCheckedTreeExpand(value) {
  const menuTreeData = menuTree.value;
  for (let i = 0; i < menuTreeData.length; i++) {
    menuTreeRef.value.store.nodesMap[menuTreeData[i].id].expanded = value;
  }
}

// 全选/全不选
function handleCheckedTreeNodeAll(value) {
  menuTreeRef.value.setCheckedNodes(value ? menuTree.value : []);
}

function handleCheckNode(data, check) {
  const checkedKeysLength = check.checkedKeys.length;
  const menuListLength = menuList.value.length;
  checkedAllMenu.value = checkedKeysLength === menuListLength;
}

// 暴露组件实例的方法
defineExpose({
  add,
  edit
});
</script>

<style lang="scss" scoped>
.tree-container {
  width: 100%;
}
</style>
