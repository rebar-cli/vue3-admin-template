import auth from '@/plugins/auth';
import router, { constantRoutes } from '@/router';
import Layout from '@/layout/index';
import ParentView from '@/components/ParentView';
import InnerLink from '@/layout/components/InnerLink';
import { getButtonsForCurrentUserApi, getMenuForCurrentUserApi } from '@/api/system-manage/menu-manage';
import { menuTypeMap } from '@/views/system-manage/menu-manage/constant';
import { toBigCamelCase } from '@/utils/index';

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue');

const usePermissionStore = defineStore('permission', {
  state: () => ({
    buttons: [],
    routes: [],
    sidebarRouters: []
  }),
  actions: {
    setRoutes(routes) {
      this.routes = constantRoutes.concat(routes);
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },
    generateRoutes() {
      return new Promise(resolve => {
        // 向后端请求路由数据
        // getMenuForCurrentUserApi().then(res => {
        import('./getRouter.json').then(res => {
          const sdata = JSON.parse(JSON.stringify(res.datas));
          const sidebarRoutes = parseAsyncRouter(sdata);
          const rewriteRoutes = parseAsyncRouter(sdata);
          this.setRoutes(rewriteRoutes);
          this.setSidebarRouters(sidebarRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
    getPermissionButtons() {
      setTimeout(() => {
        const datas = [];
        this.buttons = datas;
      });
    }
  }
});

// 将菜单转换成路由对象
function parseAsyncRouter(routerMap) {
  return routerMap.map(routeItem => {
    // 跳过按钮
    if (routeItem.menuType === menuTypeMap.button) return;
    const route = {
      path: '/' + routeItem.path,
      name: toBigCamelCase(routeItem.path), // 设置name用于tagView组件的keep-alive的缓存
      meta: { icon: routeItem.icon, title: routeItem.menuName, isCache: routeItem.isCache },
      hidden: routeItem.visible
    };

    // Layout ParentView 组件特殊处理
    if (routeItem.component === 'Layout') {
      route.component = Layout;
    } else if (routeItem.component === 'ParentView') {
      route.path = route.path.replace(/\//, '');
      route.component = ParentView;
    } else if (routeItem.component === 'InnerLink') {
      route.component = InnerLink;
    } else {
      route.path = route.path.replace(/\//, '');
      route.component = loadView(routeItem.component);
    }

    if (routeItem.subMenus && routeItem.subMenus.length > 0) {
      route.children = parseAsyncRouter(routeItem.subMenus);
    }
    return route;
  });
}

// 懒加载views视图
export const loadView = view => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

export default usePermissionStore;
