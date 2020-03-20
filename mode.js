// 订阅
class Dep {
  constructor() {
    this.subs = []
  }
  // 添加事件
  addSub (sub) {
    this.subs.push(sub)
  }
  // 依次执行里面的函数
  notify () {
    this.subs.forEach(item => item.update())
  }
}
// 发布
class Watcher { //Watch是一个类  通过这个类创建的实例  每一个都有update方法
  constructor(fn) {
    this.fn = fn
  }
  // 执行传递的fn方法
  update () {
    this.fn()
  }
}


let watcher = new Watcher(function () { //监听函数
  console.log(1)
})
let dep = new Dep()
dep.addSub(watcher)  //将要触发的事件放到数组中
dep.addSub(watcher)  //将要触发的事件放到数组中

dep.notify()