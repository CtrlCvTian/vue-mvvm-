/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-06-24 16:10:30
 * @LastEditTime: 2020-06-26 17:04:45
 * @LastEditors: tiange
 */
const path = require('path')
fse = require('fs-extra')
multiparty = require('multiparty')
const extractExt = fileName =>
  fileName.slice(fileName.lastIndexOf('.'), fileName.length)
const UPLOAD_DIR = path.resolve(__dirname, '.', 'target')
module.exports = class {
  async handleVerifyUpload (ctx) {
    // 拿到post 的 data, bodyParser
    const { fileName, fileHash } = ctx.request.body
    // 切割文件的后缀
    const ext = extractExt(fileName) //.jpeg
    // 要进行创建的存放文件的文件夹
    const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`)
    if (fse.existsSync(filePath)) {
      ctx.body = {
        shouldUpload: false
      }
    } else {
      ctx.body = {
        shouldUpload: true,
        uploadeList: []
      }
    }
  }
  handleFormData (ctx) {
    let lastInfo = ''
    const multipart = new multiparty.Form()
    multipart.parse(ctx.req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        lastInfo = {
          status: 500,
          fileInfo: "process file chunk failed"
        }
        return lastInfo
      }
      const [hash] = fields.hash
      const [filename] = fields.filename
      const [fileHash] = fields.fileHash
      const [chunk] = files.chunk
      // 文件夹流的总名称
      const chunkDir = path.resolve(UPLOAD_DIR, fileHash)
      // 文件流的名称
      const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${extractExt(filename)}`)
      console.log(filePath)
      // 文件夹已经有这个流文件
      if (fse.existsSync(filePath)) {
        lastInfo = {
          status: 200,
          fileInfo: "file exist"
        }
        console.log(lastInfo, 'lastInfo1')
        return lastInfo
      }
      // 没有存放流文件的文件夹的话进行创建
      if (!fse.existsSync(chunkDir)) {
        // 如果目录地址有没有 target
        await fse.mkdirs(chunkDir);
      }
      // 进行将文件放到指定文件
      try {
        await fse.move(chunk.path, path.resolve(chunkDir, hash))
        lastInfo = {
          status: 200,
          fileInfo: "received file chunk"
        }
        console.log(lastInfo, 'lastInfo2')
        return lastInfo
      } catch (error) {

      }
    })
  }
}