import JSEncrypt from 'jsencrypt/bin/jsencrypt.min';

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlHO0pnpB904eHXrYf2clGii2vwFhN00zdVxP2JQvt015RCZnVC6S0JLSERW7TfrVYjGpHs7WlaDw1eGRV3917333vFb80qZ4RUIOW8/r9axtBMhjTSIMoKS+oqbbDHR78Y1rZJg5RJlk/8xvVv64l1mG6dijg/ncnWef6MkW+zhdgOoeKOFLp3f9qiPnlGr0+SNQwJCGzsdjwpiRQyOnw+sYLo0GWp/P3/SZUuA/K3obhHXUvs3aOnulSzzpnE1XJ2TGtQ4JcmMUZO6cHAhaM5SRXnR77Odeb+ZUNmFk2xfdM3TGqwgt8lIa0dsjDvmXRWGnlxczhklnoY3Q9hadAwIDAQAB`;

// const privateKey = '';

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
}

// // 解密
// export function decrypt(txt) {
//   const encryptor = new JSEncrypt();
//   encryptor.setPrivateKey(privateKey); // 设置私钥
//   return encryptor.decrypt(txt); // 对数据进行解密
// }
