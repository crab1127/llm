export default (router: any) => {
  router
    .get('/', async(ctx:any, next:any) => {
      ctx.body = '233'
    })
    .get('/:id', async(ctx:any, next:any) => {
      const id = ctx.params.id
      ctx.body = '订单号：' + id
    })

  return router
}