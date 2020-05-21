/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-04-12 20:23:55
 * @LastEditTime: 2020-05-13 15:56:38
 * @LastEditors: tiange
 */
// vue 3.0响应式原理
// 2.0 问题 1、默认进行递归 2、数组改变length无效 3、对象不存在的属性无法进行属性拦截
// 弱引用类型
let toProxy = new WeakMap() //原来的对象：代理过的对象
let toRow = new WeakMap() //代理过的对象：原来的对象
//判断是不是对象
function isObject (val) {
  return Object.prototype.toString.call(val) === "[object Object]" ||
    Object.prototype.toString.call(val) === '[object Array]'
}
// 响应式的核心方法
function reactive (target) {
  // 创建响应式对象
  return createReactiveObject(target)
}
// 进行创建
function createReactiveObject (target) {
  if (!isObject(target)) {
    return target
  }
  let proxy = toProxy.get(target) //获取这个对象是否已经被代理过
  if (proxy) {
    return proxy
  }
  if (toRow.has(target)) { //防止被代理过的重复代理
    return target
  }
  let baseHandler = {
    get (target, propKey, receiver) {
      // 返回获取的值 判断是不是引用类型 进行递归代理
      let result = Reflect.get(target, propKey, receiver)
      // 依赖收集  订阅 把当前的key和这个effect对应起来
      //如果目标上这个key变化了 执行数组中对应的effect
      track(target, propKey)
      return isObject(result) ? reactive(result) : result
    },
    set (target, propKey, value, receiver) {
      /* 
        Proxy.set拦截里面使用了Reflect.set，而且传入了receiver，导致触发Proxy.defineProperty拦截。
        这是因为Proxy.set的receiver参数总是指向当前的 Proxy实例（即上例的obj），
        而Reflect.set一旦传入receiver，就会将属性赋值到receiver上面（即obj）
        导致触发defineProperty拦截。如果Reflect.set没有传入receiver，
        那么就不会触发defineProperty拦截。
      */
      //  判断这个属性 以前有还是没有
      let flag = Reflect.has(target, propKey)
      // 获取之前的值 看是否相同  相同就不再修改
      let oldValue = Reflect.get(target, propKey)
      let result = Reflect.set(target, propKey, value, receiver)
      if (!flag) {
        trigger(target, 'add', propKey)
      } else if (oldValue !== value) {
        trigger(target, 'modify', propKey)
        // 需要两个值不相同在进行修改
      }
      // 判断是否设置成功
      // console.log(propKey, value, Reflect.get(target, propKey), target[propKey])
      return result
    },
    deleteProperty (target, propKey) {
      let result = Reflect.deleteProperty(target, propKey)
      return result
    }
  }
  let observed = new Proxy(target, baseHandler)
  // 将代理后的对象和原来的对象进行记录
  toProxy.set(target, observed)
  toRow.set(observed, target)
  return observed
}
// 栈结构  先进后出
let effectStacks = []
/* 
  {
    target:{
      key:[fn,fn]
    }
  }
*/
let targetMap = new WeakMap()
function track (target, key) { //如果这个target中的 key 变化了 执行数组中对应的方法
  // 利用栈的结构 push会在最后一位
  let effect = effectStacks[effectStacks.length - 1]
  if (effect) { //有对应的关系 才创建关联
    // 判断原先Map中有没有这个源对象对应的
    let desMap = targetMap.get(target)
    // 没有
    if (!desMap) {
      targetMap.set(target, desMap = new Map)
    }
    // 判断这个map中存的target其中对应的key是否 已经添加
    let depsSet = desMap.get(key)
    if (!depsSet) {
      desMap.set(key, depsSet = new Set())
    }
    // 判断 key 是否进行依赖收集
    if (!depsSet.has(effect)) {
      depsSet.add(effect)
    }
    // 设置完weakMap 会进行保存
  }
}
function trigger (target, type, key) {
  // 触发的时候再继续进行从weakMap中查找
  let desMap = targetMap.get(target)
  if (desMap) {
    let desSet = desMap.get(key)
    if (desSet) {
      desSet.forEach(effect => {
        effect()
      })
    }
  }
}
// 响应式  副作用
function effect (fn) {
  // 需要把fn 创建成响应式的函数
  let effect = createReactiveEffect(fn)
  effect() //  默认先执行一次
}
function createReactiveEffect (fn) {
  let effect = function () {
    return run(effect, fn) //运行  1.让fn执行 2.把effect 存到栈中
  }
  return effect
}
function run (effect, fn) {
  try {
    effectStacks.push(effect)
    fn() // 利用JS是单线程 调用effect中的回调函数 会先执行get方法 
  } finally {
    // 删除栈中的最后的元素
    effectStacks.pop()
  }
}
// 依赖收集  发布订阅
let obj = reactive({ name: 'proxy' })
effect(() => { //默认effect执行一次  依赖的数据发生改变 再次执行
  console.log(obj.name + '-----x') //会先执行get方法 
})
effect(() => { //默认effect执行一次  依赖的数据发生改变 再次执行
  console.log(obj.name + '-----y') //会先执行get方法 
})
obj.name = 'proxy3'

// 代理对象
// let proxy = reactive({ name: 'proxy' })
/* let proxy = reactive({ name: { n: 'proxy' } }) //多层代理 通过get进行代理
proxy.name.n = 'x'
console.log(proxy.name.n) */
/* let obj = { name: { n: 'proxy' } } //把代理对象单独拿出来
let proxy = reactive(obj)
// reactive(obj)  会重复new Proxy对同一个对象代理多次 需要记录如果这个对象代理过就不需要代理
// reactive(obj)
// reactive(proxy) */
// let proxy = reactive([1, 2, 3]) //此时会触发两次设置 第一次改变对应index的值  第二次修改数组长度
// proxy.push(4)