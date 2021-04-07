const app = getApp()
const { getSwiperList } = require('../../http/index')
var network = require('../../utils/network.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var qqmapsdk

// pages/rentedCar/rentedCar.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let cityCode = wx.getStorageSync('cityCode')
    // if (!cityCode) {
    //   this.getMap()
    // } else {
    //   this.setData({
    //     cityCode: cityCode,
    //   })
    // }
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
  //获取位置信息
  getMap() {
    let that = this
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'LOBBZ-Q4ZCJ-2IJFK-KHO4E-AREME-QHF3Y', // 必填
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log('位置信息', res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
          success: function (addressRes) {
            console.log('addressRes', addressRes)
            var city = addressRes.result.address_component.city
            var address =
              addressRes.result.address_component.city +
              addressRes.result.address_component.province +
              addressRes.result.address_component.district
            wx.setStorageSync('locationAddress', address)
            that.setData({
              cityName: city,
            })
            //获取城市code
            network.requestLoading(
              '25/base/v1/base/area/getCityCodeByCityName',
              {
                cityName: city,
              },
              'GET',
              '',
              '',
              function (res) {
                if (res.success) {
                  if (that.data.cityCode == '') {
                    wx.setStorageSync('cityCode', res.data.code)
                    that.setData({
                      cityCode: res.data.code,
                      souceCity: address,
                    })
                  } else {
                    wx.setStorageSync('cityCode', that.data.cityCode)
                    that.setData({
                      souceCity: address,
                    })
                  }
                }
              },
              function (res) {
                wx.showToast({
                  title: '加载数据失败',
                })
              }
            )
          },
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
