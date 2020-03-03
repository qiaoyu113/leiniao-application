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

// 金钱2位小数转化
const toDecimal2 = x => {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s = '.';
  }
  while (s.length <= rs + 2) {
    s = '0';
  }
  return s;
}

//普通选择器picker
const picker = val => {
  let arr = [];
  val.forEach(function (item) {
    arr.push(item.code);
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
        //   showCancel: false,
        //   success(res) {
        //     if (res.confirm) {
        //       // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        //       updateManager.applyUpdate();
        //     }
        //   }
        // })
        // wx.showModal({
        //   title: '更新提示',
        //   content: '已更新最新版本，点击确定重启应用',
        //   showCancel: false,
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
  toDecimal2: toDecimal2,
  checkUpdateVersion: checkUpdateVersion
}