const { getSwiperList } = require('../../http/index')
const utils = require('../rentedCar/utils')

// pages/saleCar/saleCar.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityCode: '',
    cityName: '北京市',
    defaultData: {
      placeholderTitle: '搜索想买的车',
      cityName: '北京市',
      showSearchBar: true,
      title: '选择城市',
      swiperList: [],
    },
    cityinfo: {
      name: '',
      id: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cityCode = wx.getStorageSync('cityCode')
    let cityName = wx.getStorageSync('locationCity')
    if (!cityCode) {
      utils.getMap.call(this)
    } else {
      this.setData({
        cityCode: cityCode,
        'defaultData.cityName': cityName,
        'cityinfo.name': cityName,
      })
    }
  },

  //点击城市事件
  selectLocationEvent() {
    console.log('点击了城市')
    wx.navigateTo({
      url: '/pages/mapList/mapList',
    })
  },
  //选择城市页面返回上一级
  goBackEvent() {
    console.log('返回上一页')
    wx.navigateTo({
      url: '/pages/saleCar/saleCar',
    })
  },

  //跳转爆款上新列表
  gotoadList(e) {
    console.log(e)
    let query = e.detail.params
    console.log(query)
    wx.navigateTo({
      url: `/pages/hotList/hotList?listid=${query}&type=sale`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('cityinfo', this.data.cityinfo)
    let cityname = this.data.cityinfo.name
    this.setData({
      'defaultData.cityName': cityname,
    })
    //调用根据城市获取车池接口
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
