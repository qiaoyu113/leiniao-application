const net = require('../../utils/network')

Component({
  options: {
    addGlobalClass: true 
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showFastFeature: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    formData: {
      sort: '1'
    },
    isRent: false,
    pageSize: 30,
    pageIndex: 1,
    fastFeatures: [],
    vehicleList: [],
    isPageWithCustomNav: false,
    navbarHeight: 64,
    loadStatus: 0, // 0 初始化 1请求中 2请求完毕
    labels: []
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.init()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init () {
      const app = getApp()
      const currentRoute = app.utils.getCurrentRoute()
      ;(currentRoute !== 'searchPage' && currentRoute !== 'hotModel') && this.getVehicleList()
      const isPageWithCustomNav = app.globalData.pagesWithCustomNav.indexOf(currentRoute) > -1
      const navbarHeight = app.globalData.CustomBar
      const isRent = app.utils.getEntryRoute() === 'rentedCar'
      const labels = [
        {name: '准新车', key: 'isNewCar'},
        {name: isRent ? '降价急租' : '降价急售', key: isRent ? 'isUrgentRent' : 'isUrgentSale'},
        {name: '有尾板', key: 'hasTailboard'},
        {name: '有通行证', key: 'hasPass'}
      ]
      this.setData({
        isPageWithCustomNav,
        navbarHeight,
        isRent,
        labels
      })
    },
    // 获取车辆列表
    getVehicleList (append, isKeywordChanged) {
      const formData = this.data.formData
      const pageIndex = append ? this.data.pageIndex + 1 : 1
      Object.assign(formData, {
        limit: this.data.pageSize,
        page: pageIndex,
        searchCityId: '' // todo
      })
      formData.searchContent = formData.keyword || ''
      delete formData.keyword
      console.log(formData)
      net.post('255/car_center/v1/cargo/getSearchCarList', formData, res => {
        const vehicleList = (res.data || []).map(v => {
          // v.pic = (v.imageUrlList || [])[0] || ''
          v.pic = '/lib/image/home/hot_3.png' // todo 移除
          return v
        })
        this.setData({
          vehicleList,
          loadStatus: 2,
          pageIndex
        })
        isKeywordChanged && this.triggerEvent('searchfinish')
      })
    },
    onFastFeatureReady (evt) {
      const transItem = v => {
        v.label = v.dictLabel
        v.id = v.dictValue
        v.selected = false
        return v
      }
      // 标签：car_go_label
      // 特点跟筛选分开，车辆特点：car_go_features  车辆标签：car_go_search
      this.data.showFastFeature && this.setData({
        fastFeatures: (evt.detail.car_go_search || evt.detail.car_go_label || []).map(transItem) // todo 确认到底是哪个
      }, () => { // todo 移除
        !this.data.fastFeatures.length && this.setData({
          fastFeatures: [
            {label: '准新车', id: '123', selected: false},
            {label: '降价急租', id: '234', selected: false},
            {label: '宽体', id: '345', selected: false},
            {label: '有尾板', id: '456', selected: false}
          ]
        })
      })
    },
    // 筛选组件汇总后的参数变动
    onParamChange: function (evt) {
      this.setData({
        formData: Object.assign({}, this.data.formData, evt.detail || evt)
      }, () => {
        this.getVehicleList(false, !evt.detail)
      })
    },
    // 筛选组件筛选项变动，同步到页面
    onFeatureChange (evt) {
      const item = evt.detail
      const fastFeatures = this.data.fastFeatures.map(v => {
        v.id === item.id && (v.selected = !v.selected)
        return v
      })
      this.setData({fastFeatures})
    },
    // 页面快捷筛选项变动，同步到筛选组件
    onSelectFeature (evt) {
      // 页面本身
      const item = evt.currentTarget.dataset.info
      const fastFeatures = this.data.fastFeatures.map(v => {
        v.id === item.id && (v.selected = !v.selected)
        return v
      })
      this.setData({fastFeatures})
      // 同步到组件
      const vehicleFilter = this.selectComponent('#vehicleFilter')
      vehicleFilter && vehicleFilter.onSelectFeature(evt, true)
    },
    // 同步重置操作中的筛选项
    onFilterReset (evt) {
      if (!this.data.showFastFeature) return false
      const fastFeatures = this.data.fastFeatures.map(v => {
        v.selected = false
        return v
      })
      this.setData({fastFeatures})
    },
    // 供页面滚动至底部时调用，分页加载数据
    // const vehicleList = this.selectComponent('#vehicleList')
    // vehicleList && vehicleList.onPageReachBottom()
    onPageReachBottom () {
      if (this.data.vehicleList.length === this.pageSize) {
        this.getVehicleList(true)
      }
    },
    // 供页面搜索关键字变化时调用，重新搜索
    // const vehicleList = this.selectComponent('#vehicleList')
    // vehicleList && vehicleList.onPageKeywordChange(newVal)
    onPageKeywordChange (val) {
      console.log('keyword change', val)
      this.onParamChange({keyword: val})
    }
  }
})
