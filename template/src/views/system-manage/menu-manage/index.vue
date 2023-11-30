<template>
  <div class="app-container">
    <div class="mb-8">
      <el-button v-hasPermi="['system:menu:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
    </div>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="tableData"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <template #empty>
        <img src="@/assets/images/empty-icon.png" alt="" />
        <p>没有找到你要的数据</p>
      </template>
      <el-table-column prop="menuName" label="菜单名称" width="180" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template #default="{ row }">
          <svg-icon v-if="row.icon" :icon-class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60" align="center"></el-table-column>
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column prop="path" label="路由地址" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="['success', 'warning'][row.status]">{{ ['正常', '停用'][row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" prop="createTime" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210" align="center">
        <template #default="{ row }">
          <el-button v-hasPermi="['system:menu:edit']" type="primary" text @click="handleUpdate(row)">编辑</el-button>
          <el-button v-hasPermi="['system:menu:add']" type="primary" text @click="handleAdd(row)">新增</el-button>
          <el-button v-hasPermi="['system:menu:delete']" type="primary" text @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <item-dialog ref="itemDialogRef" @submit="handleSubmit" />
  </div>
</template>

<script setup name="Menu">
import ItemDialog from './item-dialog.vue';
import SvgIcon from '@/components/SvgIcon';
// import { deleteMenuApi, getMenuListApi, saveOrUpdateMenuApi } from '@/api/system-manage/menu-manage';

const { proxy } = getCurrentInstance();

const tableData = ref([]);
const loading = ref(false);

const isExpandAll = ref(false);
const refreshTable = ref(true);
const itemDialogRef = ref();

/** 查询菜单列表 */
function getTableData() {
  loading.value = true;
  setTimeout(() => {
    const datas = [];
    tableData.value = proxy.handleTree(datas, 'id');
    loading.value = false;
  }, 500);
}

/** 新增按钮操作 */
function handleAdd(row) {
  itemDialogRef.value.add(row);
}
/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  itemDialogRef.value.edit(row);
}

/** 删除按钮操作 */
function handleDelete(row) {
  const ids = [row.id];
  proxy.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?').then(() => {
    deleteMenuApi(ids).then(res => {
      proxy.$modal.msgSuccess(res.resp_msg);
      getTableData();
    });
  });
}

function handleSubmit(itemData) {
  saveOrUpdateMenuApi(itemData).then(res => {
    proxy.$message.success(res.resp_msg);
    getTableData();
  });
}

getTableData();
</script>
