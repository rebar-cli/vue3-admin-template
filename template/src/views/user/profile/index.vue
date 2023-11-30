<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="7" :xs="24">
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <el-avatar
                :size="35"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />
                用户名称
                <div class="pull-right">{{ userInfoData.nickname }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="user" />
                账号
                <div class="pull-right">{{ userInfoData.username }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />
                手机号码
                <div class="pull-right">{{ userInfoData.mobile }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />
                用户邮箱
                <div class="pull-right">{{ userInfoData.email }}</div>
              </li>
              <li class="list-group-item">
                <el-icon><OfficeBuilding /></el-icon>
                所属租户
                <div class="pull-right">
                  {{ userInfoData.tenantName }}
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />
                所属部门
                <div class="pull-right">
                  {{ userInfoData.deptName }}
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />
                所属角色
                <div class="pull-right">{{ roles }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />
                创建日期
                <div class="pull-right">{{ userInfoData.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="17" :xs="24">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <!-- <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="state.user" />
            </el-tab-pane> -->
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Profile">
import userAvatar from './userAvatar';
import userInfo from './userInfo';
import resetPwd from './resetPwd';
import useUserStore from '@/store/modules/user';
const activeTab = ref('resetPwd');
const userStore = useUserStore();
const userInfoData = computed(() => userStore.userInfo);
const roles = computed(() => {
  return userInfoData.value.roles.map(role => role.name).join('&');
});
</script>

<style lang="scss" scoped>
:deep(.el-icon) {
  vertical-align: -2px;
}
</style>
