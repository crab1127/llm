import * as Koa from 'koa'
import { BaseContext } from 'koa'

export default class Controller {
  ctx: BaseContext
  constructor(ctx: BaseContext) {
    console.log(123, 'contronller', ctx)
    this.ctx = ctx
  }
}