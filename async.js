/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-04-30 14:49:13
 * @LastEditTime: 2020-04-30 15:37:59
 * @LastEditors: tiange
 */
// babel对async/await的转换结果，其实整体的思路是一样的，但是写法稍有不同：
//相当于我们的run()
function _asyncToGenerator (fn) {
  // return一个function，和async保持一致。我们的run直接执行了Generator，其实是不太规范的
  return function () {
    var self = this
    var args = arguments
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      //相当于我们的_next()
      function _next (value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      //处理异常
      function _throw (err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}
function asyncGeneratorStep (gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
// 使用方式：
/* const foo = _asyncToGenerator(function* () {
  try {
    console.log(yield Promise.resolve(1))   //1
    console.log(yield 2)                    //2
    return '3'
  } catch (error) {
    console.log(error)
  }
})

foo().then(res => {
  console.log(res)                          //3
}) */

function* myGenerator () {
  try {
    console.log(yield Promise.resolve(1))
    console.log(yield 2)   //2
    console.log(yield Promise.reject('error'))
  } catch (error) {
    console.log(error)
  }
}
// const gen = myGenerator()
// gen.next().value.then(value => {
//   console.log(value)
//   gen.next().value.then(value => {
//     console.log(value)
//     gen.next().value.then(value => {
//       console.log(value)
//     })
//   })
// })

/* 
  希望生成器函数能自动往下执行，且yield能返回resolve的值。
*/
/* 
  需要兼容基本类型：这段代码能自动执行的前提是yield后面跟Promise，
  为了兼容后面跟着基本类型值的情况，我们需要把yield跟的内容(gen().next.value)都用Promise.resolve()转化一遍

  缺少错误处理：上边代码里的Promise如果执行失败，就会导致后续执行直接中断，
  我们需要通过调用Generator.prototype.throw()，把错误抛出来，才能被外层的try-catch捕获到

  返回值是Promise：async/await的返回值是一个Promise，
  我们这里也需要保持一致，给返回值包一个Promise
*/
function run (gen) {
  //把返回值包装成promise
  return new Promise((resolve, reject) => {
    //由于每次gen()获取到的都是最新的迭代器,因此获取迭代器操作要放在_next()之前,否则会进入死循环
    var g = gen()
    //封装一个方法, 递归执行g.next()                   
    function _next (val) {
      // 错误处理
      try {
        var res = g.next(val)
      } catch (error) {
        return reject(error)
      }
      //递归终止条件
      if (res.done) return res.value
      //Promise的then方法是实现自动迭代的前提 
      //res.value包装为promise，以兼容yield后面跟基本类型的情况
      Promise.resolve(res.value).then(
        val => {
          //等待Promise完成就自动执行下一个next，并传入resolve的值
          _next(val)
        },
        err => {
          // 抛出错误
          g.throw(err)
        }
      )
    }
    _next()  //第一次执行
  })
}
run(myGenerator)