import usePermissionStore from '@/store/modules/permission';

export default {
  mounted(el, binding, vnode) {
    const { value } = binding;
    const permissionButtons = usePermissionStore().buttons;
    watch(permissionButtons, newBtns => {
      if (newBtns.length === 0) return;
      if (value && value instanceof Array && value.length > 0) {
        const permissionFlag = value;
        const hasPermissionButtons = newBtns.some(permission => {
          return permissionFlag.includes(permission.perms);
        });

        if (!hasPermissionButtons) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      } else {
        throw new Error(`请设置操作权限标签值`);
      }
    });
  }
};
