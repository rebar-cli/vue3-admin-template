import request from '@/utils/request';

/**
 *
 * @param { object } params
 * @param { number } params.current
 * @param { number } params.size
 * @param { string } params.nickname 用户名称
 * @returns
 */
export function getUserByPageApi(params) {
  return request('/api-user/users', params, {
    method: 'get'
  });
}

/**
 *
 * @param { object } params
 * @param { number } params.page
 * @param { number } params.limit
 * @param { string } params.queryStr
 * @returns
 */
export function getUserBySearchApi(params) {
  return request('/api-user/users/search', params, {
    method: 'get'
  });
}

export function getUserByListApi(params) {
  return request('/api-user/all/users', params, {
    method: 'get'
  });
}

/**
 * 保存或更新用户信息
 * @param {*} params
 * @param {number} params.id
 * @param {number} params.deptId 部门id
 * @param {number} params.tenantId 租户Id
 * @param {number} params.sort 排序
 * @param {number} params.enabled 是否启用
 * @param {array} params.roleIds 角色集合
 * @param {string} params.nickname 姓名
 * @param {string} params.username 账号
 * @param {string} params.mobile 手机号码
 * @param {string} params.email 邮箱
 * @returns
 */
export function saveOrUpdateUserApi(params) {
  return request('/api-user/users/saveOrUpdate', params, {
    method: 'post'
  });
}

/**
 * 批量删除
 * @param { array } ids
 * @returns
 */
export function deleteUserApi(ids) {
  return request(
    '/api-user/users/delete',
    { ids },
    {
      method: 'post'
    }
  );
}

/**
 * 更新角色状态
 * @param { string | number } userId
 * @param { boolean } status
 * @returns
 */
export function updateUserStatusApi(userId, status) {
  return request(
    '/api-user/users/updateEnabled',
    {
      id: userId,
      enabled: status
    },
    {
      method: 'get'
    }
  );
}

/**
 *
 * @param { object } params
 * @param { string } params.oldPass 旧密码
 * @param { string } params.newPass 新密码
 * @returns
 */
export function updateUserPwdApi(params) {
  return request('/api-user/users/update-password', params, {
    method: 'post'
  });
}
/**
 *
 * @param { string | number } userId
 * @returns
 */
export function resetUserPasswordApi(userId) {
  return request(`/api-user/users/${userId}/password`, null, {
    method: 'post'
  });
}

/**
 * 导出
 * @returns
 */
export function exportUserApi() {
  return request('/api-user/users/export', null, {
    method: 'post',
    responseType: 'blob'
  });
}

/**
 * 导入
 * @param { File } file
 * @returns
 */
export function importUserApi(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api-user/users/import', formData, {
    method: 'post'
  });
}

export function uploadUserAvatarApi(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/api-file/files-anon', formData, {
    method: 'post'
  });
}

/**
 * 当前用户是否是超级管理员
 * @returns
 */
export function isSuperAdmin() {
  return request('/api-user/roles/isSuperAdmin', null, {
    method: 'get'
  });
}
