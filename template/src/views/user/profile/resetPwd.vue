<template>
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="100px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password />
    </el-form-item>
    <el-form-item prop="newPassword">
      <template #label>
        <span>
          <el-tooltip placement="top">
            <template #content>
              1. 新密码长度应在
              <strong>8 到 20</strong>
              个字符
              <br />
              2. 新密码应为
              <strong>字母+数字+特殊字符</strong>
              的组合
              <br />
              3. 新密码不能
              <strong>重复字符3位或3位以上</strong>
              <br />
              4. 新密码不能
              <strong>在逻辑上连续字符3位或3位以上</strong>
              <br />
              5. 新密码不能
              <strong>在键盘排序上连续字符3位或3位以上</strong>
              <br />
            </template>
            <el-icon><question-filled /></el-icon>
          </el-tooltip>
          新密码
        </span>
      </template>
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { updateUserPwdApi } from '@/api/system-manage/user-manage';
import useUserStore from '@/store/modules/user';
import { rsaEncrypt } from '@/utils/encryptUserInfo';
import { isContinuousKeyCode } from '@/utils/validate';

const { proxy } = getCurrentInstance();
const userStore = useUserStore();

const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
});

const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@^!%*#?&])[A-Za-z\d$@^!%*#?&]{8,20}$/,
      message: '新密码应为字母+数字+特殊字符的组合',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        const arr = value.split('');
        for (let i = 1; i < arr.length - 1; i++) {
          const firstIndex = arr[i - 1].charCodeAt();
          const secondIndex = arr[i].charCodeAt();
          const thirdIndex = arr[i + 1].charCodeAt();
          if (firstIndex === secondIndex && secondIndex === thirdIndex) {
            callback(new Error('新密码不能重复字符3位或3位以上'));
            break;
          }
          if (thirdIndex - secondIndex == 1 && secondIndex - firstIndex == 1) {
            callback(new Error('新密码不能在逻辑上连续字符3位或3位以上'));
            break;
          }
        }
        callback();
      },
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        const boolean = isContinuousKeyCode(value, 3);
        if (boolean) {
          callback(new Error('新密码不能在键盘排序上连续字符3位或3位以上'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      required: true,
      validator: (rule, value, callback) => {
        if (user.newPassword !== value) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

/** 提交按钮 */
function submit() {
  proxy.$refs.pwdRef.validate(valid => {
    if (valid) {
      const params = {
        oldPass: rsaEncrypt(user.oldPassword),
        newPass: rsaEncrypt(user.newPassword)
      };
      updateUserPwdApi(params).then(response => {
        proxy.$modal.msgSuccess('修改成功');
        userStore.logOut().then(() => {
          location.href = '/index';
        });
      });
    }
  });
}
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage();
}
</script>
