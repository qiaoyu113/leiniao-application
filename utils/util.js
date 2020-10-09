//时间戳
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//普通选择器picker
const picker = val => {
  let arr = [];
  val.forEach(function (item) {
    arr.push(item.cityName);
  })
  return arr;
}

//普通选择器picker2
const picker2 = val => {
  let arr = [];
  val.forEach(function (item) {
    arr.push(item.name);
  })
  return arr;
}

//普通选择器picker3
const picker3 = val => {
  let arr = [];
  val.forEach(function (item) {
    arr.push(item.dictLabel);
  })
  return arr;
}

//普通选择器picker4
const picker4 = val => {
  let arr = [];
  val.forEach(function (item) {
    arr.push(item.dictLabel);
  })
  return arr;
}


//监听版本
function checkUpdateVersion() {
  //创建 UpdateManager 实例
  const updateManager = wx.getUpdateManager();
  //检测版本更新
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      //监听小程序有版本更新事件
      updateManager.onUpdateReady(function () {
        // wx.showModal({
        //   title: '更新提示',
        //   content: '新版本已经准备好，是否重启应用？',
        //   success(res) {
        //     if (res.confirm) {
        //       // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        //       updateManager.applyUpdate();
        //     }
        //   }
        // })
        updateManager.applyUpdate();
      })

      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        wx.showModal({
          title: '已经有新版本咯~',
          content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开呦~',
        })
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  picker: picker,
  picker2: picker2,
  picker3: picker3,
  picker4: picker4,
  checkUpdateVersion: checkUpdateVersion
}