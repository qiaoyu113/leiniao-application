const app = getApp()
const { requestLoading } = require('../../utils/network')
// pages/mapList/mapList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityList: {
    },
    alphabet: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ],
    newList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleList()
  },

  //整合字母表和城市池数据
  handleList() {
    var that = this
    wx.showLoading({
      title: '加载数据...',
    });
    requestLoading(
      'api/base/v3/base/office/getHasLeiNiaoCityGroupHeader',
      {},
      'GET',
      '',
      '',
      function (res) {
        console.log('请求接口res', res)
        if (res.success) {
          let dataList = res.data
          let newarr = []
          let { alphabet, cityList } = that.data
          alphabet.forEach((item) => {
            for (let key in dataList) {
              if (key === item) {
                newarr.push({ key: item, list: dataList[key] })
              }
            }
          })
          that.setData({
            newList: newarr,
          })
          wx.hideLoading()
        }
          },
      function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )

  },

  //点击城市返回首页
  slectCityGoIndex(e) {
    let cityData = e.currentTarget.dataset['index']
    let { cityName, cityCode } = app.globalData.locationCity
    let pages = getCurrentPages() //获取当前页面pages里的所有信息。
    let prevPage = pages[pages.length - 2] //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    //判断所选城市是否是当前定位城市
    if (cityName === cityData.parentName) {
      app.globalData.locationCity.cityUpdata = 0
      console.log('app.globalData.locationCity', app.globalData.locationCity)
      prevPage.setData({
        cityupdata: 0,
      })
    } else {
      //所选城市不是当前城市时，改变全局城市数据
      app.globalData.locationCity.cityName = cityData.parentName
      app.globalData.locationCity.cityCode = cityData.parentId
      app.globalData.locationCity.cityUpdata = 1
      console.log('app.globalData.locationCity', app.globalData.locationCity)
      //传值给上一页
      prevPage.setData({
        cityupdata: 1,
      })
    }
    //最后就是返回上一个页面。
    wx.navigateBack({
      delta: 1, // 返回上一级页面。
    })
  },
  //返回上一页
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1, // 返回上一级页面。
      success: function () {
        console.log('成功！')
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
