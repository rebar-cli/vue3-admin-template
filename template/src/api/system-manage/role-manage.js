// 角色管理api
import request from '@/utils/request';

/**
 *
 * @returns
 */
export function getAllRolesApi() {
  return request('/api-user/allRoles', null, {
    method: 'get'
  });
}

/**
 *
 * @param { object } params
 * @param { number } params.current
 * @param { number } params.size
 * @param { string } params.roleName
 * @returns
 */
export function getRoleByPageApi(params) {
  return request('/api-user/roles/page', params, {
    method: 'get'
  });
}

/**
 *
 * @param { object } role
 * @param { string | number } tenantId 应用ID
 * @returns
 */
export function saveOrUpdateRoleApi(role, tenantId) {
  return request('/api-user/roles/saveOrUpdate', role, {
    method: 'post',
    params: {
      tenantId
    }
  });
}

/**
 *
 * @param { string | number } ids
 * @returns
 */
export function deleteRoleApi(ids) {
  return request(
    `/api-user/roles/delete`,
    { ids },
    {
      method: 'post'
    }
  );
}

/**
 *
 * @param { string | number } roleId
 * @param { string | number } tenantId
 * @returns
 */
export function getRoleMenuApi(roleId, tenantId) {
  return request(
    `/api-user/menus/${roleId}/menus`,
    { tenantId },
    {
      method: 'get'
    }
  );
}

/**
 *
 * @param { string | number } roleId
 * @param { Array<string | number > } menuIds
 * @param { string | number } tenantId
 * @returns
 */
export function setRoleMenuApi(roleId, menuIds, tenantId) {
  return request(
    '/api-user/menus/granted',
    {
      roleId,
      menuIds
    },
    {
      method: 'post',
      params: {
        tenantId
      }
    }
  );
}

/**
 * 后台管理查询所有角色
 * @returns
 */
export function allRoles() {
  return request('/api-user/roles/allRoles', null, {
    method: 'get'
  });
}

/**
 * 通过租户id查询角色列表
 * @param { number } tenantId 租户id
 * @returns
 */
export function getRoleByTenantId(params) {
  return request('/api-user/roles/getRoleByTenantId', params, {
    method: 'get'
  });
}
