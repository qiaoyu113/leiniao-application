var app = getApp();
var network = require("../../utils/network.js");// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getList();
  },

  getList(){
    var that = this;
    //获取车型
    network.requestLoading('25/base/v1/base/dict/dict/list/types',
    ['Intentional_compartment', 'share_receive_time'],
    'post',
    '',
    'json',
    function(res) {
      if (res.success) {
        //过滤picker
        const arrays = res.data.Intentional_compartment
        arrays.forEach((item) => {
          item.check = false;
        })
        that.setData({
          list: arrays
        });
      }
    },
    function(res) {
      wx.showToast({
        title: '加载数据失败',
      });
    });
  },


  // 返回按钮
  onClickLeft() {
    wx.navigateBack({
      delta: 1,
    })
  },

  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../carDetail/carDetail?id=' + id
    });
  },

  goRouter() {
    wx.navigateTo({
      url: '../line/line'
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