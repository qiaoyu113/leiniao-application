// components/vehicleFilter/vehicleFilter.js
Component({
  options: {
    addGlobalClass: true 
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    tabs: [],
    currentTab: null,
    modelList: [],
    models: [],
    ages: [],
    minPrice: '',
    maxPrice: '',
    features: [],
    miles: [],
    minMiles: '',
    maxMiles: '',
    sorts: []
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
      this.initTabs()
      this.getModelList()
      this.getAges()
      this.getFilterFeatures()
      this.getFilterMiles()
      this.getSorts()
    },
    initTabs () {
      const tabs = [
        {label: '车型', id: 'model', selected: false},
        {label: '车龄', id: 'age', selected: false},
        {label: '租金', id: 'price', selected: false},
        {label: '筛选', id: 'filter', selected: false},
        {label: '', id: 'sort', selected: false}
      ]
      const app = getApp()
      const entryRoute = app.utils.getEntryRoute()
      if (/saleCar/.test(entryRoute)) {
        tabs.find(v => v.id === 'price').label = '售价'
      }
      this.setData({tabs})
    },
    // 获取全部车型（品牌+车型）
    getModelList () {
      setTimeout(() => {
        const data = [
          {
            brandName: '福田',
            brandId: 'futian',
            selected: false,
            models: [
              {modelName: '4.2米箱货', modelId: '4.2xh', selected: false},
              {modelName: '小面', modelId: 'xm', selected: false},
              {modelName: '依维柯', modelId: 'ywk', selected: false}
            ]
          },
          {
            brandName: '金杯',
            brandId: 'jinbei',
            selected: false,
            models: [
              {modelName: '4.2米箱货', modelId: '4.2xh', selected: false},
              {modelName: '小面', modelId: 'xm', selected: false},
              {modelName: '依维柯', modelId: 'ywk', selected: false}
            ]
          },
        ]
        this.setData({
          modelList: [{brandName: '不限品牌', brandId: '', selected: false}].concat(data)
        })
      }, 100);
    },
    // 获取车龄选项
    getAges () {
      setTimeout(() => {
        const ages = [
          {label: '1年内', id: '1', selected: false},
          {label: '1~2年', id: '2', selected: false},
          {label: '2~3年', id: '3', selected: false},
          {label: '3年以上', id: '4', selected: false}
        ]
        this.setData({ages})
      }, 100)
    },
    // 获筛选项（车辆特点）
    getFilterFeatures: function () {
      setTimeout(() => {
        const data = [
          {label: '准新车', id: '123', selected: false},
          {label: '急租', id: '234', selected: false},
          {label: '宽体', id: '345', selected: false},
          {label: '有尾板', id: '456', selected: false},
          {label: '有通行证', id: '567', selected: false}
        ]
        this.setData({features: data})
      }, 280);
    },
    // 筛选项（里程）
    getFilterMiles () {
      setTimeout(() => {
        const data = [
          {label: '1万公里内', id: '1', selected: false},
          {label: '1-3万公里', id: '3', selected: false},
          {label: '3-5万公里', id: '5', selected: false},
          {label: '5-7万公里', id: '7', selected: false}
        ]
        this.setData({miles: data})
      }, 100)
    },
    // 排序基准
    getSorts () {
      setTimeout(() => {
        const data = [
          {label: '默认排序', id: '1', selected: true},
          {label: '最新上架', id: '2', selected: false},
          {label: '车龄最短', id: '3', selected: false},
          {label: '里程最短', id: '4', selected: false},
          {label: '租金最低', id: '5', selected: false}
        ]
        this.setData({sorts: data})
      }, 100)
    },
    // 点击tab
    onSelectTab (evt) {
      const selectedTabId = evt ? ((evt.currentTarget.dataset.info || {}).id || '') : ''
      const currenttabId = this.data.currentTab ? this.data.currentTab.id : ''
      if (this.data.currentTab && currenttabId === selectedTabId) {
        const tabs = this.data.tabs.map(v => {
          v.selected = false
          return v
        })
        this.setData({tabs, currentTab: null})
      } else {
        let currentTab = null
        const tabs = this.data.tabs.map((tab, i) => {
          if (tab.id === selectedTabId) {
            tab.selected = true
            currentTab = tab
          } else {
            tab.selected = false
          }
          return tab
        })
        this.setData({tabs, currentTab})
        this.moveFilterTop()
      }
    },
    // 重置
    onReset () {
      const tabs = this.data.tabs.map(v => {
        v.selected = false
        return v
      })
      const ages = this.data.ages.map(v => {
        v.selected = false
        return v
      })
      const modelList = this.data.modelList.map(v => {
        v.selected = false
        v.models = v.models ? v.models.map(vv => {
          vv.selected = false
          return vv
        }) : undefined
        return v
      })
      const features = this.data.features.map(v => {
        v.selected = false
        return v
      })
      const miles = this.data.miles.map(v => {
        v.selected = false
        return v
      })
      const sorts = this.data.sorts.map((v, i) => {
        v.selected = !i
        return v
      })
      this.setData({
        tabs,
        ages,
        modelList,
        models: [],
        features,
        miles,
        sorts,
        currentTab: null,
        minPrice: '',
        maxPrice: '',
        minMiles: '',
        maxMiles: ''
      })
      this.onQuery()
      this.triggerEvent('filterreset')
    },
    // 查询
    onQuery () {
      const formData = {
        brandId: (this.data.modelList.find(v => v.selected) || {}).brandId || '',
        modelId: (this.data.models.find(v => v.selected) || {}).modelId || '',
        ages: this.data.ages.filter(v => v.selected).map(v => v.id).join(','),
        minPrice: this.data.minPrice,
        maxPrice: this.data.maxPrice,
        features: this.data.features.filter(v => v.selected).map(v => v.id).join(','),
        miles: this.data.miles.filter(v => v.selected).map(v => v.id).join(','),
        minMiles: this.data.minMiles,
        maxMiles: this.data.maxMiles,
        sort: this.data.sorts.find(v => v.selected).id
      }
      console.log('filter', formData)
      this.triggerEvent('change', formData)
      this.onSelectTab() // 触发收起filter
    },
    // 滚动页面至顶部
    moveFilterTop () {
      const query = this.createSelectorQuery()
      query.select('.vehicle-filter').boundingClientRect()    
      query.selectViewport().scrollOffset()
      const app = getApp()
      const isPageWithCustomNav = app.globalData.pagesWithCustomNav.indexOf(app.utils.getCurrentRoute()) > -1
      const barHeight = isPageWithCustomNav ? app.globalData.CustomBar : 0
      query.exec(res => {
        if (res[0] && res[1] && (res[0] || {}).top !== barHeight) {
          wx.pageScrollTo({scrollTop: res[0].top + res[1].scrollTop - barHeight})
        }
      })
    },
    // 选择品牌
    onSelectBrand (evt) {
      const brandId = evt.currentTarget.dataset.info.brandId
      const modelList = this.data.modelList.map(v => {
        v.selected = v.brandId === brandId
        return v
      })
      const models = (this.data.modelList.find(v => v.brandId === evt.currentTarget.dataset.info.brandId) || {}).models
      this.setData({
        modelList,
        models: models ? [{modelName: '不限车型', modelId: '', selected: false}].concat(models) : []
      })
      if (!models && !brandId) {
        this.onQuery()
      }
    },
    // 选择型号
    onSelectModel (evt) {
      const modelId = evt.currentTarget.dataset.info.modelId
      const models = this.data.models.map(v => {
        v.selected = v.modelId === modelId
        return v
      })
      this.setData({models}, () => {
        this.onQuery()
      })
    },
    // 选择车龄
    onSelectAge (evt) {
      const ages = this.data.ages
      const clickedAge = ages.find(v => v.id === evt.currentTarget.dataset.info.id)
      clickedAge.selected = !clickedAge.selected
      this.setData({ages})
    },
    // 选择车辆特点
    onSelectFeature (evt, isFromPage) {
      const features = this.data.features
      const clickedFeature = features.find(v => v.id === evt.currentTarget.dataset.info.id)
      clickedFeature.selected = !clickedFeature.selected
      this.setData({features}, () => {
        if (isFromPage) {
          this.onQuery()
        } else {
          this.triggerEvent('featurechange', evt.currentTarget.dataset.info)
        }
      })
    },
    // 选择里程
    onSelectMiles (evt) {
      const miles = this.data.miles
      const clickedMiles = miles.find(v => v.id === evt.currentTarget.dataset.info.id)
      clickedMiles.selected = !clickedMiles.selected
      this.setData({miles})
    },
    // 选择排序基准
    onSelectSort (evt) {
      const sorts = this.data.sorts.map(v => {
        v.selected = v.id === evt.currentTarget.dataset.info.id
        return v
      })
      this.setData({sorts}, () => {
        this.onQuery()
      })
    },
    // 解决滚动穿透问题
    doNothing () {
      return false
    },
    onTouchMove () {
      console.log('touch')
    }
  }
})
