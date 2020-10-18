/*
 * @Descripttion:
 * @version:
 * @Author: Damo
 * @Date: 2020-10-14 10:42:39
 * @LastEditors: Damo
 * @LastEditTime: 2020-10-18 17:04:37
 */
const puppeteer = require('puppeteer');
(async () => {
  //打开浏览器,安装模块中的chrome浏览器
  const browser = await puppeteer.launch({
    //false为有界面，true为无界面
    headless: false,
    defaultViewport: {
      width: 1920, //设置视窗的宽高
      height: 800
    }
  });

  //打开新的标签页
  const page = await browser.newPage();
  //设置可视区域大小
  await page.setViewport({
    width: 1920,
    height: 800
  });
  //将打开的标签页跳转到百度首页。
  await page.goto('https://www.baidu.com');
  //在百度搜索输入框中输入 "前端神器" 关键字
  //page.type在dom元素中输入字符串，delay: 100,输入每个字符间隔100毫秒
  await page.type('#kw', '前端神器', {
    delay: 100
  });
  //执行点击搜索按钮
  //page.click点击dom元素
  page.click('#su');
  //waitForSelector()等待dom元素加载完成
  //waitForTimeout()等待多少毫秒
  await page.waitForSelector('.result');
  //在搜索结果中遍历标题包含“博客园”关键字的链接
  //page.evaluate注入函数到页面中，并返回函数处理的结果对象
  const targetLink = await page.evaluate(() => {
    return [...document.querySelectorAll('.result a')].filter(item => {
      //取搜索结果中 标题包含“博客园”关键字的链接
      return item.innerText && item.innerText.includes('博客园')
    })[0].toString();
  });
  //console.log(targetLink);
  //当前页面跳转到搜索结果返回的链接
  await page.goto(targetLink);
  //等待mainContent元素载入
  await page.waitForSelector('#mainContent');
  //网页截图
  await page.screenshot({
    path: './screen/capture.png', //图片保存路径
    type: 'png',
    fullPage: true //边滚动边截图
    // clip: {x: 0, y: 0, width: 1920, height: 800}
  });
  //对网页元素截图
  let [element] = await page.$x('//*[@id="sidebar_news"]/h3');
  await element.screenshot({
    path: './screen/element.png'
  });
  //关闭标签页
  await page.close();
  //关键浏览器
  await browser.close();
})()