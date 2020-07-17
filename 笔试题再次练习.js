/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-06-26 17:34:19
 * @LastEditTime: 2020-07-10 10:55:50
 * @LastEditors: tiange
 */
// 关于面向对象 ES5
/* function Person (name) {
  this.name = name
}
Person.prototype.showName = function () {
  console.log(this.name + 'showName')
}
// 继承
function Worker (work, name) {
  this.work = work
  Person.call(this, name)
}
for (let i in Person.prototype) {
  Worker.prototype[i] = Person.prototype[i]
}
var worker = new Worker('程序员', '小芳')
worker.showName()
console.log(worker.name) */

// 递归
// 计算和 
// function sum (num) {
//   let res = 0
//   if (num === 0) return res
//   else {
//     return sum(num - 1) + num
//   }
// }
// console.log(sum(100))
//冒泡 
// [9,8,7,6,5,4]
//第一轮： [9,8,7,6,5,4] 比较5次
//        [8,9,7,6,5,4]
//        [8,7,9,6,5,4]
//        [8,7,6,9,5,4]
//        [8,7,6,5,9,4]
//        [8,7,6,5,4,9]
//第二轮： [8,7,6,5,4,9] 比较4次
// let arr = [9, 8, 7, 6, 5, 4]
// 比较的轮数 冒泡排序
// for (let i = 0; i < arr.length - 1; i++) {
//   for (let j = 0; j < arr.length - i - 1; j++) {
//     if (arr[j] > arr[j + 1]) {
//       [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
//     }
//   }
// }
// 选择排序
// 9, 8, 7, 6, 5, 4
// 8, 9, 7, 6, 5, 4
// 7, 9, 8, 6, 5, 4
// 6, 9, 8, 7, 5, 4
// 5, 9, 8, 7, 6, 4
// 4, 9, 8, 7, 6, 5
// 比较的轮数
// for (var i = 0; i < arr.length - 1; i++) {
//   // 每一轮比较的次数
//   for (var j = i + 1; j < arr.length; j++) {
//     if (arr[i] > arr[j]) {
//       [arr[i], arr[j]] = [arr[j], arr[i]]
//     }
//   }
// }
// console.log(arr)
// function getValidStyle (node, styleAttr) {
//   if (node.currentStyle) {
//     return node.currentStyle[styleAttr]
//   } else {
//     return getComputedStyle(node)[styleAttr]
//   }
// }

/* const arr = [
  { name: '小孙', age: 18, score: 60, weight: 60 },
  { name: '小王', age: 19, score: 70, weight: 55 },
  { name: '小李', age: 18, score: 60, weight: 70 },
  { name: '小刘', age: 20, score: 70, weight: 65 },
  { name: '小赵', age: 18, score: 60, weight: 60 },
  { name: '小钱', age: 19, score: 70, weight: 55 },
  { name: '小周', age: 20, score: 60, weight: 50 },
]

const examle = (data, key) => {
  return data.reduce((prev, next) => {
    (prev[next[key]] = prev[next[key]] || []).push(next)
    return prev
  }, {})
}
console.log(examle(arr, 'age')) */

/* let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']
let nameNum = names.reduce((prev, cur) => {
  if (cur in prev) {
    prev[cur]++
  } else {
    prev[cur] = 1
  }
  return prev
}, {})
console.log(nameNum) */

/* let arr = [1, 2, 3, 4, 4, 1]
let newArr = arr.reduce((prev, cur) => {
  if (!prev.includes(cur)) {
    return prev.concat(cur)
  } else {
    return prev
  }
}, []) */

// 将多维数组转化为一维
/* let arr = [[0, 1], [2, 3], [4, [5, 6, 7]]]
const newArr = function (arr) {
  return arr.reduce((prev, cur) => prev.concat(Array.isArray(cur) ? newArr(cur) : cur), [])
}
console.log(newArr(arr)) */

// 对象里的属性求和
/* var result = [
  {
    subject: 'math',
    score: 10
  },
  {
    subject: 'chinese',
    score: 20
  },
  {
    subject: 'english',
    score: 30
  }
]
var sum = result.reduce(function (prev, cur) {
  return cur.score + prev;
}, 0);
console.log(sum) //60 */

// 用洗牌算法随机打乱一个集合。
/* const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const shuffle = ([...arr]) => {
  let m = arr.length
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]]
  }
  return arr
}
console.log(shuffle(arr)) */

/* const arr = [4, 5, 3, 4, 6, 5, 8, 6]
// const a = arr.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], [])
// console.log(a)
// const b = arr.filter((item, index, arr) => arr.indexOf(item, 0) === index)
function duplicate () {
  var obj = {}
  return arr.filter((item, index, arr) => {
    return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
  })
}
console.log(duplicate(arr)) */

/* function A () { //AAAFFF000
  console.log(1)
}
function Func () {
  A = function () {//BBBFFF000
    console.log(2)
  }
  return this
}
Func.A = A
Func.prototype = {
  A: () => {
    console.log(3)
  }
}
A() //1
Func.A() //1
console.info(Func.A)
Func().A() //2
console.info(Func.A)
new Func.A()
new Func().A()
new new Func().A() */

/**
  batches函数接收两个参数：
  1. recipe 制作一个面包需要的各个材料的值
  2. available 现有的各个材料的值
  要求传入 recipe 和 available，然后根据两者计算出能够烹饪出面包的最大值
**/
var batches = (recipe, available) => {
  return Math.floor(
    Math.min(...Object.keys(recipe).map(k => available[k] / recipe[k]) || 0)
  )
}
// console.log(batches({ milk: 100, butter: 50, flour: 10 },
//   { milk: 198, butter: 52, flour: 10 }))
// console.log(Object.entries({ milk: 198, butter: 52, flour: 10 }))

var mask = (str, maskStr = '#') => {
  if (!str || str.length <= 4) return str
  return str.slice(-4).padStart(str.length, maskStr)
}
// console.log(mask('tiange'))


function Parent (name) {
  this.name = name
  this.sex = 'boy'
  this.colors = ['white', 'black']
}
function Child () {
  this.feature = ['cute']
}
var parent = new Parent('parent')
Child.prototype = parent

var child1 = new Child('child1')
child1.sex = 'girl'
child1.colors.push('yellow')
child1.feature.push('sunshine')

var child2 = new Child('child2')

console.log(child1)
// console.log(child2)

// console.log(child1.name)
// console.log(child2.colors)

// console.log(parent)