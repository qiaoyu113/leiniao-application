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
    pageSize: 30,
    pageIndex: 1,
    fastFeatures: [],
    vehicleList: [],
    isPageWithCustomNav: false,
    navbarHeight: 64,
    loadStatus: 0 // 0 初始化 1请求中 2请求完毕
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
      this.data.showFastFeature && this.getFastFeatures()
      const isPageWithCustomNav = app.globalData.pagesWithCustomNav.indexOf(currentRoute) > -1
      const navbarHeight = app.globalData.CustomBar
      this.setData({
        isPageWithCustomNav,
        navbarHeight
      })
    },
    // 获取快捷筛选项（车辆特点）
    getFastFeatures: function () {
      setTimeout(() => {
        const data = [
          {label: '准新车', id: '123', selected: false},
          {label: '降价急租', id: '234', selected: false},
          {label: '宽体', id: '345', selected: false},
          {label: '有尾板', id: '456', selected: false}
        ]
        this.setData({
          fastFeatures: data
        })
      }, 280);
    },
    // 获取车辆列表
    getVehicleList (append, isKeywordChanged) {
      const formData = this.data.formData
      const pageIndex = append ? this.data.pageIndex + 1 : 1
      Object.assign(formData, {
        pageSize: this.data.pageSize,
        pageIndex
      })
      console.log(formData)
      setTimeout(() => {
        const vehicleList = [
          {
            name: '福田欧曼GTL载货车福田欧曼GTL载货车福田欧曼GTL载货车',
            age: '2',
            miles: '7',
            labels: ['准新车', '急租', '有尾板', '有通行证'],
            price: '3000',
            pic: '/lib/image/home/hot_3.png'
          },
          {
            name: '福田欧曼GTL载货车福田欧曼GTL载货车福田欧曼GTL载货车',
            age: '2',
            miles: '7',
            labels: ['准新车', '急租', '有尾板', '有通行证'],
            price: '3000',
            pic: '/lib/image/home/hot_3.png'
          },
          {
            name: '福田欧曼GTL载货车福田欧曼GTL载货车福田欧曼GTL载货车',
            age: '2',
            miles: '7',
            labels: ['准新车', '急租', '有尾板', '有通行证'],
            price: '3000',
            pic: '/lib/image/home/hot_3.png'
          },
          {
            name: '福田欧曼GTL载货车福田欧曼GTL载货车福田欧曼GTL载货车',
            age: '2',
            miles: '7',
            labels: ['准新车', '急租', '有尾板', '有通行证'],
            price: '3000',
            pic: '/lib/image/home/hot_3.png'
          },
          {
            name: '福田欧曼GTL载货车福田欧曼GTL载货车福田欧曼GTL载货车',
            age: '2',
            miles: '7',
            labels: ['准新车', '急租', '有尾板', '有通行证'],
            price: '3000',
            pic: '/lib/image/home/hot_3.png'
          },
          {
            name: '福田欧曼GTL载货车福田欧曼GTL载货车福田欧曼GTL载货车',
            age: '2',
            miles: '7',
            labels: ['准新车', '急租', '有尾板', '有通行证'],
            price: '3000',
            pic: '/lib/image/home/hot_3.png'
          }
        ]
        this.setData({
          vehicleList,
          loadStatus: 2,
          pageIndex
        })
        isKeywordChanged && this.triggerEvent('searchfinish')
      }, 200)
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
      console.log('load more')
      this.getVehicleList(true)
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
