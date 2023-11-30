<template>
  <div class="app-container">
    <div class="topbar">
      <div class="searchbar">
        <el-input v-model="roleName" placeholder="请输入角色名称" clearable @clear="handleClear"></el-input>
        <el-button class="ml-10" type="primary" icon="Search" @click="handleSearch">查询</el-button>
      </div>
      <div class="btn-group">
        <el-button v-hasPermi="['system:role:add']" type="primary" icon="Plus" @click="handleAddRole">
          新增角色
        </el-button>
        <el-button v-hasPermi="['system:role:delete']" icon="Delete" @click="handleBatchDel">批量删除</el-button>
      </div>
    </div>
    <div class="table-container mt-20">
      <el-table ref="tableRef" :data="tableData" row-key="id">
        <template #empty>
          <img src="@/assets/images/empty-icon.png" alt="" />
          <p>没有找到你要的数据</p>
        </template>
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="row => row.code !== adminCode"
        ></el-table-column>
        <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="code" label="角色代号" align="center"></el-table-column>
        <el-table-column prop="description" label="角色说明" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <el-button
              v-hasPermi="['system:role:edit']"
              v-if="row.code !== adminCode"
              type="primary"
              text
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-hasPermi="['system:role:delete']"
              v-if="row.code !== adminCode"
              type="primary"
              text
              @click="deleteItem(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="mt-10"
        v-bind="pageOpt"
        v-model:page="pageOpt.page"
        v-model:limit="pageOpt.limit"
        @change="getTableData"
        background
      ></pagination>
    </div>
    <item-dialog ref="itemDialogRef" @submit="handleSubmit" />
  </div>
</template>

<script setup name="Role">
import ItemDialog from './item-dialog.vue';
// import { deleteRoleApi, getRoleByPageApi, saveOrUpdateRoleApi } from '@/api/system-manage/role-manage';
import APP_CONFIG from '@/app-config';

const { proxy } = getCurrentInstance();

const adminCode = 'superAdmin';
const tableRef = ref();
const itemDialogRef = ref();
const roleName = ref('');
const tableData = ref([]);
const pageOpt = reactive({
  page: 1,
  limit: 10,
  total: 0
});

function getTableData() {
  const params = {
    current: pageOpt.page,
    size: pageOpt.limit,
    roleName: roleName.value
  };
  setTimeout(() => {
    const datas = {records: [], total: 0};
    tableData.value = datas.records;
    pageOpt.total = datas.total;
  }, 500);
}

function handleClear() {
  roleName.value = '';
  getTableData();
}

function handleSearch() {
  pageOpt.page = 1;
  getTableData();
}

function handleAddRole() {
  itemDialogRef.value.add();
}

function handleBatchDel() {
  const selection = tableRef.value.getSelectionRows();
  if (!selection || selection.length <= 0) {
    proxy.$message('请勾选要删除的数据');
    return;
  }
  const hasAdmin = selection.some(item => item.code === adminCode);
  if (hasAdmin) {
    proxy.$message.warning('不可操作管理员角色！');
    return;
  }
  proxy
    .$confirm('确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      const ids = selection.map(item => item.id);
      deleteRoleApi(ids).then(res => {
        proxy.$message.success(res.resp_msg);
        getTableData();
      });
    });
}

function handleEdit(row) {
  itemDialogRef.value.edit(row);
}

function deleteItem(row) {
  const ids = [row.id];
  proxy
    .$confirm('确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      deleteRoleApi(ids).then(res => {
        proxy.$message.success(res.resp_msg);
        getTableData();
      });
    });
}

function handleSubmit(itemData) {
  saveOrUpdateRoleApi(itemData, APP_CONFIG.clientId).then(res => {
    proxy.$message.success(res.resp_msg);
    getTableData();
  });
}

getTableData();
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  justify-content: space-between;

  .searchbar,
  .btn-group {
    display: flex;
  }
}
</style>
