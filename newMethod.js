/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-05-14 10:30:53
 * @LastEditTime: 2020-05-14 11:05:02
 * @LastEditors: tiange
 */
/* 
• 以构造器的prototype属性为原型，创建新对象；
• 将this(也就是上一句中的新对象)和调用参数传给构造器，执行；
• 如果构造器没有手动返回对象，则返回第一步创建的新对象，如果有，则舍弃掉第一步创建的新对象，返回手动return的对象。
*/
// 实现简单的new 方法
/* function Parent (name, age) {
  this.name = name
  this.age = age
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}
// 定义自己的new方法
function newMethod (Parent, ...rest) {
  // 以构造器的prototype属性为原型，创建新对象
  let child = Object.create(Parent.prototype)
  // 将this和调用参数传给构造器执行
  let result = Parent.apply(child, rest)
  // 3.如果构造器没有手动返回对象，则返回第一步的对象
  return typeof result === 'object' ? result : child
}
//创建实例，将构造函数Parent与形参作为参数传入
const child = newMethod(Parent, 'echo', 26);
child.sayName() //'echo'; */

// Object.create() 方式创建
// var a = { rep: 'apple' }
// var b = Object.create(a)
// console.log(b)  // {}
// console.log(b.__proto__) // {rep: "apple"}
// console.log(b.rep) // {rep: "apple"}

// 创建一个以另一个空对象为原型,且拥有一个属性p的对象
/* var o = Object.create({}, { p: { value: 42 } })
o.p = 22
console.log(o.p) */

var triangle = { a: 1, b: 2, c: 3 };

function ColoredTriangle () {
  this.color = 'red';
}

//ColoredTriangle.prototype = triangle;  
//ColoredTriangle.prototype.constructor === ColoredTriangle// false
//ColoredTriangle.prototype.constructor === ColoredTriangle// true
Object.assign(ColoredTriangle.prototype, triangle)

var c = new ColoredTriangle()
// console.log(c)

// 因为 Object.assign 是不能拷贝到继承或原型上的方法的。所以 实例c2 没有 a 这个属性。
// var c2 = Object.assign({}, c)
// console.log(c2); //red
// console.log(c2.a); //undefined
// 1、
var originProto = Object.getPrototypeOf(c);
var originProto2 = Object.create(originProto);
// console.log(originProto, originProto2);
// var c2 = Object.assign(originProto2, c);
// console.log(c2)
// console.log(c2.color); // red
// console.log(c2.a); // 1
// 2、

// Object.assign() 方法不能正确拷贝 get ，set 属性
// 可以把Object.create()的参数理解为：第一个参数是放在新对象的原型上的，第二个参数是放在新对象的实例上的。
// 所以上面例子
// Object.getPrototypeOf() 得到的是 c 对象的原型，然后作为第一个参数，所以会在新对象c2 的原型上。
// Object.getOwnPropertyDescriptors() 得到是 c 对象自身的可枚举属性，作为第二个参数，放在 c2 的实例上。

//得到是 c 对象自身的可枚举属性，作为第二个参数，放在 c2 的实例上。
// console.log(Object.getOwnPropertyDescriptors(c)) 
// var c2 = Object.create(Object.getPrototypeOf(c), Object.getOwnPropertyDescriptors(c))
// console.log(c2)
// Object.defineProperty(c, 'colorGet', {
//   enumerable: true, // 设为可枚举，不然 Object.assign 方法会过滤该属性
//   get () {
//     return "Could it return " + this.color
//   }
// })
// var c3 = Object.create(Object.getPrototypeOf(c), Object.getOwnPropertyDescriptors(c))
// console.log(c3)