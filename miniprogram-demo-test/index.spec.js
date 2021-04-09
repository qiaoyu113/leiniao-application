const automator = require('miniprogram-automator');

// describe('小程序官方组件展示', () => {
//   let miniProgram;
//   // 运行测试前调用
//   beforeAll(async () => {
//     miniProgram = await automator.connect({
//       wsEndpoint: 'ws://localhost:59111',
//     });
//   });
//   // 运行测试后调用
//   afterAll(() => {
//     miniProgram.disconnect();
//   });
//   // 测试内容
//   it('nohost检测', async () => {
//     console.log(1111111)
//     // const page = await miniProgram.reLaunch('/pages/index/index');
//     // const nohostButton = await page.$('nohost');
//     // expect(nohostButton).toBeNull();
//   });
// });

// describe('课堂小程序自动化测试', () => {
//   let miniProgram;
//   let page;
//   // 运行测试前调用
//   beforeAll(async () => {
//     miniProgram = await automator.connect({
//       wsEndpoint: 'ws://localhost:59111',
//     });
//     page = await miniProgram.reLaunch('../pages/index/index')
//     await page.waitFor(500)
//   },3000);
//   // 运行测试后调用
//   afterAll(async () => {
//     await miniProgram.close();
//   });
//   // 测试内容
//   it('desc', async () => {
//     console.log(page)
//     // const desc = await page.$('.moreBtn')
//     // expect(desc.tagName).toBe('view')
//     // expect(await desc.text()).toContain('以下将展示小程序官方组件能力')
//   })
// });

// const miniProgram = automator.launch({
//   cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
//   projectPath: '/Users/qiaoyu/Desktop/梧桐司机端小程序',
// }).then(async miniProgram => {
//   const page = await miniProgram.reLaunch('/pages/index/index')
//   console.log(page)
//   // await page.waitFor(500)
//   // const element = await page.$('.moreBtn')
//   // console.log(await element.text())
//   // await miniProgram.close()
// })

describe('小程序自动化测试初体验', () => {
  let miniProgram
  let page
  let timeSet = 30000
  beforeAll(async() => {
    miniProgram = await automator.launch({
      cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
      projectPath: '/Users/qiaoyu/Desktop/雷鸟小程序',
    })
    page = await miniProgram.reLaunch('/pages/index/index')
    await page.waitFor(500)
  }, timeSet)
  afterAll(async() => {
    await miniProgram.close()
  })
  it('测试入驻', async () => {
    const element = await page.$('.moreBtn')
    if (await element.attribute('name') == 'moreBtn_test1') {
      console.log('没有授权')
    } else {
      console.log('已经授权')
      await element.tap()
      page = await miniProgram.reLaunch('/pages/lineList/lineList')
      await page.waitFor(1000)
      const list = await page.$$('.lineList')
      await list[0].tap()
    }
  });
})
