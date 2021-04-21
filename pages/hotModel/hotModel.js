const net = require('../../utils/network')
// pages/saleCar/saleCar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name // 页面标题为路由参数
    })
    this.setData({
      hotId: options.id
    }, this.init)
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
    net.get('api/car/v1/car/carHotInfo/getCarHotListForApplets', res => {
      const hotModelIdList = ((res.data || []).find(v => parseInt(v.id) === parseInt(this.data.hotId)) || {}).modelIdList
      if (hotModelIdList) {
        const vehicleList = this.selectComponent('#vehicleList')
        vehicleList && vehicleList.onParamChange({
          hotModelIdList
        }, 'isPageInit=true')
      } else {
        if (res.success) {
          wx.showToast({title: '数据可能已过期，请返回刷新重试'})
        }
      }
    })
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