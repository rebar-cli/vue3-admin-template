import JSEncrypt from 'jsencrypt/bin/jsencrypt.min';

const rsaPublicKey =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjk5TS0Da438rEtgQkdEpV8p6d3twz8hQuBSS1Z+cpSAlRuf2altgo9Ama8Q3M1v0paG7Ezr6ECy5LSh6gEEevZs4koQ0KDIXYXZmQ0XhZcwrKS/4H5LmSJVeky0Kp1lWFLml6QQfso6Yhop5R2nUSuzBGOtBKnjqdrhj00XscXjN9gpk59V96jLZDpflW1qRFOnXBB2pveP9HzRyn7pb1FYW0k8uhNx6aPYYiwUul3i4gQMXXdt6yAKPefyuLCzttbfdaSs8wfyQPVaVmcq/rHyMBzhzfB98E9ZnLEwt4pzrChGrO+nqyjY69hht9hQYhOYbs2joGfAAD5PKVm3v5QIDAQAB';

// rsa加密
export function rsaEncrypt(word) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(rsaPublicKey); // 设置公钥
  return encryptor.encrypt(word); // 对数据进行加密
}
