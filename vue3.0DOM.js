/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-05-13 14:54:39
 * @LastEditTime: 2020-05-13 15:14:27
 * @LastEditors: tiange
 */
let vue = 1
let react = 1 << 1
let node = 1 << 2
let webpack = 1 << 3
/* console.log(vue, react, node, webpack)
console.log(vue.toString(2).padStart(4, '0'))
console.log(react.toString(2).padStart(4, '0'))
console.log(node.toString(2).padStart(4, '0'))
console.log(webpack.toString(2).padStart(4, '0'))
console.log(vue | react | webpack) //1011 */

let woniu = vue | webpack
// console.log(woniu)
// console.log((vue | webpack).toString(2).padStart(4, '0'))
// console.log(vue.toString(2).padStart(4, '0'))
console.log('有vue吗', !!(woniu & vue))
console.log('有react吗', !!(woniu & react))
console.log('有webpack吗', !!(woniu & webpack))

/**
 *判断奇偶
 *
 * @param {*} str
 * @param {*} len
 * @param {*} ch
 */