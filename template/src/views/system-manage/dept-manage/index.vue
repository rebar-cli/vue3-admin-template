<template>
  <div class="app-container">
    <div class="topbar">
      <div class="searchbar">
        <el-input v-model="deptName" placeholder="请输入部门名称" clearable @clear="handleClear"></el-input>
        <el-button class="ml-10" type="primary" icon="Search" @click="handleSearch">查询</el-button>
        <el-button class="ml-10" icon="Refresh" @click="reset">重置</el-button>
      </div>
      <div class="btn-group">
        <el-button v-hasPermi="['system:dept:add']" type="primary" icon="Plus" @click="handleAddDept">新增</el-button>
        <el-button v-hasPermi="['system:dept:delete']" icon="Delete" @click="handleBatchDel">批量删除</el-button>
      </div>
    </div>
    <el-container class="table-container">
      <el-aside>
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
      </el-aside>
      <el-main>
        <el-table ref="tableRef" :data="tableData" height="calc(100% - 42px)" row-key="deptId">
          <template #empty>
            <img src="@/assets/images/empty-icon.png" alt="" />
            <p>没有找到你要的数据</p>
          </template>
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="name" label="部门名称" width="120" align="center"></el-table-column>
          <el-table-column prop="leaderUser" label="负责人" align="center"></el-table-column>
          <el-table-column prop="phone" label="负责人电话" width="120" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button v-hasPermi="['system:dept:edit']" type="primary" text @click="handleEdit(row)">编辑</el-button>
              <el-button v-hasPermi="['system:dept:delete']" type="primary" text @click="deleteItem(row)">
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
      </el-main>
    </el-container>
    <item-dialog ref="itemDialogRef" @submit="handleSubmit" />
  </div>
</template>

<script setup name="Dept">
import {
  deleteDeptApi,
  getDeptListApi,
  getDeptTreeByTenantApi,
  saveOrUpdateDeptApi
} from '@/api/system-manage/dept-manage';
import useUserStore from '@/store/modules/user';
import itemDialog from './item-dialog.vue';

const { proxy } = getCurrentInstance();
const userStroe = useUserStore();

const deptTreeRef = ref();
const tableRef = ref();
const itemDialogRef = ref();
const deptName = ref('');
const deptId = ref('');
const deptTreeData = ref([]);
const tenantId = ref(userStroe.isSuperAdmin ? '' : userStroe.tenantId);
const tableData = ref([]);
const pageOpt = reactive({
  page: 1,
  limit: 10,
  total: 0
});

async function getTableData() {
  const params = {
    current: pageOpt.page,
    size: pageOpt.limit,
    deptId: deptId.value,
    deptName: deptName.value,
    tenantId: tenantId.value
  };
  const res = await getDeptListApi(params);
  const datas = res.datas;
  tableData.value = datas.records;
  pageOpt.total = datas.total;
}

async function getDeptTreeByTenant() {
  const res = await getDeptTreeByTenantApi();
  const datas = res.datas.map(item => ({
    id: item.tenantId,
    name: item.tenantName,
    children: item.deptTree,
    isRoot: true
  }));
  deptTreeData.value = datas;
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

function handleClear() {
  deptName.value = '';
  init();
}

function handleSearch() {
  pageOpt.page = 1;
  init();
}

function reset() {
  deptName.value = '';
  deptTreeRef.value.setCurrentKey();
}

function handleAddDept() {
  itemDialogRef.value.add();
}

function handleBatchDel() {
  const selection = tableRef.value.getSelectionRows();
  if (!selection || selection.length <= 0) {
    proxy.$message('请勾选要删除的数据');
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
      deleteDeptApi({ ids }).then(res => {
        proxy.$message.success(res.resp_msg);
        init();
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
      deleteDeptApi({ ids }).then(res => {
        proxy.$message.success(res.resp_msg);
        init();
      });
    });
}

function handleSubmit(itemData) {
  saveOrUpdateDeptApi(itemData).then(res => {
    proxy.$message.success(res.resp_msg);
    init();
  });
}

async function init() {
  await getDeptTreeByTenant();
  await getTableData();
}

init();
</script>

<style lang="scss" scoped>
.app-container {
  box-sizing: border-box;
}
.topbar {
  display: flex;
  justify-content: space-between;

  .searchbar,
  .btn-group {
    display: flex;
  }
}

:deep(.el-aside) {
  background: #fff;
}

.table-container {
  height: calc(100% - 32px);
}
</style>
