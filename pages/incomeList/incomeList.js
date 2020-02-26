// pages/incomeList/incomeList.js
var app = getApp();
var network = require("../../utils/network.js");
var url = app.globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeList:[]
  },

  goUpData(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    let lineId = e.currentTarget.dataset.lineid
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../incomeUpData/incomeUpData?id=' + id + '&name=' + name + '&lineId=' + lineId
    });
  },

  goFeedBack(e) {
    wx.navigateTo({
      url: '../question/question?type=0'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '收入提报' //页面标题为路由参数
    });
    let driverId = wx.getStorageSync('driverId')
    this.getData(driverId)
  },

  getData(id){
    let that = this;
    network.requestLoading('api/bss/v1/bss/tender/xique/report-shipping/running-bids', {
      driverId: id
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          that.setData({
            incomeList: res.data
          })
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
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