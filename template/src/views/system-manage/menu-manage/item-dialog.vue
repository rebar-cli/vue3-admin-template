<template>
  <el-dialog :title="title" v-model="visible" width="680px" append-to-body>
    <el-form ref="formRef" :model="itemData" :rules="itemRules" :validate-on-rule-change="false" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select
              v-model="itemData.parentId"
              :data="menuOptions"
              :props="{
                value: 'id',
                label: 'menuName',
                children: 'children'
              }"
              value-key="menuId"
              placeholder="选择上级菜单"
              check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="itemData.menuType">
              <el-radio :label="0">菜单</el-radio>
              <el-radio :label="1">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isMenu">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              placement="bottom-start"
              :width="540"
              v-model:visible="showChooseIcon"
              trigger="click"
              @show="showSelectIcon"
            >
              <template #reference>
                <el-input
                  ref="iconInputRef"
                  v-model="itemData.icon"
                  placeholder="点击选择图标"
                  @blur="showSelectIcon"
                  v-click-outside="hideSelectIcon"
                  readonly
                >
                  <template #prefix>
                    <svg-icon
                      v-if="itemData.icon"
                      :icon-class="itemData.icon"
                      class="el-input__icon"
                      style="height: 32px; width: 16px"
                    />
                    <el-icon v-else style="height: 32px; width: 16px">
                      <search />
                    </el-icon>
                  </template>
                </el-input>
              </template>
              <icon-select ref="iconSelectRef" @selected="selected" :active-icon="itemData.icon" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="isMenu ? '菜单名称' : '按钮名称'" prop="menuName">
            <el-input v-model="itemData.menuName" :placeholder="isMenu ? '请输入菜单名称' : '请输入按钮名称'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input-number v-model="itemData.sort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="itemData.menuType == 0">
          <el-form-item>
            <template #label>
              <span>
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否外链
              </span>
            </template>
            <el-radio-group v-model="itemData.isFrame">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="12" v-if="isMenu">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="itemData.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isMenu">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input v-model="itemData.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isButton">
          <el-form-item prop="perms">
            <el-input v-model="itemData.perms" placeholder="请输入权限标识" maxlength="100" />
            <template #label>
              <span>
                <el-tooltip
                  content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                  placement="top"
                >
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12" v-if="itemData.menuType == 0">
          <el-form-item>
            <el-input v-model="itemData.query" placeholder="请输入路由参数" maxlength="255" />
            <template #label>
              <span>
                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                路由参数
              </span>
            </template>
          </el-form-item>
        </el-col> -->
        <el-col :span="12" v-if="isMenu">
          <el-form-item prop="isCache">
            <template #label>
              <span>
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="itemData.isCache">
              <el-radio :label="0">不缓存</el-radio>
              <el-radio :label="1">缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isMenu">
          <el-form-item prop="visible">
            <template #label>
              <span>
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                显示状态
              </span>
            </template>
            <el-radio-group v-model="itemData.visible">
              <el-radio :label="0">显示</el-radio>
              <el-radio :label="1">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isMenu">
          <el-form-item prop="status">
            <template #label>
              <span>
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <el-icon><question-filled /></el-icon>
                </el-tooltip>
                菜单状态
              </span>
            </template>
            <el-radio-group v-model="itemData.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">停用</el-radio>
            </el-radio-group>
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
import { getMenuListApi } from '@/api/system-manage/menu-manage';
import IconSelect from '@/components/IconSelect';
import { ClickOutside as vClickOutside } from 'element-plus';
import { menuTypeMap } from './constant';

const { proxy } = getCurrentInstance();
const emits = defineEmits(['submit']);

const title = ref('');
const visible = ref(false);
const formRef = ref();
const iconInputRef = ref();
const menuOptions = ref([]);
const itemData = ref({
  id: null,
  parentId: 1,
  menuName: '',
  menuType: 0,
  sort: 1,
  perms: '',
  isCache: 0,
  visible: 0,
  status: 0
});
const itemRules = computed(() => ({
  menuName: [{ required: true, message: isMenu ? '菜单名称不能为空' : '按钮名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  perms: [{ required: isButton, message: '请输入权限字符', trigger: 'blur' }]
}));
const showChooseIcon = ref(false);
const iconSelectRef = ref(null);
const isMenu = computed(() => itemData.value.menuType === menuTypeMap.menu);
const isButton = computed(() => itemData.value.menuType === menuTypeMap.button);

watch(visible, newVal => {
  if (newVal) {
    getTreeselect();
  }
});

/** 查询菜单下拉树结构 */
function getTreeselect() {
  menuOptions.value = [];
  getMenuListApi().then(res => {
    const menu = { id: 1, menuName: '主类目', children: [] };
    menu.children = proxy.handleTree(res.datas);
    menuOptions.value.push(menu);
  });
}
/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
  showChooseIcon.value = true;
}
/** 选择图标 */
function selected(name) {
  iconInputRef.value.blur();
  itemData.value.icon = name;
  showChooseIcon.value = false;
}
/** 图标外层点击隐藏下拉列表 */
function hideSelectIcon(event) {
  var elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget;
  var className = elem.className;
  if (className !== 'el-input__inner') {
    showChooseIcon.value = false;
  }
}

function add(row) {
  title.value = '新增';
  visible.value = true;
  if (row && row.id) {
    itemData.value.parentId = row.id;
  }
}

function edit(row) {
  title.value = '编辑';
  visible.value = true;
  itemData.value = Object.assign(itemData.value, row);
}

function close() {
  formRef.value.resetFields();
  itemData.value = {
    id: null,
    parentId: 1,
    menuName: '',
    menuType: 0,
    sort: 1,
    perms: '',
    isCache: 0,
    visible: 0,
    status: 0
  };
  visible.value = false;
}

function submit() {
  formRef.value.validate(valid => {
    if (!valid) return;
    emits('submit', { ...itemData.value });
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
