/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-06-24 14:26:25
 * @LastEditTime: 2020-06-24 14:59:30
 * @LastEditors: tiange
 */
// 计算hash值
self.importScripts('/spark-md5.min.js')
// 在当前的这个通过self 进行访问
self.onmessage = e => {
  // self.postMessage({
  //   "msg": '你好'
  // })
  // 获取主线程传递的数据
  const { fileChunkList } = e.data
  // 用来进行对读取的内容进行计算 获取hash值
  const spark = new self.SparkMD5.ArrayBuffer()
  let percentage = 0 //用来展示进度
  let count = 0 // 进行判断是否读取完成
  const loadNext = index => {
    const reader = new FileReader() //文件阅读对象
    // 异步去读取当前文件  结果用ArrayBuffer对象表示 需要读取的是blob流
    reader.readAsArrayBuffer(fileChunkList[index].file)
    // 用来监听是否读取完毕
    reader.onload = e => {
      count++
      // 将读取到的文件  发送给通过内容进行计算的第三方库
      spark.append(e.target.result)
      // 读取完成了
      if (count === fileChunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end()  //通过这个会发送最后读取后的值
        })
        self.close() //关闭线程
      } else {
        // 还没有读取完成
        percentage = 100 / fileChunkList.length
        self.postMessage({
          percentage
        })
        loadNext(count)
      }
    }
  }
  loadNext(0)
}