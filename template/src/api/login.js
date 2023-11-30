import APP_CONFIG from '@/app-config';
import request from '@/utils/request';
import qs from 'qs';
/**
 *
 * @param { Object } params
 * @param { string } params.username
 * @param { string } params.password
 * @param { string } params.validCode
 * @param { string } params.deviceId
 * @param { string } params.grant_type
 * @param { string } tenantId
 * @returns
 */
export function loginApi(params, tenantId) {
  return request('/api-uaa/oauth/token', qs.stringify(params), {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Authorization: 'Basic ' + window.btoa(APP_CONFIG.clientId + ':' + APP_CONFIG.clientSecret),
      tenantId
    }
  });
}

/**
 *
 * @returns
 */
export function getUserInfoApi() {
  return request('/api-user/users/current', null, {
    method: 'get'
  });
}

// 注销
export function logoutApi() {
  return request('/api-uaa/oauth/remove/token', null, {
    method: 'get'
  });
}
