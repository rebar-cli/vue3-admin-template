import axios from 'axios';

export async function requestSvg(path) {
  return await axios
    .get(path)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      } else {
        return '';
      }
    })
    .catch(err => {
      throw new Error(`读取svgw文件失败：${err}`);
    });
}

export function fillSvg(data, color) {
  data = data.replaceAll(/fill=".*?"/g, `fill="${color}"`);
  return data;
}

export async function svgToBase64(path, color = '#000') {
  if (!path) {
    throw new Error('请传入svg路径');
  }
  try {
    const svgdata = await requestSvg(path);
    const data = fillSvg(svgdata, color);
    const base64 = `data:image/svg+xml;base64,${window.btoa(data)}`;
    return base64;
  } catch (err) {
    console.error(err);
  }
}
