const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '个人中心' //页面标题为路由参数
    });
  },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  //拨打电话
  talphone() {
    wx.makePhoneCall({
      phoneNumber: '01086469220',
    })
  },
  goRouter(e){
    let type = e.currentTarget.dataset.type;
    let routerName = '';
    if(type == '1'){
      routerName = '../myRecommend/myRecommend'
    }
    wx.navigateTo({
      url: routerName
    });
  }
});