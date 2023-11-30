import request from '@/utils/request';

// 查询部门列表
export function getDeptListApi(params) {
  return request('/api-user/dept/page', params, {
    method: 'get'
  });
}

// 新增或更新部门
export function saveOrUpdateDeptApi(data) {
  return request('/api-user/dept/add-update', data, {
    method: 'post'
  });
}

// 删除部门
export function deleteDeptApi(ids) {
  return request(
    `/api-user/dept/delete`,
    { ids },
    {
      method: 'post'
    }
  );
}

// 获取租户部门树
export function getDeptTreeByTenantApi(tenantId) {
  return request(
    '/api-user/dept/tenant-dept-tree',
    { tenantId },
    {
      method: 'get'
    }
  );
}

// 获取用户部门树
export function getDeptUserTreeApi(tenantId) {
  return request(
    '/api-user/dept/dept-user-tree',
    { tenantId },
    {
      method: 'get'
    }
  );
}
