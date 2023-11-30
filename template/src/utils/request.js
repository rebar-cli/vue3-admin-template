import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import { getToken, removeToken } from '@/utils/auth';
import errorCode from '@/utils/errorCode';
import { tansParams, blobValidate } from '@/utils/ruoyi';
import cache from '@/plugins/cache';
import { saveAs } from 'file-saver';
import APP_CONFIG from '../app-config';

let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // 超时
  timeout: 10000
});

// request拦截器
service.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      };
      const sessionObj = cache.session.getJSON('sessionObj');
      if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        cache.session.setJSON('sessionObj', requestObj);
      } else {
        const s_url = sessionObj.url; // 请求地址
        const s_data = sessionObj.data; // 请求数据
        const s_time = sessionObj.time; // 请求时间
        const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ` + message);
          return Promise.reject(new Error(message));
        } else {
          cache.session.setJSON('sessionObj', requestObj);
        }
      }
    }

    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  res => res.data,
  error => {
    let { message, response } = error;
    console.dir(error);
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      // 未设置状态码则默认成功状态
      const code = response.status || 200;
      const data = response.data;
      // 获取错误信息
      const msg = data.resp_msg || errorCode[code] || errorCode['default'];
      if (code === 401) {
        removeToken();
        location.href = '/login';
      }
      message = msg;
    }
    // 合并相同内容的消息
    ElMessage({
      message,
      grouping: true,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  return service
    .post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params);
        }
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config
    })
    .then(async data => {
      const isBlob = blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
        ElMessage.error(errMsg);
      }
      downloadLoadingInstance.close();
    })
    .catch(r => {
      console.error(r);
      ElMessage.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}

export default async (url = '', params = {}, options = {}) => {
  const method = options.method || 'post';
  if (url.indexOf('http') !== 0 && url.indexOf('https') != 0) {
    let prefix = APP_CONFIG.API_PATH;
    url = prefix + url;
  }
  switch (method) {
    case 'get':
      return service.get(url, {
        params
      });
    case 'upload':
      return service.post(url, params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    case 'downloadGet':
      return service.get(url, {
        params,
        responseType: 'blob'
      });
    case 'download':
      return service.post(url, params, {
        responseType: 'blob'
      });
    case 'postForm':
      return service.post(url, qs.stringify(params), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    case 'postQuery':
      return service.post(url, null, Object.assign(options, { params }));
    case 'post':
      return service.post(url, params, options);
    case 'put':
      return service.put(url, params, options);
    case 'patch':
      return service.patch(url, params, options);
    case 'delete':
      return service.delete(url, { params });
    default:
      return Promise.reject(`unknown request method '${method}'`);
  }
};
