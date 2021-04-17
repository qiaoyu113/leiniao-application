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
      placeholderTitle: '搜索想租的车',
      cityName: '',
      showSearchBar: true,
      title: '选择城市',
      swiperList: [],
      rentOrBuy: 'rent',
      background: '',
    },
    cityupdata: '',
    scrollTop: 0,
    hide: false,
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
        console.log('info',info)
        that.checkCity()
      })
      console.log('utils.getMap')
    } else {
      this.setData({
        cityCode: cityCode,
        'defaultData.cityName': cityName,
      })
    }
<<<<<<< HEAD
    console.log('app',app.globalData.token)
=======
    const vehicleList = this.selectComponent('#vehicleList')
    vehicleList && vehicleList.onParamChange({})
>>>>>>> m1-1.0
  },
  //检查当前获取城市是否在城市列表内
  checkCity(){
    var that = this
    //此处加判断，如果获取的城市在开通城市内显示该城市，否则切换到北京
    requestLoading(
      '/v3/base/office/getHasLeiNiaoCity',
      {},
      'GET',
      '',
      '',
      function (res) {
        console.log('请求接口res', res)
        if (res.success) {
        }
        let dataList = {
          B:[
            {
              id:305,
              seq:4,
              name:'雷鸟租赁',
              type:4,
              parentId:276,
              parentIds:'0,16,275,276',
              areaCode:0,
              dutyId:5,
              parentName:'北京市',
              parentNamePinYin:'BEIJINGSHI'
            }
          ],
          C:[
            {
              id:1596,
              seq:3,
              name:'雷鸟租赁',
              type:4,
              parentId:1575,
              parentIds:'0,16,275,276',
              areaCode:0,
              dutyId:5,
              parentName:'常州市',
              parentNamePinYin:'CHANGZHOUSHI'
            },
            {
              id:1597,
              seq:3,
              name:'雷鸟租赁',
              type:4,
              parentId:1577,
              parentIds:'0,16,275,276',
              areaCode:0,
              dutyId:5,
              parentName:'成都市',
              parentNamePinYin:'CHENGDUSHI'
            }
          ],
          Z:[
            {
              id:1598,
              seq:3,
              name:'雷鸟租赁',
              type:4,
              parentId:1578,
              parentIds:'0,16,275,276',
              areaCode:0,
              dutyId:5,
              parentName:'郑州市',
              parentNamePinYin:'ZHENGZHOUSHI'
            }
          ]
        }
        let newarr = []
        for(let key in dataList){
          dataList[key].forEach(item=>{
            newarr.push(item.parentName)
          })
        }
        console.log('newarr',newarr)
        console.log('当前城市',app.globalData.locationCity.cityName)
        let checkCity = newarr.includes(app.globalData.locationCity.cityName)
    console.log('checkCity', checkCity)
    if (checkCity) {
      that.setData({
        cityCode: app.globalData.locationCity.cityCode,
        'defaultData.cityName': app.globalData.locationCity.cityName,
      })
      console.log('cityCode', app.globalData.locationCity.cityCode)
    } else {
      that.setData({
        cityCode: 276,
        'defaultData.cityName': '北京市',
      })
    }
          },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
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
    // let cityUpdata = this.data.cityupdata
    let { cityName, cityCode, cityUpdata } = app.globalData.locationCity
    this.setData({
      'defaultData.cityName': cityName,
    })
    if (cityUpdata === 1) {
      app.globalData.locationCity.cityUpdata = 0
      //调用切换城市接口
      console.log('城市切换了，调用城市接口')
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
  
  onPageScroll: utils.throttle(function (e) {
    let ev = e[0]
    //判断浏览器滚动条上下滚动
    if (
      ev.scrollTop > this.data.scrollTop ||
      ev.scrollTop == wx.getSystemInfoSync().windowHeight
    ) {
      this.setData({
        hide: true,
        'defaultData.background':
          'linear-gradient(90deg, #009CF8 0%, #2F83FA 100%)',
      })
      //console.log('向下滚动')
    } else {
      if (
        ev.scrollTop < 200 ||
        ev.scrollTop == wx.getSystemInfoSync().windowHeight
      ) {
        this.setData({
          'defaultData.background': '',
        })
      }
      // console.log('向上滚动')
      this.setData({
        hide: false,
      })
    }

    //给scrollTop重新赋值
    let _this = this
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop,
      })
    }, 0)
  }, 50),
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  // 获取热门车型
  getHotModels: function () {
    net.get('v1/car/carHotInfo/getCarHotListForApplets', res => {
      const data = (res.data || []).map((v, i) => {
        v.label = v.name
        // v.pic = v.url // todo
        v.pic = `/lib/image/home/hot_${i + 1}.png`
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
