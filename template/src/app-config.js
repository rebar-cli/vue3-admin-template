const APP_CONFIG = {
  clientId: 'webApp', // 应用id
  clientSecret: 'webApp', // 应用秘钥
  API_PATH: import.meta.env.VITE_APP_BASE_API ? import.meta.env.VITE_APP_BASE_API : ''
};

export default APP_CONFIG;
