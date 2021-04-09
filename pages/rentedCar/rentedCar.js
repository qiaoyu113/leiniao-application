const app = getApp()
const { getSwiperList } = require('../../http/index')
const utils = require('./utils')

// pages/rentedCar/rentedCar.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotModels: [],
    vehicleList: [],
    fastFeatures: [],
    keyword: '',
    cityCode: '',
    cityName: '北京市',
    defaultData: {
      placeholderTitle: '搜索想租的车',
      cityName: '北京市',
      showSearchBar: true,
      title: '选择城市',
      swiperList: [],
      rentOrBuy: 'rent',
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
    this.getHotModels()
    // this.getVehicleList()
    // this.getFastFeatures()
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
    let that = this
    // wx.getStorage({
    //   key: 'swiperList',
    //   success: function (res) {
    //     that.setData({
    //       swiperList: res.data,
    //     })
    //   },
    //   fail: function () {
    //     //调用轮播图数据
    //     that.getSwiperListHandle()
    //   },
    // })
    //调用轮播图数据
    //that.getSwiperListHandle()
  },
  //获取轮播图数据
  getSwiperListHandle() {
    let that = this
    getSwiperList().then((res) => {
      console.log(res)
      if (res.code === 0) {
        that.setData({
          'defaultData.swiperList': res.data.swiperList,
        })
        wx.setStorage({
          key: 'swiperList',
          data: res.data.swiperList,
        })
      }
    })
  },
  //点击城市事件
  selectLocationEvent() {
    console.log('点击了城市')
    wx.navigateTo({
      url: '/pages/mapList/mapList',
    })
  },

  //跳转爆款上新列表
  gotoadList(e) {
    console.log(e)
    let query = e.detail.params
    console.log(query)
    wx.navigateTo({
      url: `/pages/hotList/hotList?listid=${query}&type=rent`,
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
    let cityname = this.data.cityinfo.name
    this.setData({
      'defaultData.cityName': cityname,
    })
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
  onReachBottom: function () {
    const vehicleList = this.selectComponent('#vehicleList')
    vehicleList && vehicleList.onPageReachBottom()
  },

  onKeywordChange (val) {
    const vehicleList = this.selectComponent('#vehicleList')
    vehicleList && vehicleList.onPageKeywordChange(val)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取热门车型
  getHotModels: function () {
    setTimeout(() => {
      const data = [
        {label: '4.2箱货', id: '123', pic: '/lib/image/home/hot_1.png'},
        {label: '小面', id: '234', pic: '/lib/image/home/hot_2.png'},
        {label: '中面', id: '345', pic: '/lib/image/home/hot_3.png'},
        {label: '依维柯', id: '456', pic: '/lib/image/home/hot_4.png'}
      ]
      this.setData({
        hotModels: data.length > 4 ? data.slice(0, 4) : data
      })
    }, 300);
  },
  // 前往热门车型页面
  onGoHotModel: function (evt) {
    const {info} = evt.currentTarget.dataset
    wx.navigateTo({
      url: '../hotModel/hotModel?name=' + info.label
    })
  }
})
