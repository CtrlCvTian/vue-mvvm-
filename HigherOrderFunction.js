/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-05-10 19:56:55
 * @LastEditTime: 2020-05-14 15:39:35
 * @LastEditors: tiange
 */
// 高阶函数
// 判断类型
/* function isType (type) {
  return function (curElement) {
    return Object.prototype.toString.call(curElement).includes(type)
  }
}
// 包装成高阶函数 批量生成
let types = ['String', 'Number', 'Object', 'Array', 'Boolean']
let fns = {}
types.forEach(type => {
  fns[`is${type}`] = isType(type)
})
let a = true
console.log(fns.isString(a)) */

/* // after 实现达到几次之后再执行
function after (times, callback) {
  let sum = 0
  return function (num) {
    sum += num
    if (--times === 0) {
      callback(sum)
    }
  }
}
let fn = after(3, function (total) {
  console.log('after', total)
})
fn(1)
fn(2)
fn(3) */

/* //AOP 面向切片编程 把原来的代码切成片  在中间加上自己的代码
// 不影响原先的代码前提下 进行添加新功能
// 装饰器 扩展原先的方法 重写原有的方法
function say (who) {
  console.log(who + '说话')
}
Function.prototype.before = function (fn) {
  let that = this
  return function () {
    fn() //执行传入的函数  此时就是执行添加新的功能的代码
    that(...arguments)// 调用之前的代码 注意在内部返回的this指向window
  }
}
let newFn = say.before(function () {
  console.log('要说的话')
})
newFn('我')
// say.before(function () {
//   console.log('要说的话')
// })('我') */

/* // 高阶函数实现异步执行并行拿到结果
const fs = require('fs')
function after (times, callback) {
  let arr = []
  return function (data) {
    arr.push(data)
    if (--times === 0) {
      // 执行
      callback(arr)
    }
  }
}
let newFn = after(3, function (arr) {
  console.log(arr)
})
// 异步操作
fs.readFile('./name.txt', 'utf8', function (err, data) {
  newFn(data)
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
  newFn(data)
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
  newFn(data)
}) */

// 发布订阅模式  发布者和订阅者之前没有联系
// 发布  中间代理  订阅
// 观察者模式 观察者和被观察者，如果被观察者数据变化 通知观察者，两者之间时有联系的 观察者模式是包含发布订阅模式的
/* const fs = require('fs')
// 异步操作
function Events () {
  this.callbacks = []
  this.results = []
}
Events.prototype.on = function (callback) { //订阅
  this.callbacks.push(callback) //存放需要订阅的回调函数
}
Events.prototype.emit = function (data) { //发布
  this.results.push(data)
  this.callbacks.forEach(callback => callback(this.results))//执行
}
let e = new Events()
e.on(function (arr) {
  if (arr.length === 3) {
    console.log(arr)
  }
})
e.on(function (arr) {
  if (arr.length === 3) {
    console.log(arr)
  }
})
fs.readFile('./name.txt', 'utf8', function (err, data) {
  e.emit(data)
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
  e.emit(data)
})
fs.readFile('./age.txt', 'utf8', function (err, data) {
  e.emit(data)
}) */

// 实现简单的观察者模式
// 被观察者 小宝宝  心情好不好 心情好 >> 不好
class Subject {
  constructor(name) {
    this.name = name //被观察者名字
    this.observers = [] //观察者名字
    this.state = '心情好'
  }
  // 被观察者需要提供一个接受观察者的方法
  attach (observer) {
    this.observers.push(observer) //存放观察者
  }
  setState (newState) {
    this.state = newState
    this.observers.forEach(observer => observer.update(newState))
  }
}

// 观察者  爸爸 妈妈
class Obeserver {
  constructor(name) {
    this.name = name //观察者名字
  }
  update (newState) {
    console.log(this.name + '说：宝宝' + newState)
  }
}

let baby = new Subject('小宝宝')
let father = new Obeserver('爸爸')
let mother = new Obeserver('妈妈')
baby.attach(father)
baby.attach(mother)
baby.setState('心情不好')