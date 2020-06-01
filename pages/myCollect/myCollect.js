// pages/myCollect/myCollect.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的报名' //页面标题为路由参数
    });
    this.getList()
  },

  getList() {
    let that = this;
    //获取线路列表
    network.requestLoading('api/bss/v1/bss/line/task/xcxLineCollections', {
      "key": "",
      "limit": 20,
      "page": that.data.page
    },
      'POST',
      '',
      'json',
      function (res) {
        if (res.success) {
          let arr = res.data;
          for (let i = 0; i < arr.length; i++) {
            arr[i].workingTimeRegin = arr[i].workingTimeRegin.split(",")
          }
          let lists = that.data.list.concat(arr)
          that.setData({
            list: lists
          })
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  //拨打电话
  talphone(e) {
    let lineId = e.currentTarget.dataset.lineid
    network.requestLoading('api/driver/driver/magpie/getCustomerServicePhone', {
      lineId: lineId
    },
    'GET',
    '',
    '',
    function(res) {
      if (res.success) {
        wx.makePhoneCall({
          phoneNumber: res.data.data,
        })
      } else {
        wx.showToast({
          title: '获取手机号失败',
        });
      }
    },
    function(res) {
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
    let page = this.data.page;
    page = page + 1;
    this.setData({
      page: page
    })
    this.getList()
  },

  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../lineDetail/lineDetail?id=' + id
    });
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