/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-05-10 19:56:55
 * @LastEditTime: 2020-05-10 20:41:13
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

//AOP 面向切片编程 把原来的代码切成片  在中间加上自己的代码
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
/* say.before(function () {
  console.log('要说的话')
})('我') */