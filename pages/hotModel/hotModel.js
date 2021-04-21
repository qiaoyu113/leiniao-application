const app = getApp()
// pages/saleCar/saleCar.js
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
      title: options.name // 页面标题为路由参数
    })
    this.init()
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

  init () {
    const vehicleList = this.selectComponent('#vehicleList')
    vehicleList && vehicleList.onParamChange({
      hotModelIdList: app.globalData.hotModelIdList
    }, 'isPageInit=true')
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
    const vehicleList = this.selectComponent('#vehicleList')
    vehicleList && vehicleList.onPageRefresh()
    this.init()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
   onReachBottom: function () {
    const vehicleList = this.selectComponent('#vehicleList')
    vehicleList && vehicleList.onPageReachBottom()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})