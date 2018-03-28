import * as fs from 'fs'
import * as path from 'path'
import * as koa from 'koa'
import * as Router from 'koa-router'
import { BaseContext } from 'koa'

const HAS_LOADED = Symbol('hasLoaded')

interface FileModule {
  module: any,
  filename: string
}


export default class Loader {
  private router: any = new Router()
  private app: koa

  constructor(app: koa) {
    this.app = app
  }
  
  private appDir(): string {
    return path.join(__dirname, '..')
  }
  private fileLoader(url: string): Array<FileModule> {
    const fileUrl = path.join(this.appDir(), url)
    
    return fs.readdirSync(fileUrl).map(name => ({
      module: require(path.join(fileUrl, name)).default,
      filename: name.split('.')[0]
    }))
  }

  loadController() {
    const controller = this.fileLoader('controller')
    this.loadToContext(controller, 'controller')
    console.log('controller', this.app)
  }

  loadService() {
    const service = this.fileLoader('service')
    this.loadToContext(service, 'service')
  }


  loadConfig() {
    const env = path.join(this.appDir(), (process.env.NODE_ENV === 'production' ? '/config/config.pro.ts' : '/config/config.dev.ts'))
    const configDef = require(path.join(this.appDir(), '/config/config.default.ts'))
    const configEnv = require(env)
    const config = Object.assign({}, configDef, configEnv)
    Object.defineProperty(this.app, 'config', {
      get: () => config
    })
  }

  loadRouter() {
    const dirs = this.fileLoader('router')
    console.log(dirs)
    dirs.forEach(item => {
      const url = item.filename === 'index' ? '' : item.filename
      this.router.use('/' + url, item.module(new Router(), this.app).routes())
    })
    this.app.use(this.router.routes()).use(this.router.allowedMethods())
  }


  loadToContext(target: Array<FileModule>, property: string) {
    const app = this.app
    Object.defineProperty(this.app, property, {
      get() {
        if (!(<any>this)[HAS_LOADED]) {
          (<any>this)[HAS_LOADED] = {}
        }
        const loaded = (<any>this)[HAS_LOADED]
        if (!loaded[property]) {
          loaded[property] = {}
          target.forEach(mod => {
            console.log(loaded[property], property, target,)
            const key = mod.filename.split('.')[0]
            loaded[property][key] = new mod.module(this, app)
          })
          return loaded[property]
        }
        return loaded[property]
      }
    })
  }

  load() {
    this.loadConfig()
    this.loadController()
    this.loadService()
    this.loadRouter()
  }
}

