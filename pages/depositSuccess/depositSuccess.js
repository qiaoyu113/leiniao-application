// pages/depositSuccess/depositSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提现成功' //页面标题为路由参数
    });
  },

  goHome: function () {
    let that = this;
    var pagelist = getCurrentPages();
    var len = pagelist.length;
    var init = 0;
    var index = 0;
    for (var i = 0; i < len; i++) {
      if (pagelist[i].route.indexOf("site/index") >= 0) { //看路由里面是否有首页
        init = 1;
        index = i;
      }
    }
    if (init == 1) {
      wx.navigateBack({
        delta: len - i - 1
      });
    } else {
      wx.reLaunch({
        url: "/pages/index/index" //这个是默认的单页
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let userId = wx.getStorageSync('userId')
    return {
      title: '自主创业，随时上岗；货源稳定、线路优质；购车保收入10万+/年',
      path: '/pages/index/index?puserId=' + userId + '&source=2',
      imageUrl: '../../lib/image/shareImg.jpg',
      success: function (res) {
        // 转发成功
      },
    }
  }
})