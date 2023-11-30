import { ElMessageBox } from 'element-plus';

const $confirm = (message, ...args) => {
  const title = args.length >= 2 ? args[0] : '提示';
  const option = args.length >= 2 ? args[1] : args[0];
  const defaultOption = {
    title,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  };
  return ElMessageBox.confirm(message, {
    ...defaultOption,
    ...option
  });
};

export function rewriteElementPlusGlobalFunction(app) {
  app.config.globalProperties.$confirm = $confirm;
}
