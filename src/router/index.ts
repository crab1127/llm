export default (router: any) => {
  router
    .get('/', async(ctx:any, next:any) => {
      ctx.body = '我是首页'
    })

  return router
}