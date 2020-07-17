/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-06-21 21:46:09
 * @LastEditTime: 2020-06-24 10:23:21
 * @LastEditors: tiange
 */
const http = require('http')
const path = require('path')
const multiparty = require('multiparty') //表单提交的请求
const server = http.createServer()
const fse = require('fs-extra')
const UPLOAD_DIR = path.resolve(__dirname, '.', 'target')
server.on('request', async (req, res) => {
  // 设置跨域问题Access-Control-Allow-Origin
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.url === '/') {
    const multipart = new multiparty.Form()
    multipart.parse(req, async (err, fields, files) => {
      if (err) return
      // 获取文件名称
      const [filename] = fields.filename
      // 获取文件块
      const [chunk] = files.chunk
      // 创建存放文件流的名称
      const dir_name = filename.split('-')[0]
      const chunkDir = path.resolve(UPLOAD_DIR, dir_name)
      // 判断是否存在这个文件夹 没有进行创建
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdirs(chunkDir)
      }
      // 进行创建流 放入到文件夹
      await fse.move(chunk.path, `${chunkDir}/${filename}`)
    })
  }
  res.end('hello')
})
server.listen(3000, () => console.log('正在监听3000端口'))