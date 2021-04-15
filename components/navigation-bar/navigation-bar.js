const app = getApp()
Component({
  properties: {
    // defaultData（父页面传递的数据）
    defaultData: {
      type: Object,
      value: {
        title: '我是默认标题',
        placeholderTitle: '搜索想租的车辆',
        cityName: '北京市',
        showSearchBar: true,
        rentOrBuy: 'rent',
      },
      observer: function (newVal, oldVal) {},
    },
  },
  data: {
    navHeight: '',
    swiperList: [],
  },
  attached: function () {
    console.log('页面初始化---------->')
    this.setData({
      swiperList: [
        {
          type: 'image',
          url: '../../lib//image/rentcarimg/banner.png',
        },
        {
          type: 'image',
          url: '../../lib//image/rentcarimg/banner.png',
        },
        {
          type: 'image',
          url: '../../lib//image/rentcarimg/banner.png',
        },
      ],
    })
  },
  methods: {
    selectLocationEvent() {
      wx.navigateTo({
        url: '/pages/mapList/mapList',
      })
    },
    gotoSearchEvent() {
      wx.navigateTo({
        url: `/pages/searchPage/searchPage?type=${this.data.defaultData.rentOrBuy}`,
      })
    },
    handlerGetNavHeight(e) {
      this.setData({
        navHeight: e.detail.navHeight,
      })
    },
  },
})
