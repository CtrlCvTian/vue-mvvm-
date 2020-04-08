/*
 * @Description: 
 * @Author: tiange
 * @Date: 2020-04-07 14:07:30
 * @LastEditTime: 2020-04-08 09:30:04
 * @LastEditors: tiange
 */
let num = 1
let content = document.getElementById('content')
function count () {
  content.innerHTML = num++
}
// content.onmousemove = count
// 所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。

/**
 *
 *非立即执行版的意思是触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间
 * @param {*} fn 传递的回调函数
 * @param {*} wait 设置的等待时间
 * @returns
 */
function debounceImme (fn, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    //如果timeout 有的话  再一次触发事件 就会把之前的延时器清除
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}

/**
 *
 *立即执行版的意思是触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果。
 * @param {*} fn 传递的回调函数
 * @param {*} wait 设置的等待时间
 * @returns
 */
function debounceNot (fn, wait) {
  let timeout;
  return function () {
    let context = this
    let args = arguments;
    // 初始执行的时候没有值  null
    if (timeout) clearTimeout(timeout);
    // 初始的时候就为真  当延时器有值  则为false
    let callNow = !timeout
    timeout = setTimeout(() => {
      timeout = null;
    }, wait)
    if (callNow) fn.apply(context, args)
  }
}

/**
 *
 *
 * @param {*} func 传入的回调函数
 * @param {*} wait 传入的延时时间
 * @param {*} immediate 传递是否立即执行 
 * @returns
 */
function debounce (fn, wait, immediate = false) {
  let timeout, result
  let debounced = function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)
    // 判断是否要立即执行
    if (immediate) {
      var callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) fn.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
    return result
  }
  debounced.cancel = function () {
    clearTimeout(timeout)
    timeout = null
  }
  return debounced
}

/* 
  所谓节流，就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。
  对于节流，一般有两种方式可以实现，分别是时间戳版和定时器版。
*/

/**
 *
 *
 * @param {*} func 传递的回调函数
 * @param {*} wait 传递的延时值
 * @returns
 */
function throttleStamp (func, wait) {
  let previous = 0
  return function () {
    let now = Date.now()
    let context = this
    let args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}

/**
 *
 *
 * @param {*} func 传递的回调函数
 * @param {*} wait 传递的延时值
 * @returns
 */
function throttleTimeout (func, wait) {
  let timeout
  return function () {
    let context = this;
    let args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}


/**
 *其实时间戳版和定时器版的节流函数的区别就是，
  时间戳版的函数触发是在时间段内开始的时候，
  而定时器版的函数触发是在时间段内结束的时候。
 *
 * @param {*} func 回调函数
 * @param {*} wait 等待时间
 * @param {*} type 1 时间戳版  2 定时器版
 */
function throttle (func, wait, type = 1) {
  if (type === 1) var previous = 0
  else if (type === 2) var timeout
  return function () {
    let context = this
    let args = arguments
    if (type === 1) {
      let now = Date.now()
      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    } else {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}

content.onmousemove = throttle(count, 1000, 2)