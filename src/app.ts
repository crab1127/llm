import * as Koa from 'koa'
import * as Router from 'koa-router'

import Loader from './loader'

const app = new Koa()
const loader = new Loader(app)

app.listen(3000, () => {
  console.log('sssss')
})