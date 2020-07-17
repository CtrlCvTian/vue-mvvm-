<!--
 * @Description: 
 * @Author: tiange
 * @Date: 2020-06-24 10:34:18
 * @LastEditTime: 2020-06-26 16:49:33
 * @LastEditors: tiange
--> 
<template>
  <div id="app">
    <div>
      <input
        type="file"
        @change="handelFileChange"
      />
      <el-button @click="handelUpload">上传</el-button>
    </div>
    <div>
      <el-progress :percentage="hasPercentage"></el-progress>
    </div>
  </div>
</template>

<script>
const Status = {
  waiting: 'waiting',
  uploading: 'uploading',
  paused: 'paused'
}
const SIZE = 0.5 * 1024 * 1024
export default {
  name: 'App',
  data: () => ({
    container: {
      file: null,
      hash: '',//哈希值
      workers: null
    },
    status: Status.waiting,
    hasPercentage: 0,
    data: [],
    requestList: []
  }),
  methods: {
    request ({
      url,
      method = 'POST',
      data,
      onProgress = e => e,
      headers = {},
      requestList, //上传文件的列表
    }) {
      return new Promise((resolve, reject) => {
        let xhr = null
        try {
          xhr = new XMLHttpRequest()
        } catch (error) {
          xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }
        if (method === 'GET' && data) {
          url += '?' + data
        }
        xhr.open(method, url)
        if (method === 'GET') {
          xhr.send()
        } else {
          Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key])
          })
          xhr.send(data)
        }
        xhr.onload = (e) => {
          if (requestList) {
            const xhrIndex = requestList.findIndex(item => item === xhr)
            requestList.splice(xhrIndex, 1)
          }
          resolve({
            data: e.target.response,
          })
        }
        if (requestList) {
          requestList.push(xhr)
        }
      })
    },
    async calculateHash (fileChunkList) {
      return new Promise((resolve, reject) => {
        // 计算hash需要花很多时间
        // JS 单线程  通常UI作为主线程进行渲染
        // 可以通过web workers 进行单独开出线程
        this.container.workers = new Worker('/hash.js')
        // 进行发送消息
        this.container.workers.postMessage({ fileChunkList })
        // hash计算完成 后 会进行返回消息
        this.container.workers.onmessage = e => {
          // console.log(e.data)
          const { percentage, hash } = e.data
          this.hasPercentage = percentage
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
    async handelUpload (e) {
      // 要进行大量的任务
      if (!this.container.file) return
      this.status = Status.uploading
      const fileChunkList = this.createFileChunk(this.container.file)
      this.container.hash = await this.calculateHash(fileChunkList)
      // 上传之前先进行验证
      const { shouldUpload, uploadeList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      )
      // 不需要再进行上传
      if (!shouldUpload) {
        this.$message.success("秒传：上传成功")
        this.status = Status.waiting
        return
      }
      // 需要再进行上传 对切片好的数组进行处理
      this.data = fileChunkList.map(({ file }, index) => ({
        fileHash: this.container.hash,
        index,
        hash: this.container.hash + "-" + index, //每个块都有自己的index 在内的hash, 可排序， 可追踪
        chunk: file,  //文件块
        size: file.size,
        percentage: uploadeList.includes(index) ? 100 : 0 //当前切片是否已上传过
      }))
      await this.uploadeChunks(uploadeList) //进行上传切片
    },
    async uploadeChunks (uploadeList = []) {
      // 并发进行请求
      const requestAll = this.data.map(({ chunk, hash, index }) => {
        const formData = new FormData()
        formData.append("chunk", chunk); //文件 blob
        formData.append("hash", hash); //切片hash
        formData.append("filename", this.container.file.name);
        formData.append("fileHash", this.container.hash) //文件hash
        return { formData, index }
      })
        .map(async ({ formData, index }) =>
          this.request({
            url: 'http://localhost:3000/handle',
            data: formData,
            onProgress: this.createProgressHandler(this.data[index]),
            requestList: this.requestList // ?
          })
        )
      // await Promise.all(requestList)
      console.log('进行并发请求')
    },
    createProgressHandler () {

    },
    async verifyUpload (fileName, fileHash) {
      const data = await this.request({
        url: 'http://localhost:3000/verify',
        headers: {
          'content-Type': 'application/json'
        },
        data: JSON.stringify({
          fileName,
          fileHash
        })
      })
      return JSON.parse(data.data)
    },
    // 默认值按照0.5M进行切割
    createFileChunk (file, size = SIZE) {
      const fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push({
          file: file.slice(cur, cur + size)
        })
        cur += size
      }
      return fileChunkList
    },
    handelFileChange (e) {
      // 切割文件
      const [files] = e.target.files
      this.container.file = files
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
