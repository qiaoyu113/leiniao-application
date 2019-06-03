// pages/lineDetail/lineDetail.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var network = require("../../utils/network.js");
var url = app.globalData.url;
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendState: false,
    markers:[],
    poi:'',
    mapShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '货主名称' //页面标题为路由参数
    });
    var that = this
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'LOBBZ-Q4ZCJ-2IJFK-KHO4E-AREME-QHF3Y' // 必填
    });
    //1、获取当前位置坐标
    qqmapsdk.geocoder({
      address: '北京市朝阳区蓝色港湾',  //搜索关键词
      success: function (res) { //搜索成功后的回调
        var res = res.result;
        var latitude = Number(res.location.lat);
        var longitude = Number(res.location.lng);
        //根据地址解析在地图上标记解析地址位置
        that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          markers: [{
            id: 0,
            title: res.title,
            latitude: latitude,
            longitude: longitude,
            iconPath: '../../lib/image/icon1.png',//图标路径
            width: 20,
            height: 20,
            callout: { //可根据需求是否展示经纬度
              content: latitude + ',' + longitude,
              color: '#000',
              display: 'ALWAYS'
            }
          }],
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          }
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  openRecommend(){
    this.setData({
      recommendState: true,
      mapShow: false
    })
  },

  closeRecommend() {
    this.setData({
      recommendState: false,
      mapShow: true
    })
  },

  // 防止滑动
  myCatchTouch: function () {
    return;
  },

  goRecommendDetail() {
    wx.navigateTo({
      url: '../recommendDetail/recommendDetail'
    });
  },

  goRecommend() {
    wx.navigateTo({
      url: '../recommend/recommend'
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