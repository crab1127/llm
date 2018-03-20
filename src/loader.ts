import * as fs from 'fs'
import * as koa from 'koa'
import * as Router from 'koa-router'
import { BaseContext } from 'koa'

export default class Loader {
  private koaRouter: any = new Router
  private app: koa

  constructor(app: koa) {
    this.app = app
  }

  loadConfig() {
    const env = __dirname + (process.env.NODE_ENV === 'production' ? '/config/config.pro.js' : '/config/config.dev.js')
    const configDef = require(__dirname + '/config/config.default.js')
    const configEnv = require(env)
    const config = Object.assign({}, configDef, configEnv)
    Object.defineProperty(this.app, 'config', {
      get: () => config
    })
  }

  loadRouter() {
    const dirs = fs.readdirSync(__dirname)

    dirs.forEach(filename => {
      if (filename == 'index.js') return
      const mod = require(__dirname + '/' + filename).default
      Object.keys(mod).map(key => {
        const [method, path] = key.split(' ')
        const handler:Function = mod[key]
        this.koaRouter[method](path, handler)
      })
    })
    // return this.koaRouter.routes();
    this.app.use(this.koaRouter.routes())
    
  }

  load() {
    this.loadConfig()
    this.loadRouter()
  }
  
}

