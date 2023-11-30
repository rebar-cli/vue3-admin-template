import { loginApi, getUserInfoApi, logoutApi } from '@/api/login';
import { isSuperAdmin } from '@/api/system-manage/user-manage';
import { getToken, setToken, removeToken } from '@/utils/auth';

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    tenantId: '',
    userInfo: {},
    roles: [],
    isSuperAdmin: false
  }),
  actions: {
    // 登录
    login(userInfo) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          setToken('token');
          resolve();
        });
      });
    },
    // 获取用户信息
    getUserInfo() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const datas = {};
          this.userInfo = datas;
          if (datas.roles && datas.roles.length > 0) {
            // 验证返回的roles是否是一个非空数组
            this.roles = datas.roles;
          } else {
            this.roles = ['ROLE_DEFAULT'];
          }
          resolve(datas);
        }, 500);
      });
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.token = '';
          this.roles = [];
          removeToken();
          resolve();
        });
      });
    },
    setIsSuperAdmin() {
      return new Promise((resolve, reject) => {
        isSuperAdmin()
          .then(res => {
            this.isSuperAdmin = res.datas;
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
});

export default useUserStore;
