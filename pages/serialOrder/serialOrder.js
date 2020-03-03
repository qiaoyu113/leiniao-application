// pages/serialOrder/serialOrder.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option2: [
      { text: '全部', value: '0' },
      { text: '已确认', value: '1' },
      { text: '未确认', value: '2' }
    ],
    dateName: '日期',
    date: '',
    value2: '0',
    activeName: '1',
    orderList: [
      {
        name: '2020-01',
        totalPrice: '200',
        incomeList: [
          {
            time: '2020-01-10',
            price: '350',
            type: '1',
          },
          {
            time: '2020-01-10',
            price: '350',
            type: '3',
          },
          {
            time: '2020-01-10',
            price: '350',
            type: '1',
          },
          {
            time: '2020-01-10',
            price: '350',
            type: '2',
          },
        ]
      },
      {
        name: '2020-02',
        totalPrice: '200',
        checked: false,
        incomeList: [
          {
            time: '2020-01-10',
            price: '350'
          },
          {
            time: '2020-01-10',
            price: '350'
          },
          {
            time: '2020-01-10',
            price: '350'
          },
          {
            time: '2020-01-10',
            price: '350'
          },
        ]
      },
      {
        name: '2020-03',
        totalPrice: '200',
        checked: false,
        incomeList: [
          {
            time: '2020-01-10',
            price: '350',
            checked: false
          },
          {
            time: '2020-01-10',
            price: '350',
            checked: true
          },
          {
            time: '2020-01-10',
            price: '350',
            checked: true
          },
          {
            time: '2020-01-10',
            price: '350',
            checked: false
          },
        ]
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '运费流水' //页面标题为路由参数
    });
  },

  //日期选择
  getDateTime(e) {
    let that = this;
    let stringTime = e.detail.value + "-01 00:00:00";
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    this.setData({
      date: timestamp2,
      dateName: e.detail.value
    })
  },

  //塞选
  onSwitch1Change({ detail }) {
    this.setData({ value2: detail });
  },

  //选择时间订单
  onChange(event) {
    this.setData({
      activeName: event.detail
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