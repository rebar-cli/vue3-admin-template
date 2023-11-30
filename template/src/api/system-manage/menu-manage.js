// 菜单管理api
import request from '@/utils/request';

/**
 * 获取所有菜单
 * @param { object } params
 * @param { string | number } params.tenantId 应用ID
 * @returns
 */
export function getMenuListApi(params) {
  return request('/api-user/menu-new/all', params, {
    method: 'get'
  });
}

/**
 * 获取所有菜单-树形结构
 * @param { object } params
 * @param { string | number } params.tenantId 应用ID
 * @returns
 */
export function getMenuTreeApi(params) {
  return request('/api-user/menu-new/all-tree', params, {
    method: 'get'
  });
}

/**
 * 批量删除菜单
 * @param { string | number } ids
 * @returns
 */
export function deleteMenuApi(ids) {
  return request(
    `/api-user/menu-new/delete`,
    { ids },
    {
      method: 'post'
    }
  );
}

/**
 * 新增或更新菜单
 * @param { object } params
 * @returns
 */
export function saveOrUpdateMenuApi(params) {
  return request('/api-user/menu-new/saveOrUpdate', params, {
    method: 'post'
  });
}

/**
 * 查询角色拥有的菜单权限
 * @param { number } roleId 角色id
 * @returns
 */
export function getMenuIdByRole(roleId) {
  return request(
    '/api-user/menu-new/menus-by-role',
    { roleId },
    {
      method: 'get'
    }
  );
}

/**
 * 查询当前用户的菜单
 * @param { number } roleId 角色id
 * @returns
 */
export function getMenuForCurrentUserApi() {
  return request('/api-user/menu-new/current-user-menus', null, {
    method: 'get'
  });
}

/**
 * 查询当前用户的按钮
 * @returns
 */
export function getButtonsForCurrentUserApi() {
  return request('/api-user/menu-new/current-user-button', null, {
    method: 'get'
  });
}
