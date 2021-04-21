var app = getApp();
var network = require("../../utils/network.js");// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list:[],
    noneType: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },

  getList(){
    var that = this;
    that.setData({
      noneType: false
    })
    //获取我的收藏
    network.requestLoading('255/car/v1/car/cargo/favoriteList',
    {
      "limit": 30,
      "page": that.data.page
    },
    'get',
    '',
    'json',
    function(res) {
      if (res.success) {
        that.setData({
          list: that.data.list.concat(res.data),
          noneType: true
        });
      }
    },
    function(res) {
      wx.showToast({
        title: '加载数据失败',
      });
    });
  },

  // 取消收藏
  cancelCollect(e) {
    let that = this;
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    network.requestLoading('255/car/v1/car/cargo/cancelFavorite',
    {
      "carId": id,
      "rentOrSale": type
    },
    'post',
    '',
    'json',
    function(res) {
      if (res.success) {
        wx.showToast({
          title: '已取消',
        });
        that.onPullDownRefresh()
      } else {
        wx.showToast({
          title: res.errorMsg,
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
    let off = e.currentTarget.dataset.off
    let type = e.currentTarget.dataset.type
    if (!off) {
      wx.navigateTo({
        url: '../carDetail/carDetail?carId=' + id + '&type=' + type
      });
    }
  },

  goRouter() {
    wx.switchTab({
      url: '../rentedCar/rentedCar'
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
    this.setData({
      list: [],
      page: 1
    })
    this.getList()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page;
    page = page + 1;
    this.setData({
      page: page
    })
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let userId = wx.getStorageSync('userId')
    return {
      title: '雷鸟车池',
      path: '/pages/rentedCar/rentedCar?puserId=' + userId + '&source=2',
      imageUrl: '',
      success: function(res) {
        // 转发成功
      },
    }
  }
})