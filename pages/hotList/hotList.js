const app = getApp()
const util = require('../../utils/storage.js')
const { requestLoading } = require('../../utils/network')
// pages/hotList/hotList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carList: [],
    showCommend: true,
    rentOrSale: '',
    dataList: [],
    pull: {
      isLoading: false,
      loading: '../../lib/image/rentcarimg/pull_refresh.gif',
      pullText: '正在加载',
    },
    push: {
      isLoading: false,
      loading: '../../lib/image/rentcarimg/pull_refresh.gif',
      pullText: '',
    },
    showList: true,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.type === 'rent') {
      this.setData({
        rentOrSale: 'rent',
      })
    } else {
      this.setData({
        rentOrSale: 'sale',
      })
    }

    if (options.listid === '1') {
      //超值爆款
      this.setData({
        showCommend: true,
      })
    } else {
      //今日上新
      this.setData({
        showCommend: false,
      })
    }
    this.refresh()
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

  //跳转车辆详情页
  gotoCarDetail(e) {
    var id = e.currentTarget.dataset['index']
    //判断是否租出或者售出
    var itemindex = this.data.carList.findIndex((item) => {
      if (item.carId === id) {
         return item
      }
    })
    var status = this.data.carList[itemindex].status
    console.log('itemindex',itemindex,'status',status)
    if(status!==40&&status!==50){

      wx.getStorage({
        key:'phoneName',
        success:(res)=>{
          console.log('登录成功，调取接口',res)
          wx.navigateTo({
            url: `/pages/carDetail/carDetail?carId=${id}&type=${this.data.rentOrSale}`,
          })
        },
        fail:(res)=>{
          console.log('没有登录，需要登录',res)
          wx.navigateTo({
            url:  "/pages/shareLogin/shareLogin",
          })
        }
      })
    }
  },

  //返回上一页
  handlerGobackClick() {
    wx.navigateBack({
      delta: 1, // 返回上一级页面。
      success: function () {
      },
    })
  },
  //下拉刷新
  refresh() {
    let type
    this.data.rentOrSale=='rent'?type=1:type=2
    this.setData({
      page:1,
      'pull.isLoading': true,
      'pull.loading': '../../lib/image/rentcarimg/pull_refresh.gif',
      'pull.pullText': '正在加载',
    })
    if(this.data.showCommend){
      //请求超值爆款接口
      this.getVogueList(type,1)
    }else{
      //请求今日上新接口
      this.getNewList(type,1)
    }
  },
  //上拉加载
  toload(e) {
    var type
    this.data.rentOrSale=='rent'?type=1:type=2
    var page = this.data.page += 1
    console.log('page',page)
    if(this.data.showCommend){
      //请求超值爆款接口
      this.getVogueList(type,page)
    }else{
      //请求今日上新接口
      this.getNewList(type,page)
    }
      this.setData({
        'push.isLoading': true,
        'push.pullText': '正在加载',
        'push.loading': '../../lib/image/rentcarimg/pull_refresh.gif',
      })
      // {
      //   title: '福田欧曼GTL载货车福田欧曼G1111111111111111111111',
      //   age: '2个月',
      //   km: '7万公里',
      //   feature: [
      //     { name: '准新车', type: 1 },
      //     { name: '急租', type: 1 },
      //     { name: '有尾板', type: 0 },
      //     { name: '有通行证', type: 0 },
      //   ],
      //   recommendReason:
      //     '准新车，车况良好，无任何隐患，不限行，火热降价急租中,准新车，车况良好，无任何隐患，不限行，火热降价急租中',
      //   type: 1,
      //   picurl: '',
      //   price: 3000,
      //   id: 1,
      //   rentout: 0,
      // },
  },

  //获取超值爆款列表
  getVogueList(type,page){
    var that = this
    //请求列表接口
    requestLoading(
      'api/car_center/v1/cargo/getVogueList',
      {searchType:type,
       searchCityId:app.globalData.locationCity.cityCode,
      //searchCityId:110100,
      pageNumber:page
      },
      'POST',
      '',
      'json',
      function (res) {
        console.log('请求接口res', res)
        if (res.success) {
        }
        let cardata = res.data
        that.getListHandle(cardata,page)
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  },
  //获取今日上新接口
  getNewList(type,page){
    var that = this
    //请求列表接口
    requestLoading(
      'api/car_center/v1/cargo/getNewestCarList',
      {searchType:type,
        searchCityId:110100,
        pageNumber:page},
      'POST',
      '',
      'json',
      function (res) {
        console.log('请求接口res', res)
        if (res.success) {
        }
        let cardata = res.data
        that.getListHandle(cardata,page)
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    )
  },
  //提取两个接口重复代码
  getListHandle(cardata,page){
    var that = this
    if (cardata.length) {
      if(page>1){
        let newcarList = that.data.carList.concat(cardata)
        that.setData({
          carList: newcarList,
        })
      }else{
        that.setData({
          carList:cardata
        })
      }
      that.setData({
        'pull.loading': '../../lib/image/rentcarimg/finish.png',
          'pull.pullText': '刷新完成',
          'pull.isLoading': false,
          'push.isLoading': false,
          'push.loading': '../../lib/image/rentcarimg/pull_refresh.gif',
          'push.pullText': '上拉加载更多',
      })
    } else {
      if(page = 1){
        that.setData({
          showList: false,
        })
      }else{
        that.setData({
          'pull.loading': '../../lib/image/rentcarimg/finish.png',
            'pull.pullText': '刷新完成',
            'pull.isLoading': false,
            'push.isLoading': false,
            'push.loading': '../../lib/image/rentcarimg/pull_refresh.gif',
            'push.pullText': '暂无更多数据',
        })
      }
    }
  }
})
