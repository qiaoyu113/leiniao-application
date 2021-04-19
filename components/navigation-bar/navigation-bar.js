const app = getApp()
const net = require('../../utils/network')

Component({
  properties: {
    // defaultData（父页面传递的数据）
    defaultData: {
      type: Object,
      value: {
        title: '',
        placeholderTitle: '搜索想租的车辆',
        cityName: '',
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
    const banner = 'car_go_banner'
    net.post('api/base_center/open/v1/dict/list/types', [banner], res => {
      if (res.success) {
        this.setData({
          swiperList: (res.data[banner] || []).map(v => {
            return {
              type: 'image',
              url: v.dictLabel
            }
          })
        }, () => {
          console.log(this.data.swiperList)
        })
      }
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
