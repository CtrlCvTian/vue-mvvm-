/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-06-16 15:26:49
 * @LastEditTime: 2020-06-17 17:15:50
 * @LastEditors: tiange
 */
const path = require('path');
const fse = require('fs-extra'); // fs 扩展包
const UPLOAD_DIR = path.resolve(__dirname, '.', 'target')
const fileName = 'yb'
const filePath = path.resolve(UPLOAD_DIR, '..', `${fileName}.jpeg`)
/**
 *
 * @param {*} path 读取的地址
 * @param {*} writeStream 要进行写入的流
 */
function pipeStream (path, writeStream) {
  new Promise((resolve, reject) => {
    // 先进行读取流
    const readStream = fse.createReadStream(path)
    // 监听读取流的结束
    readStream.on('end', () => {
      // 删除文件
      fse.unlinkSync(path)
      resolve()
    })
    // 将读取流流入到写入流
    readStream.pipe(writeStream)
  })
}

// 合并文件
const mergeFileChunk = async (filePath, fileName, size) => {
  // 大文件进行上传 先把要上传的文件 以文件名 将分文件blob 放入target目录
  // 使用node stream 进行合并
  const chunkDir = path.resolve(UPLOAD_DIR, fileName)
  // 读取文件下的内容
  const chunkPaths = await fse.readdir(chunkDir)
  // 进行对写入的blob流进行排序
  chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1])
  // 进行写文件  合并文件
  await Promise.all(chunkPaths.map((chunkPath, index) => {
    // 进行合并文件
    pipeStream(
      path.resolve(chunkDir, chunkPath),
      // 创建写入流
      fse.createWriteStream(filePath, {
        start: index * size,
        end: (index + 1) * size
      })
    )
  }))
  // 删除存放流的根目录
  fse.rmdirSync(chunkDir)
  console.log('合并完成')
}
mergeFileChunk(filePath, fileName, 0.5 * 1024 * 1024)