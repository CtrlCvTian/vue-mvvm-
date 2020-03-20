// vm.$options
function Vue (options = {}) {
  // 把所有属性挂在 $options
  this.$options = options
  var data = this._data = this.$options.data
  // 进行设置观察者模式
  observe(data)
  // 将观察后的值代理到this上
  for (let key in data) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get () {
        return this._data[key]
      },
      set (newValue) {
        this._data[key] = newValue
      }
    })
  }
  initComputed.call(this)
  new Compile(options.el, this)
}
function initComputed () {
  let vm = this
  let computed = vm.$options.computed
  Object.keys(computed).forEach((key) => {
    // [name,age]
    Object.defineProperty(vm, key, {
      // 判断computed中是函数 还是 对象
      get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
      set () { }
    })
  })
}
function Compile (el, vm) {
  // el 表示要替换的范围  vm获取上面的数据
  // 查询标签
  vm.$el = document.querySelector(el)
  let fragment = document.createDocumentFragment()
  let child
  while (child = vm.$el.firstChild) { //将查询到的内容移入到内存中
    fragment.appendChild(child)
  }
  function replace (fragment) {
    // 获取所有的节点进行遍历
    Array.from(fragment.childNodes).forEach((node) => {
      // 获取下面的内容
      let txt = node.textContent
      let reg = /\{\{(.*)\}\}/
      // 说明是文本节点
      if (node.nodeType === 3 && reg.test(txt)) {
        // 取到   a.c   b
        let arrs = RegExp.$1.split('.') // [a,c]  [b]
        let val = vm
        arrs.forEach(function (k) {
          val = val[k]
        })
        // 替换的逻辑需要通过发布订阅模式进行监听
        new Watcher(vm, RegExp.$1, function (newVal) {
          node.textContent = txt.replace(/\{\{(.*)\}\}/, newVal)
        })
        node.textContent = txt.replace(/\{\{(.*)\}\}/, val)
      }
      // 判断v-model 的数据  获取元素节点
      if (node.nodeType === 1) {
        let nodeAttrs = node.attributes //获取dom属性
        Array.from(nodeAttrs).forEach(attr => {
          let name = attr.name //type='text'
          let exp = attr.value //v-mode = 'b'
          if (name.indexOf('v-') === 0) {
            // v-mode 
            // 修改input  value值
            node.value = vm[exp]
          }
          // 进行监听
          new Watcher(vm, exp, function (newVal) {
            node.value = newVal //当set进行触发  触发watcher将内容进行改变
          })
          // 判断input框事件  修改this中的对象值
          node.addEventListener('input', function (e) {
            let value = e.target.value
            vm[exp] = value
          })
        })
      }
      // 判断下面是不是还有子节点   再重复执行
      if (node.childNodes) {
        replace(node)
      }
    })
  }
  replace(fragment)
  vm.$el.appendChild(fragment)
}
// 观察对象进行设置Object.defineProperty
function Observe (data) {
  let dep = new Dep()
  for (let key in data) {
    // 拿到要设置的值
    let value = data[key]
    observe(value)
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true, //设置可以进行枚举
      get () {
        // 判断target值不为空并将这个值放到订阅的数组中
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set (newValue) {
        // 和原先的值一样不进行设置
        if (newValue === value) {
          return
        }
        // 设置新值
        value = newValue
        // 如果要设置的值为引用类型  需要再次数据劫持
        // 初始化数据的时候需要默认判断是否为对象
        observe(newValue)
        dep.notify() //让所有的watch的update方法执行
      }
    })
  }
}
function observe (data) {
  if (typeof data !== "object") {
    return
  }
  return new Observe(data)
}

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
  constructor(vm, exp, fn) {
    // 将传递的进行保存
    this.watcherVm = vm;
    this.watcherExp = exp;
    this.fn = fn
    //添加到订阅中
    Dep.target = this
    let val = vm
    let arr = exp.split('.')
    //获取值的时候会触发get方法
    arr.forEach(function (key) {
      val = val[key]
    })
    Dep.target = null
  }
  // 执行传递的fn方法
  update () {
    let newVal = this.watcherVm
    let arr = this.watcherExp.split('.')
    //获取值的时候会触发get方法
    arr.forEach(function (key) {
      newVal = newVal[key]
    })
    this.fn(newVal)
  }
}