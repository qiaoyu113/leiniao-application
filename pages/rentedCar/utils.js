var network = require('../../utils/network.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')

var qqmapsdk
var getMap = function (app) {

  let that = this

  return new Promise((resolve,reject)=>{
    // 实例化腾讯地图API核心类
  qqmapsdk = new QQMapWX({
    key: 'LOBBZ-Q4ZCJ-2IJFK-KHO4E-AREME-QHF3Y', // 必填
  })
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude,
        },
        success: function (addressRes) {
          var city = addressRes.result.address_component.city
          var city_code = addressRes.result.ad_info.city_code
          app.globalData.locationCity = { cityName: city, cityCode: city_code }
          var address =
            addressRes.result.address_component.city +
            addressRes.result.address_component.province +
            addressRes.result.address_component.district
          // that.setData({
          //   cityName: city,
          //   'defaultData.cityName': city,
          // })
          //获取城市code
          network.requestLoading(
            'api/base/v3/base/office/getOfficeIdByCityName',
            {
              cityName: city,
            },
            'GET',
            '',
            '',
            function (res) {
              if (res.success) {
                if (that.data.cityCode == '') {
                  // wx.setStorageSync('cityCode', res.data.code)
                  app.globalData.locationCity = {
                    cityName: city,
                    cityCode: res.data,
                  }
                  that.setData({
                    cityCode: res.data,
                    souceCity: address,
                  }, () => {
                    resolve(city)
                  })
                } else {
                  // wx.setStorageSync('cityCode', that.data.cityCode)
                  app.globalData.locationCity = {
                    cityName: city,
                    cityCode: that.data.cityCode,
                  }
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
    fail(err) {
      reject(err)
    },
  })
  })
  
}


module.exports.getMap = getMap
