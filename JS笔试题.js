/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-04-12 14:25:31
 * @LastEditTime: 2020-07-16 15:39:19
 * @LastEditors: tiange
 */

// (5).add(3).minus(2) 8
~ function () {
  function checkout (n) {
    return Number(n) && (isNaN(n) ? 0 : Number(n))
  }
  function add (n) {
    n = checkout(n)
    return this + n
  }
  function minus (n) {
    n = checkout(n)
    return this - n
  }
  ['add', 'minus'].forEach(item => {
    Number.prototype[item] = eval(item);
  })
}();

// 实现ecah方法 不改变原先数组 返回新数组
/* let arr = [10,20,30,'AA',50]
    obj = {}
arr = arr.each(function(item,index){
  // 第二个参数传进行改变this指向  不穿 指向window
  if(isNaN(item)){
    return false //如果return的是false 结束数组循环
  }
  return item * 10
},obj)
//arr = [100,200,300,400,'AA',50] */
let arr = [10, 20, 30, 'AA', 50]

/**
 *实现each方法
 *
 * @param {*} callback 回调函数
 * @param {*} context 传递的上下文
 * @returns
 */
function each (callback, context) {
  // 拿到当前调用者
  if (this.length > 0) {
    let newArray = [];
    for (let i = 0; i < this.length; i++) {
      let flag = callback.call(context || window, this[i], i)
      // 判断返回值 flase结束循环
      if (flag) {
        newArray.push(flag);
      } else {
        for (let j = 0; j < this.length; j++) {
          if (j >= i) {
            newArray.push(this[j]);
          }
        }
        break;
      }
    }
    return newArray;
  }
}
// Array.prototype.each = each
// console.log(arr.each(function (item, index) {
//   return item * 10
// }))

// 实现indexOf 方法
~ function () {
  // 遍历方法
  // function myIndexof (curStr) {
  //   let res = -1
  //   if (this.length < curStr.length) return res
  //   for (let i = 0; i <= this.length - curStr.length; i++) {
  //     if (this.substr(i, curStr.length) === curStr) {
  //       res = i
  //       break
  //     }
  //   }
  //   return res
  // }
  // 正则实现
  function myIndexof (curStr) {
    let res = -1
    let reg = new RegExp(curStr).exec(this)
    if (!reg) {
      res = -1
    } else {
      res = reg.index
    }
    return res
  }
  String.prototype.myIndexof = myIndexof
}()
// let s = 'asdddnjpeisa'
// let t = 'pei'
// console.log(s.myIndexof(t))

// 面试题
/* function Foo () {
  Foo.a = function () {
    console.log(1)
  }
  this.a = function () {
    console.log(2)
  }
  return {
    a: function () {
      console.log(5)
    }
  }
}
Foo.prototype.a = function () {
  console.log(3)
}
Foo.a = function () {
  console.log(4)
}

Foo.a()
let obj = new Foo()
obj.a()
Foo.a() */

/* function Foo () {
  getName = function () {
    console.log(1);
  };
  return this;
};
Foo.getName = function () {
  console.log(2);
};
Foo.prototype.getName = function () {
  console.log(3);
};
var getName = function () {
  console.log(4);
};
function getName () {
  console.log(5);
}; */

// Foo.getName(); //2
// getName(); //4
// Foo().getName(); //1
// getName(); //1
// new Foo.getName(); //2 
/*
  等价于new (Foo.getName())，先执行Foo.getName()，输出2，再创建Foo.getName()方法的实例。
*/
// new Foo().getName(); //3
// console.log((new Foo()).__proto__ === Foo.prototype) true
/*
  相当于(new Foo()).getName()，先创建Foo的实例，调用实例的getName()方法，
  由于自身没有该方法，去原型链上找，它的原型指向构造函数的prototype，即调用Foo.prototype.getName()，输出3
*/
// new new Foo().getName(); //3
/*
  相当于new (new Foo().getName())，即先执行new Foo().getName()，
  由第六步可知，输出3，再创建Foo.prototype.getName()这个函数的实例返回。
*/

function cssStyle2DomStyle (sName) {
  var strArr = sName.split('-')
  var str = ''
  strArr.forEach((item, index) => {
    if (item !== '') {
      if (index === 0 || strArr[index - 1] === '') {
        str += item
      } else {
        str += (item[0].toUpperCase() + item.substring(1))
      }
    }
  })
  return str
}

// console.log(cssStyle2DomStyle('-webkit-border-image'))


function fibonacci (count) {
  function fn (count, curr = 1, next = 1) {
    if (count === 1) {
      return curr
    } else {
      return fn(count - 1, next, curr + next)
    }
  }
  return fn(count)
}

// console.log(fibonacci(2))
function Person (name) {
  this.name = name
}
Person.prototype.eat = function () {
  console.log('Eatting')
}
function create () {
  // 1. 获取构造函数，并且删除 arguments 中的第一项
  let Con = [].shift.call(arguments)
  // 2. 创建一个空的对象并链接到构造函数的原型，使它能访问原型中的属性
  let obj = Object.create(Con.prototype)
  // 3. 使用apply改变构造函数中this的指向实现继承，使obj能访问到构造函数中的属性
  let ref = Con.apply(obj, arguments)
  // 4. 优先返回构造函数返回的对象
  return ref instanceof Object ? ref : obj
}
// var lindaidai = create(Person, 'LinDaiDai')

/* var obj = {
  age: 10,
  foo: function (fn) {
    fn.call(this)()
    arguments[0]()()
    arguments[0].call(this)()
    arguments[0]().call(this)
  }
}
var age = 20
function temp () { return function () { console.log(this.age) } } obj.foo(temp) */

/* function Parent (name) {
  this.parentName = name
  this.getName = function () {
    console.log('这是父组件的方法')
  }
}
Parent.prototype.parentProtoName = { a: 1 }
function Child (sex) {
  this.sex = { a: 1 }
  this.getName = function () {
    console.log('这是子组件的方法')
  }
}
Child.prototype = new Parent()
var child1 = new Child()
var child2 = new Child()
child1.parentName = 'child1'
child2.parentName = 'child2'
child1.parentProtoName.a = 2
child1.sex = { b: 2 }
console.log(Child.prototype.constructor) */