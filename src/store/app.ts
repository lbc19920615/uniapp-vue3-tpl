export default defineStore({
  id: 'app',
  state: function(){
    return {
      systemInfo: {}
    } as {
      systemInfo: UniApp.GetSystemInfoResult;
    };
  },
  actions: {
    getSystemInfo(): UniApp.GetSystemInfoResult {
      if (Object.keys(this.systemInfo).length > 0) {
        return this.systemInfo;
      }
      const systemInfo = uni.getSystemInfoSync();
      Object.assign(this.systemInfo, systemInfo);
      return systemInfo;
    }
  }
});
