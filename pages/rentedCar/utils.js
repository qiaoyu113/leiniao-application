var network = require('../../utils/network.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')
var qqmapsdk
var getMap = function () {
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
          var city = addressRes.result.address_component.city
          wx.setStorageSync('locationCity', city)
          //wx.setStorageSync('locationCity', city)
          console.log('城市名', city)
          var address =
            addressRes.result.address_component.city +
            addressRes.result.address_component.province +
            addressRes.result.address_component.district
          wx.setStorageSync('locationAddress', address)
          //此处加判断，如果获取的城市在开通城市内显示该城市，否则切换到北京
          console.log('that', that)
          that.setData({
            cityName: city,
            'defaultData.cityName': city,
            'cityinfo.name': city,
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
}

module.exports.getMap = getMap
