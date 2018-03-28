import * as Koa from "koa"
import { BaseContext } from "koa"


export default class Service {
    ctx: BaseContext;
    app: Koa;
    constructor(ctx: BaseContext) {
        this.ctx = ctx;
        this.app = ctx.app;
    }
}