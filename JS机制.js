/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-04-14 09:26:53
 * @LastEditTime: 2020-07-13 11:32:37
 * @LastEditors: tiange
 */
/*
  整体的script(作为第一个宏任务)开始执行的时候，会把所有代码分为两部分：“同步任务”、“异步任务”；
  同步任务会直接进入主线程依次执行；
  异步任务会再分为宏任务和微任务；setTimeout() 宏任务  .then() process.nextTick 微任务  先执行微任务
  宏任务进入到Event Table中，并在里面注册回调函数，每当指定的事件完成时，Event Table会将这个函数移到Event Queue中；
  微任务也会进入到另一个Event Table中，并在里面注册回调函数，每当指定的事件完成时，Event Table会将这个函数移到Event Queue中；
  当主线程内的任务执行完毕，主线程为空时，会检查微任务的Event Queue，如果有任务，就全部执行，如果没有就执行下一个宏任务；
  上述过程会不断重复，这就是Event Loop事件循环；
*/
/*
  setTimeout(fn,0)的含义是，指定某个任务在主线程最早可得的空闲时间执行，意思就是不用再等多少秒了，
  只要主线程执行栈内的同步任务全部执行完成，栈为空就马上执行。举例说明：
*/
// https://www.jianshu.com/p/e06e86ef2595
// promise 测试题
/* new Promise(resolve => {
  // promise构造函数里面是同步代码区，和普通代码块一样
  console.log(5);
  resolve(1);
  Promise.resolve().then(() => {
    console.log(2)
  });
  console.log(4)
}).then(t => {
  console.log(t)
}).catch(() => {
  console.log(6);
}).finally(() => {
  console.log(0);
});
console.log(3); */
//5 4 3 2 1 0

/* console.log(1);

setTimeout(function () {
  console.log(2);
}, 0);

Promise.resolve().then(function () {
  console.log(3);
}).then(function () {
  console.log('4.我是新增的微任务');
});

console.log(5); */

// 1，5，3，4.我是新增的微任务，2

/* function add (x, y) {
  console.log(1)
  setTimeout(function () { // timer1
    console.log(2)
  }, 1000)
}
add();
setTimeout(function () { // timer2
  console.log(3)
})
new Promise(function (resolve) {
  console.log(4)
  setTimeout(function () { // timer3
    console.log(5)
  }, 100)
  for (var i = 0; i < 100; i++) {
    i == 99 && resolve()
  }
}).then(function () {
  setTimeout(function () { // timer4
    console.log(6)
  }, 0)
  console.log(7)
})
console.log(8) */
// 1 4 8 7 3 6 5 2

/* setTimeout(function () { // timer1
  console.log(1);
  setTimeout(function () {  // timer3
    console.log(2);
  })
}, 0);
setTimeout(function () {  // timer2
  console.log(3);
}, 0); */

//1，3，2

/* console.log('1');
setTimeout(function () {
  console.log('2');
  process.nextTick(function () {
    console.log('3');
  })
  new Promise(function (resolve) {
    console.log('4');
    resolve();
  }).then(function () {
    console.log('5')
  })
})
process.nextTick(function () {
  console.log('6');
})
new Promise(function (resolve) {
  console.log('7');
  resolve();
}).then(function () {
  console.log('8')
})

setTimeout(function () {
  console.log('9');
  process.nextTick(function () {
    console.log('10');
  })
  new Promise(function (resolve) {
    console.log('11');
    resolve();
  }).then(function () {
    console.log('12')
  })
}) */
/* 1 7 6 8 2 4 3 5 9 11 10 12 */

// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7
//请写出输出内容
/* async function async1 () {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
  // 等价于
    // Promise.resolve(async2()).then(() => {
    //   console.log('async1 end');
    // })
}
async function async2 () {
  console.log('async2');
}

console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0)

async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end'); */
/*
  script start
  async1 start
  async2
  promise1
  script end
  async1 end
  promise2
  setTimeout
*/

/* async function async1 () {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
  // Promise.resolve(async2()).then(()=>{
  //   console.log('async1 end');
  // })
}
async function async2 () {
  //async2做出如下更改：
  new Promise(function (resolve) {
    console.log('promise1');
    resolve();
  }).then(function () {
    console.log('promise2');
  });
}
console.log('script start');

setTimeout(function () {
  console.log('setTimeout');
}, 0)
async1();

new Promise(function (resolve) {
  console.log('promise3');
  resolve();
}).then(function () {
  console.log('promise4');
});

console.log('script end'); */
/*
script start
async1 start
promise1
promise3
script end
promise2
async1 end
promise4
setTimeout
*/

/* async function async1 () {
  console.log('async1 start');
  await async2();
  //更改如下：
  setTimeout(function () {
    console.log('setTimeout1')
  }, 0)
}
async function async2 () {
  //更改如下：
  setTimeout(function () {
    console.log('setTimeout2')
  }, 0)
}
console.log('script start');

setTimeout(function () {
  console.log('setTimeout3');
}, 0)
async1();

new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end'); */
/*
  script start
  async1 start
  promise1
  script end
  promise2
  setTimeout3
  setTimeout2
  setTimeout1
*/

/* async function a1 () {
  console.log('a1 start')
  await a2()
  console.log('a1 end')
}
async function a2 () {
  console.log('a2')
}

console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise1')
})

a1()

let promise2 = new Promise((resolve) => {
  resolve('promise2.then')
  console.log('promise2')
})

promise2.then((res) => {
  console.log(res)
  Promise.resolve().then(() => {
    console.log('promise3')
  })
})
console.log('script end') */

/*
  script start
  a1 start
  a2
  promise2
  script end
  promise1
  a1 end
  promise2.then
  promise3
  setTimeout
*/

// 今日头条面试题
/* async function async1 () {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2 () {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('settimeout')
})
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end') */
/*
  script start
  async1 start
  async2
  promise1
  script end
  async1 end
  promise2
  settimeout
*/

/* var twoSum = function (nums, target) {
  var _result;
  nums.some((item, index) => {
    var _index = nums.indexOf(target - item)
    if (_index !== -1 && index !== _index) {
      _result = [index, _index]
      return true
    }
  })
  return _result
} */