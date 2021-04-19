const app = getApp()
const utils = require('./utils')
const net = require('../../utils/network')

const { requestLoading } = require('../../utils/network')
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
    cityName: '',
    defaultData: {
      cityName: '',
      showSearchBar: true,
      title: '选择城市',
      swiperList: [],
      background: '',
    },
    cityupdata: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getHotModels()
    let { cityName, cityCode } = app.globalData.locationCity
    if (!cityCode) {
      utils.getMap.call(this, app).then((info)=>{
        that.checkCity()
      })
    } else {
      this.setData({
        cityCode: cityCode,
        'defaultData.cityName': cityName,
      })
      this.loadData(cityCode)
    }
  },
  //检查当前获取城市是否在城市列表内
  checkCity(){
    var that = this
    //此处加判断，如果获取的城市在开通城市内显示该城市，否则切换到北京
    requestLoading(
      'api/base/v3/base/office/getHasLeiNiaoCityGroupHeader',
      {},
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          let dataList =  res.data
          let newarr = []
          for(let key in dataList){
            dataList[key].forEach(item=>{
              newarr.push(item.parentName)
            })
          }
          let checkCity = newarr.includes(app.globalData.locationCity.cityName)
          const cityCode = checkCity ? app.globalData.locationCity.cityCode : 305
          const cityName = checkCity ? app.globalData.locationCity.cityName : '北京市'
          that.setData({
            cityCode,
            'defaultData.cityName': cityName
          })
          that.loadData(cityCode)
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  },
  loadData (cityCode) {
    const vehicleList = this.selectComponent('#vehicleList')
    vehicleList && vehicleList.onParamChange({searchCityId: cityCode})
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
      url: `/pages/hotList/hotList?listid=${query}`,
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
    // let cityUpdata = this.data.cityupdata
    let { cityName, cityCode, cityUpdata } = app.globalData.locationCity
    this.setData({
      'defaultData.cityName': cityName,
    })
    if (cityUpdata === 1) {
      app.globalData.locationCity.cityUpdata = 0
      //调用切换城市接口
      console.log('城市切换了，当前城市信息', app.globalData.locationCity)
      this.loadData(cityCode)
    } else {
      console.log('城市没有切换，不调用接口')
    }
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  // 获取热门车型
  getHotModels: function () {
    net.get('api/car/v1/car/carHotInfo/getCarHotListForApplets', res => {
      const data = (res.data || []).map((v, i) => {
        v.label = v.name
        v.pic = v.url
        return v
      })
      this.setData({
        hotModels: data.length > 4 ? data.slice(0, 4) : data
      })
    })
  },
  // 前往热门车型页面
  onGoHotModel: function (evt) {
    const { info } = evt.currentTarget.dataset
    app.globalData.hotModelIdList = info.modelIdList
    wx.navigateTo({
      url: '../hotModel/hotModel?name=' + info.label,
    })
  },
})
