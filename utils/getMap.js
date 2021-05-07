var network = require('./network.js')
var QQMapWX = require('./qqmap-wx-jssdk.js')

var getMap = function (app) {

  let that = this

  return new Promise((resolve, reject) => {
    // 实例化腾讯地图API核心类
    const qqmapsdk = new QQMapWX({
      key: 'LOBBZ-Q4ZCJ-2IJFK-KHO4E-AREME-QHF3Y', // 必填
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log('gotLocation:', res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log('parsedLoction:', addressRes)
            var {city, province, district} = addressRes.result.address_component
            var address = province + city + district
            console.log(address)
            //获取城市code
            network.requestLoading(
              'api/base/v3/base/office/getOfficeIdByCityName', {
                cityName: city,
              },
              'GET',
              '',
              '',
              function (res) {
                if (res.success) {
                  if (!that.data.cityCode) {
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
                    app.globalData.locationCity = {
                      cityName: city,
                      cityCode: that.data.cityCode,
                    }
                    that.setData({
                      souceCity: address,
                    }, () => {
                      resolve(city)
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
        console.log('getLocationFail:', err)
        reject(err)
      },
    })
  })

}


module.exports.getMap = getMap