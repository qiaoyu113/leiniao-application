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
    // placeholderTitle: {
    //   type: String,
    // },
  },
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuBotton: app.globalData.menuBotton,
    menuHeight: app.globalData.menuHeight,
  },
  attached: function () {},
  methods: {
    selectLocationEvent() {
      wx.navigateTo({
        url: '/pages/mapList/mapList',
      })
    },
    gotoSearchEvent() {
      wx.navigateTo({
        url: '/pages/searchPage/searchPage',
      })
    },
  },
})
