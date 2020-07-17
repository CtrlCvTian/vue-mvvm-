/*
 * @Description:
 * @Author: tiange
 * @Date: 2020-06-24 15:40:01
 * @LastEditTime: 2020-06-26 17:00:28
 * @LastEditors: tiange
 */

// 使用koa进行测试
const Koa = require('koa')
router = require('koa-router')()
KoaParser = require('koa-bodyparser')
const Controller = require('./controller')
const controller = new Controller()
const app = new Koa()
// 中间件
app.use(KoaParser())
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next()
  }
})
// 配置路由信息
router.post('/handle', async (ctx, next) => {
  let frontInfo = await controller.handleFormData(ctx)
  console.log(frontInfo, 'frontInfo')
  ctx.body = 200
}).post('/verify', async (ctx, next) => {
  // console.log(ctx.request.body, typeof ctx.request.body)
  await controller.handleVerifyUpload(ctx)
})

// 进行使用路由
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
  console.log('koa is listening on port 3000')
})