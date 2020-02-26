// pages/myOrderRefundSuccess/myOrderRefundSuccess.js
let timeOut = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    wx.setNavigationBarTitle({
      title: '上报成功' //页面标题为路由参数
    });
    timeOut = setTimeout(() => {
      this.goDetail()
    }, 3000)
  },

  goDetail: function () {
    let that = this;
    clearTimeout(timeOut)
    wx.redirectTo({
      url: '../income/income?id=' + that.data.id
    });
  },

  goIndex: function () {
    clearTimeout(timeOut)
    wx.switchTab({
      url: '/pages/index/index'
    });
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

  }
})