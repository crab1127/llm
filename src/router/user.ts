export default (router: any, app: any) => {
  router
    .get('/', app.controller.user.getUser)

  return router
}