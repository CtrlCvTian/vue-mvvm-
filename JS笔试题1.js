/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-05-15 14:45:56
 * @LastEditTime: 2020-06-09 15:47:39
 * @LastEditors: tiange
 */
// var test = (function (i) {
//   return function () {
//     alert(i *= 2)
//   }
// })(2)
// test(5)

// var a = 0
// b = 0
// function A (a) {
//   A = function (b) {
//     console.log(a + b++, '内部计算的值')
//   }
//   console.log(a++, 'a++')
// }
// A(1)
// A(2)

/* var a = 0
function A (a) {
  console.log(a, '形参')
  a++
  console.log(a, '内部')
}
console.log(a, '外部')
A(1)
console.log(a, '执行完') */

// 深拷贝
/* function deepClone (target) {
  // 过滤特殊情况
  if (target === null) return target
  if (typeof target !== 'object') return target
  if (target instanceof RegExp) {
    return new RegExp(target)
  }
  if (target instanceof Date) {
    return new Date(target)
  }
  // 是为了传入的如果是实例  在其源对象创建新的实例
  let newObj = new target.constructor
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      newObj[key] = deepClone(target[key])
    }
  }
  return newObj
}
let obj = {
  a: 1,
  b: [1, 2, 3],
  c: { a: 1, d: 2 },
  d: null
}
let obj2 = deepClone(obj)
console.log(obj, obj2)
console.log(obj === obj2)
console.log(obj.c === obj2.c) */

/* async function async1 () {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2 () {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('setTimeout')
}, 0)
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end') */
/*
  script start
  async1 start
  async2
  promise1
  script end
  async1 end
  promise2
  setTimeout
*/
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
Func().A() //2
new Func.A() // 1
new Func().A()
new new Func().A()
 */

/* var x = 2
var y = {
  x: 3,
  z: (function (x) {
    this.x *= x
    x += 2
    return function (n) {
      // console.log(n)
      this.x *= n
      x += 3
      // console.log(x)
    }
  })
}
var m = y.z
m(4) //修改全局的  x：8  6
y.z(5) // 修改对象内的：x:15 7
console.log(x, y.x) */

// var a = {
//   i: 0,
//   toString () {
//     return ++this.i
//   }
// }
// 数据劫持
// var i = 0
// Object.defineProperty(window, 'a', {
//   get () {
//     return ++i
//   }
// })
// // 数组
// var a = [1, 2, 3]
// a.toString = a.shift
// if (a == 1 && a == 2 && a == 3) {
//   console.log('条件成立')
// }

/* var x = 0 // 2
y = 1
function fn () {
  x += 2
  fn = function (y) {
    console.log(y + (--x))
  }
  console.log(x, y)
}
fn(3)//第一次 2 1
fn(4)//第二次 5
console.log(x, y) //1 1 */

/* setTimeout(function () {
  console.log(1)
}, 20)
console.log(2)
setTimeout(function () {
  console.log(3)
}, 10)
console.log(4)
console.time('AA')
for (let i = 0; i < 90000000; i++) {

}
console.timeEnd('AA') // 79ms
console.log('5')
setTimeout(function () {
  console.log(6)
}, 8)
console.log(7)
setTimeout(function () {
  console.log(8)
}, 15)
console.log(9)
// 2 4 AA 5 7 9 3 1 6 8 */

// 去重方法
/* let ary = [12, 23, 12, 25, 23, 25, 14, 16]
// 相邻项的处理方案
ary.sort((a, b) => a - b)
ary = ary.join('@') + '@'
let reg = /(\d+@)\1g,
  arr = []
ary.replace(reg, (val, group1) => {
  // arr.push(Number(group1.slice(0, group1.length - 1)))
  arr.push(group1.substr(0, group1.length - 1))
  // arr.push(Number(group1.substring(group1.length)))
  // arr.push(parseFloat(group1))
})
console.log(arr)
// 使用对象进行存储 如果已经存储过了 把当前项进行删除
/* let obj = {}
for (let i = 0; i < ary.length; i++) {
  let item = ary[i]
  // 说明对象中已经有这一项
  if (typeof obj[item] !== 'undefined') {
    ary[i] = ary[ary.length - 1]
    ary.length--;
    i--;
    continue;
  }
  obj[item] = item
} */
// 1、
// let arr = [... new Set(ary)]
// let arr = Array.from(new Set(ary))
// 2、
// 拿出当前项和后面的内容进行比较
// let arr = []
/* for (let i = 0; i < ary.length - 1; i++) {
  let item = ary[i];
  args = ary.slice(i + 1)
  if (args.indexOf(item) > -1) {
    // 如果后面的数组中包含之前的项 删除当前项
    // splice删除
    // 1 原来数组改变 i如果继续++ 就会产生数组塌陷 漏掉1项
    // 2 数组性能不好 删除1项 后面的索引都会发生改变
    // ary.splice(i, 1)
    // i--

    // 赋值为null 通过filter进行过滤掉null
    // ary[i] = null

    // 使用最后一项进行替换 但是会修改原先数组的位置
    ary[i] = ary[ary.length - 1]
    ary.length--
    i--
  } else {
    // 通过新数组 如果不重复 放在新的数组中 循环的时候就不需要 length - 1
    // arr.push(ary[i])
  }
}
//
// ary = ary.filter(item => item !== null)*/
// console.log(ary)  */


// 排序
// 冒泡排序  每轮从第一项开始,进行拿当前项和后一项进行比较 前一项大于后一项进行交换位置
// 最大轮数  arr.length - 1
// 每一轮的次数  arr.length - 1 不需要和自己进行比较 也不需要和之前已经比较过的进行比较

// 比较的轮数
/* function bubbleSort (arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    // 每轮比较的次数
    for (let j = 0; j < arr.length - 1 - i; j++) {
      arr[j] > arr[j + 1] ? [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]] : null
    }
  }
}

// 插入排序 相当于抓牌
var arr = [9, 8, 7, 6, 5, 4] //
function innerSort (array) {
  for (let i = 1; i < array.length; i++) {
    var j = i - 1;// 从第一个元素开始 相当于在手里的牌
    var key = array[i]; //从第二个元素开始 相当于要抓的牌
    while (j >= 0 && key < array[j]) { //判断要抓的牌是不是小于手里的牌 是就换位置
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
  }
}
innerSort(arr) */

/* // 数组扁平化
let arr = [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8, [9, 10, 11, [12, [14, [15]]]]]
]
// ES6方法
// arr = arr.flat(Infinity)

// 转化为字符串
// arr = arr.toString().split(',').map(item => parseFloat(item))
// arr = JSON.stringify(arr).replace(/(\[|\])/g, '').split(',').map(item => parseFloat(item))

// 循环
// 如果要进行 concat() 操作的参数是数组，那么添加的是数组中的元素，而不是数组。
// 会把参数中如果是数组将第一层进行去除
// while (arr.some(item => Array.isArray(item))) {
//   arr = [].concat(...arr)
// }

~ function () {
  function myFlat () {
    let result = []
    _this = this
    let fn = arr => {
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (Array.isArray(item)) {
          fn(item)
          continue
        }
        result.push(item)
      }
    }
    fn(_this)
    return result
  }
  Array.prototype.myFlat = myFlat
}()
arr = arr.myFlat()
console.log(arr) */

// // 斐波那契数列 [1,1,2,3,5,8] 后一项是之前两项的和
// function fibonacci (n) {
//   if (n <= 1) return 1
//   let arr = [1, 1]
//   // 要创建多少个
//   let i = n + 1 - 2
//   while (i > 0) {
//     let a = arr[arr.length - 2]
//     b = arr[arr.length - 1]
//     arr.push(a + b)
//     i--
//   }
//   return arr[arr.length - 1]
// }
// function fibonacci (count) {
//   /**
//    * 递归执行函数
//    * @param {*} count  传入的要创建的元素数量
//    * @param {number} [curr=1] 当前项的值
//    * @param {number} [next=1] 下一项的值
//    */
//   function fn (count, curr = 1, next = 1) {
//     if (count === 0) {
//       return curr
//     } else {
//       return fn(count - 1, next, curr + next)
//     }
//   }
//   return fn(count)
// }
// console.log(fibonacci(0))
// console.log(fibonacci(1))
// console.log(fibonacci(3))
// console.log(fibonacci(5))

// 输入正数N 输出所有和为N的连续正数序列
// 输入15
// 结果:[[1,2,3,4,5],[4,5,6],[7,8]]
/*
  15 => 15 / 2 向上取整
  只取中间值以下的  1 + 2 + 3 + 4 + 5
*/
/*
  从N开始计算连续M个的正数序列和
  1 5
  1 + (1+1) + (1+2) + .... + (1+4)

  3 3
  3+ (3+1) + (3+2)

  2 7
  2 + (2+1) + (2+2) + .... + (2+7-1)

  N M
  N + (N+1) + ... + (N+M-1)

  (N+(N+M-1))*M/2
*/

/**
 *
 * @param {*} count 需要计算累加的值
 */
function fn (count) {
  let result = []
  // 求出中间值
  let middle = Math.ceil(count / 2)
  for (let i = 0; i <= middle; i++) {
    // 从1开始累加
    for (let j = 2; ; j++) {
      // 控制累加多少次

    }
  }
}


const a = 'abc';
console.log(a instanceof String); // ?

const b = new String('abc');
console.log(b instanceof String); // ?

console.log(String instanceof String);  // ?
console.log(Object instanceof Object);  // ?
console.log(Function instanceof Function); // ?
console.log(Function instanceof Object); // ?


function count (str) {
  var strArr = str.split('')
  var obj = {}
  var i = 0
  while (i < strArr.length) {
    if (strArr[i].toString().replace(/^\s+|\s+$/gm, '') === '') {
      ++i
      continue;
    } else {
      obj.hasOwnProperty(strArr[i]) ?
        obj[strArr[i]] = ++obj[strArr[i]] : obj[strArr[i]] = 0
      ++i
    }
  }
  return obj
}
console.log(count('hello world'))

function count (str) {
  return str.split('').reduce(function (prev, next) {
    if (next !== ' ') {
      prev[next] ? prev[next]++ : prev[next] = 1
    }
    return prev
  }, {})
}
console.log(count('hello world'))