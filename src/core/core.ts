import * as Koa from 'koa'
import Loader from './loader'
import Controller from './base/controller'
import Service from './base/Service'


export default class Crab extends Koa{
  private loader: Loader = new Loader(this)
  private port: number = 3001
  static Controller: typeof Controller = Controller
  static Service: typeof Service = Service

  constructor() {
    super()
  }

  run() {
    this.loader.load()
    return this.listen(this.port, () => {
      console.log('启动成功')
    })
  }
}