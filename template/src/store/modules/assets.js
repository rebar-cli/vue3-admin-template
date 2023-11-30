import { getRoomListApi } from '@/api/assets-manage/room-manage';

const useAssetsStore = defineStore('assets', {
  state: () => ({}),
  actions: {
    // 获取机房列表
    getRoomList() {
      return new Promise((resolve, reject) => {
        const params = {
          current: 1,
          size: -1
        };
        getRoomListApi(params).then(res => {
          const datas = res.datas;
          resolve(datas.records);
        });
      });
    }
  }
});

export default useAssetsStore;
