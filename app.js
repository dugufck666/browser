/*
 * @Descripttion:
 * @version:
 * @Author: Damo
 * @Date: 2020-10-14 10:42:39
 * @LastEditors: Damo
 * @LastEditTime: 2020-10-14 11:36:39
 */
const puppeteer = require('puppeteer');
(async () => {
  //打开浏览器,安装模块中的chrome浏览器
  const browser = await puppeteer.launch({
    //false为有界面，true为无界面
    headless: false
  });
  //打开新的标签页
  const page = await browser.newPage();
  //将打开的标签页跳转到百度首页。
  await page.goto('https://baidu.com');
  //在百度搜索输入框中输入 "Node.js" 关键字
  //page.type在dom元素中输入字符串，delay: 100,输入每个字符间隔100毫秒
  await page.type('#kw', 'Node.js', {
    delay: 100
  });
  //执行点击搜索按钮
  //page.click点击dom元素
  page.click('#su');
  //waitForSelector()等待dom元素加载完成
  //waitForTimeout()等待多少毫秒
  await page.waitForSelector('.result');
  //在搜索结果中遍历标题包含“菜鸟教程”关键字的链接
  //page.evaluate注入函数到页面中，并返回函数处理的结果对象
  const targetLink = await page.evaluate(() => {
    return {
      link: function () {
        var hrefs = [...document.querySelectorAll('.result a')];
        var href = hrefs.filter(item => {
          //取搜索结果中 标题包含“菜鸟教程”关键字的链接
          return item.innerText && item.innerText.includes('菜鸟教程')
        })[0];//如果结果有多条，只取第1条，并转为string返回
        //console.log会输出结果到浏览器调试
        //console.log(href);
        //a标签dom对象toString(),输出的是href的值
        return href.toString();
      }(),
      hrefs: function () {
        var hrefs = [...document.querySelectorAll('.result a')];
        return hrefs;
      }()
    }

  });
  //console.log(targetLink);
  //当前页面跳转到搜索结果返回的链接
  await page.goto(targetLink.link);
  await page.waitForTimeout(1000);
  //关键浏览器
  browser.close();
})()