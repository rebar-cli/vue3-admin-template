<template>
  <div class="app-container">
    <div class="topbar">
      <div class="searchbar">
        <el-input v-model="nickName" placeholder="请输入用户名称" clearable @clear="handleClear"></el-input>
        <el-button class="ml-10" type="primary" icon="Search" @click="handleSearch">查询</el-button>
        <el-button class="ml-10" icon="Refresh" @click="reset">重置</el-button>
      </div>
      <div class="btn-group">
        <el-button v-hasPermi="['system:user:add']" type="primary" icon="Plus" @click="handleAddUser">
          新增用户
        </el-button>
        <el-button v-hasPermi="['system:user:delete']" icon="Delete" @click="handleBatchDel">批量删除</el-button>
      </div>
    </div>
    <div class="table-contianer mt-20">
      <div class="aside">
        <el-tree
          ref="deptTreeRef"
          :data="deptTreeData"
          :props="{ label: 'name', children: 'children' }"
          :default-expand-all="true"
          :expand-on-click-node="false"
          :highlight-current="true"
          node-key="id"
          @current-change="handleChangeCurrentNode"
        />
      </div>
      <div class="main ml-20">
        <el-table ref="tableRef" v-loading="loading" :data="tableData" row-key="id">
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :selectable="row => row.id !== adminUserId"
          ></el-table-column>
          <el-table-column label="姓名" prop="nickname" align="center"></el-table-column>
          <el-table-column label="账号" prop="username" align="center"></el-table-column>
          <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
          <el-table-column
            label="邮箱"
            prop="email"
            align="center"
            :formatter="row => (row.email ? row.email : '-')"
          ></el-table-column>
          <el-table-column label="排序" prop="sort" align="center" sortable></el-table-column>
          <el-table-column
            label="帐号状态"
            prop="enabled"
            align="center"
            :formatter="row => (row.enabled ? '正常' : '停用')"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-popover v-if="row.id !== adminUserId" placement="bottom" trigger="click">
                <div class="operation-btn-group">
                  <el-button v-hasPermi="['system:user:edit']" type="primary" text @click="handleEdit(row)">
                    编辑
                  </el-button>
                  <el-button v-hasPermi="['system:user:delete']" type="primary" text @click="deleteItem(row)">
                    删除
                  </el-button>
                  <el-button
                    v-hasPermi="['system:user:statusSwitch']"
                    type="primary"
                    text
                    @click="updateUserStatus(row)"
                  >
                    {{ row.enabled ? '停用' : '启用' }}
                  </el-button>
                  <!-- <el-button v-hasPermi="['system:user:resetPassword']" type="primary" text @click="resetPassword(row)">重置密码</el-button> -->
                </div>
                <template #reference>
                  <el-button v-hasPermi="['system:user:operation']" type="primary" text>操作</el-button>
                </template>
              </el-popover>
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
    </div>
    <item-dialog ref="itemDialogRef" @submit="handleSubmit" />
  </div>
</template>

<script setup name="User">
// import {
//   deleteUserApi,
//   getUserByPageApi,
//   resetUserPasswordApi,
//   saveOrUpdateUserApi,
//   updateUserStatusApi
// } from '@/api/system-manage/user-manage';
import ItemDialog from './item-dialog.vue';
// import { getDeptTreeByTenantApi } from '@/api/system-manage/dept-manage';
import useUserStore from '@/store/modules/user';

const { proxy } = getCurrentInstance();
const userStroe = useUserStore();

const adminUserId = 1;
const deptTreeRef = ref();
const tableRef = ref();
const itemDialogRef = ref();
const deptTreeData = ref([]);
const nickName = ref('');
const loading = ref(false);
const tableData = ref([]);
const deptId = ref('');
const pageOpt = reactive({
  page: 1,
  limit: 10,
  total: 0
});

function getTableData() {
  // const params = {
  //   current: pageOpt.page,
  //   size: pageOpt.limit,
  //   nickName: nickName.value,
  //   deptId: deptId.value
  // };
  // getUserByPageApi(params).then(res => {
  //   const datas = res.datas;
  //   tableData.value = datas.records;
  //   pageOpt.total = datas.total;
  // });
  tableData.value = [];
  pageOpt.total = 0;
}

function handleClear() {
  nickName.value = '';
  getTableData();
}

function handleSearch() {
  pageOpt.page = 1;
  getTableData();
}

function reset() {
  nickName.value = '';
  deptTreeRef.value.setCurrentKey();
}

function handleAddUser() {
  itemDialogRef.value.add();
}

function handleBatchDel() {
  const selection = tableRef.value.getSelectionRows();
  if (!selection || selection.length <= 0) {
    proxy.$message('请勾选要删除的数据');
    return;
  }
  const hasAdmin = selection.some(item => item.id === adminUserId);
  if (hasAdmin) {
    proxy.$message.warning('不可操作管理员用户！');
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
      deleteUserApi(ids).then(res => {
        proxy.$message.success(res.resp_msg);
        getTableData();
      });
    });
}

function handleEdit(row) {
  itemDialogRef.value.edit(row);
}

function handleSubmit(itemData) {
  saveOrUpdateUserApi(itemData).then(res => {
    proxy.$message.success(res.resp_msg);
    getTableData();
  });
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
      deleteUserApi(ids).then(res => {
        proxy.$message.success(res.resp_msg);
        getTableData();
      });
    });
}

function updateUserStatus(row) {
  updateUserStatusApi(row.id, !row.enabled).then(res => {
    proxy.$message.success(res.resp_msg);
    getTableData();
  });
}

function getDeptTreeByTenant() {
  getDeptTreeByTenantApi().then(res => {
    const datas = res.datas.map(item => ({
      id: item.tenantId,
      name: item.tenantName,
      children: item.deptTree,
      isRoot: true
    }));
    deptTreeData.value = datas;
  });
}

function handleChangeCurrentNode(data) {
  if (data) {
    if (data.isRoot) {
      tenantId.value = data.id;
      deptId.value = '';
    } else {
      tenantId.value = '';
      deptId.value = data.id;
    }
  } else {
    tenantId.value = userStroe.isSuperAdmin ? '' : userStroe.tenantId;
    deptId.value = '';
  }

  getTableData();
}

function resetPassword(row) {
  proxy
    .$confirm('确定要重置此用户密码吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      resetUserPasswordApi(row.id).then(res => {
        proxy.$message.success(res.resp_msg);
      });
    });
}


getTableData();
</script>

<style lang="scss" scoped>
.table-contianer {
  display: flex;
  flex-direction: row;

  .aside {
    width: 300px;

    .search-icon {
      cursor: pointer;
      margin-left: 0;
    }
  }

  .main {
    width: calc(100% - 300px);
  }
}

.topbar {
  display: flex;
  justify-content: space-between;

  .searchbar,
  .btn-group {
    display: flex;
  }
}

.operation-btn-group {
  display: flex;
  flex-direction: column;

  ::v-deep(.el-button + .el-button) {
    margin-left: 0;
  }
}
</style>
