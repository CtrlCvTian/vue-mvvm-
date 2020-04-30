/*
 * @Description: 
 * @Author: tiange
 * @Date: 2020-04-14 09:26:53
 * @LastEditTime: 2020-04-19 20:45:25
 * @LastEditors: tiange
 */
//Promise/A+规范的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    this._status = PENDING   // Promise状态
    this._resolveQueue = [] //then 收集成功的回调队列
    this._rejectQueue = [] //then 收集失败的回调队列
    this._value = null // 储存then回调return的值
    // 由于resolve/reject是在executor内部被调用, 
    //因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = value => {
      // 对应规范中的"状态只能由pending到fulfilled或rejected"
      const run = () => {
        if (this._status !== PENDING) return
        this._status = FULFILLED
        this._value = value
        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while (this._resolveQueue.length) {
          // 从成功的队列 取出第一个元素
          const callback = this._resolveQueue.shift()
          console.dir(callback)
          callback(value)
        }
      }
      // 保证先进行then 收集回调
      setTimeout(run)
    }
    let _reject = value => {
      const run = () => {
        // 对应规范中的"状态只能由pending到fulfilled或rejected"
        if (this._status !== PENDING) return
        this._status = REJECTED  // 变更状态
        this._value = value
        while (this._rejectQueue.length) {
          // 从成功的队列 取出第一个元素
          const callback = this._rejectQueue.shift()
          callback(value)
        }
      }
      setTimeout(run)
    }
    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve, _reject)
  }
  /* 
    .then()需要返回一个Promise，这样才能找到then方法，所以我们会把then方法的返回值包装成Promise。
    .then()的回调需要顺序执行，以上面这段代码为例，虽然中间return了一个Promise，
    但执行顺序仍要保证是1->2->3。我们要等待当前Promise状态变更后，再执行下一个then收集的回调，
    这就要求我们对then的返回值分类讨论
  */
  /* 
    初步完成了链式调用，但是对于 then() 方法，我们还要两个细节需要处理一下
    值穿透
      根据规范，如果 then() 接收的参数不是function，那么我们应该忽略它。
      如果没有忽略，当then()回调不为function时将会抛出异常，导致链式调用中断
    处理状态为resolve/reject的情况
      其实我们上边 then() 的写法是对应状态为padding的情况，但是有些时候，
      resolve/reject 在 then() 之前就被执行（比如Promise.resolve().then()），
      如果这个时候还把then()回调push进resolve/reject的执行队列里，那么回调将不会被执行，
      因此对于状态已经变为fulfilled或rejected的情况，我们直接执行then回调：
  */
  /* 
   上文我们说过，Promise的执行顺序是new Promise -> then()收集回调 -> resolve/reject执行回调，
   这一顺序是建立在executor是异步任务的前提上的。
   如果executor是一个同步任务，那么顺序就会变成new Promise -> resolve/reject执行回调 -> then()收集回调，
   resolve的执行跑到then之前去了，为了兼容这种情况，我们给resolve/reject执行回调的操作包一个setTimeout，让它异步执行。
 
   虽然规范没有要求回调应该被放进宏任务队列还是微任务队列，但其实Promise的默认实现是放进了微任务队列，
   我们的实现（包括大多数Promise手动实现和polyfill的转化）
   都是使用setTimeout放入了宏任务队列（当然我们也可以用MutationObserver模拟微任务）
  */
  then (resolveFn, rejectFn) {
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = reason => {
      throw new Error(reason instanceof Error ? reason.message : reason);
    } : null
    // 需要返回新的MyPromise 进行链式调用
    return new MyPromise((resolve, reject) => {
      //把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
      const fullFilledFn = value => {
        try {
          //执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = resolveFn(value)
          //分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
      //把后续then收集的依赖都push进当前Promise的成功回调队列中(_rejectQueue), 这是为了保证顺序调用
      const rejectedFn = error => {
        try {
          let x = rejectFn(error)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
      switch (this._status) {
        // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
        case PENDING:
          this._resolveQueue.push(fullFilledFn)
          this._rejectQueue.push(rejectedFn)
          break;
        // 当状态已经变为resolve/reject时,直接执行then回调
        case FULFILLED:
          fullFilledFn(this._value)    // this._value是上一个then回调return的值(见完整版代码)
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
  }
  // catch()方法返回一个Promise，并且处理拒绝的情况。它的行为与调用Promise.prototype.then(undefined, onRejected) 相同。
  //catch方法其实就是执行一下then的第二个回调
  catch (rejectFn) {
    return this.then(undefined, rejectFn)
  }
  // finally()方法返回一个Promise。在promise结束时，无论结果是fulfilled或者是rejected，
  // 都会执行指定的回调函数。在finally之后，还可以继续then。并且会将值原封不动的传递给后面的then
  finally (callback) {
    return this.then(
      // MyPromise.resolve执行回调,并在then中return结果传递给后面的Promise
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason })  // reject同理
    )
  }
  // Promise.resolve(value)方法返回一个以给定值解析后的Promise 对象。
  // 如果该值为promise，返回这个promise；如果这个值是thenable（即带有"then" 方法)），
  // 返回的promise会“跟随”这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。
  // 此函数将类promise对象的多层嵌套展平。
  //静态的resolve方法
  static resolve (value) {
    // 根据规范, 如果参数是Promise实例, 直接return这个实例
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
  // Promise.reject()方法返回一个带有拒绝原因的Promise对象。
  static reject (reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }
  /* 
    Promise.all(iterable)方法返回一个 Promise 实例，
    此实例在 iterable 参数内所有的 promise 都完成（resolved）或参数中不包含 
    promise 时回调完成（resolve）；
      如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），
      失败原因的是第一个失败 promise 的结果。
    p的状态由p1、p2、p3决定，分成两种情况。
  （1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，
    此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
  （2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，
    此时第一个被reject的实例的返回值，会传递给p的回调函数。
  */
  static all (promiseArr) {
    let index = 0
    let result = []
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        //Promise.resolve(p)用于处理传入值不为Promise的情况
        MyPromise.resolve(p).then(
          val => {
            index++
            result[i] = val
            //所有then执行后, resolve结果
            if (index === promiseArr.length) {
              resolve(result)
            }
          },
          err => {
            //有一个Promise被reject时，MyPromise的状态变为reject
            reject(err)
          }
        )
      })
    })
  }
  /* 
    Promise.race(iterable)方法返回一个 promise，
    一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
  */
  static race (promiseArr) {
    return new MyPromise((resolve, reject) => {
      //同时执行Promise,如果有一个Promise的状态发生改变,就变更新MyPromise的状态
      for (let p of promiseArr) {
        MyPromise.resolve(p).then(
          val => {
            resolve(val)
          },
          err => {
            reject(err)
          }
        )
      }
    })
  }
}


const p1 = new MyPromise((resolve, reject) => {
  resolve(1)
})
// 此时先调用 then方法 自己定义的myPromise相当于同步方法 先将延时器放到 异步队列 宏任务中  先执行自己的定义的then方法
// 真正的promise 已经定义好 .then 属于微任务 也会执行在宏任务之前
p1
  .then(res => {
    console.log(res)
    throw new Error('reject测试')   //reject测试
  }).then(() => { }, err => {
    console.log(err, '测试')
  })
//   .then(res => {
//     console.log(res) */
//   })