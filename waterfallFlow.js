/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-06-02 14:53:55
 * @LastEditTime: 2020-06-02 15:12:44
 * @LastEditors: tiange
 */
let SISTERS = [
  'https://pic3.zhimg.com/v2-89735fee10045d51693f1f74369aaa46_r.jpg',
  'https://pic1.zhimg.com/v2-ca51a8ce18f507b2502c4d495a217fa0_r.jpg',
  'https://pic1.zhimg.com/v2-c90799771ed8469608f326698113e34c_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-ca51a8ce18f507b2502c4d495a217fa0_r.jpg',
  'https://pic1.zhimg.com/v2-c90799771ed8469608f326698113e34c_r.jpg',
  'https://pic3.zhimg.com/v2-89735fee10045d51693f1f74369aaa46_r.jpg',
  'https://pic1.zhimg.com/v2-ca51a8ce18f507b2502c4d495a217fa0_r.jpg',
  'https://pic1.zhimg.com/v2-c90799771ed8469608f326698113e34c_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-8d3dd83f3a419964687a028de653f8d8_r.jpg',
  'https://pic1.zhimg.com/v2-ca51a8ce18f507b2502c4d495a217fa0_r.jpg',
  'https://pic1.zhimg.com/v2-c90799771ed8469608f326698113e34c_r.jpg',
  'https://pic3.zhimg.com/v2-89735fee10045d51693f1f74369aaa46_r.jpg',
  'https://pic1.zhimg.com/v2-ca51a8ce18f507b2502c4d495a217fa0_r.jpg',
  'https://pic1.zhimg.com/v2-c90799771ed8469608f326698113e34c_r.jpg',
]
let loadImgHeight = (imgs) => {
  return new Promise((resolve, reject) => {
    const length = imgs.length
    const heights = []
    let count = 0
    const load = (index) => {
      let img = new Image()
      // 校验是否加载完成
      const isCheckFinished = () => {
        count++
        if (count === length) {
          resolve(heights)
        }
      }
      // 加载
      img.onload = () => {
        // 计算比例
        const ratio = img.height / img.width
        const halfHeight = ratio * halfInnerWidth
        // 高度按照屏幕一半的比例进行计算
        heights[index] = halfHeight
        isCheckFinished()
      }
      // 加载出错
      img.onerror = () => {
        height[index] = 0
        isCheckFinished()
      }
      img.src = imgs[index]
    }
    imgs.forEach((item, index) => load(index))
  })
}
// 贪心算法
// 在每装一个图片前都对比一下左右数组的高度和，往高度较小的那个数组里去放入下一项。
let greedy = (heights) => {
  let mid = Math.round(sum(heights) / 2)
  let total = 0
  let leftHeights = []
  let rightHeights = []
  let left = []
  let right = []
}