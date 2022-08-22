import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { currentUser, errorHandler, NotFoundError } from '@khanhdp955/common'

import { createOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes/index'
import { deleteOrderRouter } from './routes/delete'

const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(currentUser)

app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)

app.use(errorHandler)
app.all('*', async (req, res) => {
  throw new NotFoundError()
})

export { app }
