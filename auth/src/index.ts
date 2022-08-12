import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'

import { currentUserRouter } from './routes/current-user'
import { signupRouter } from './routes/signup'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.use(json())

app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(currentUserRouter)

app.use(errorHandler)
app.all('*', async (req, res) => {
  throw new NotFoundError()
})

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
  } catch (error) {
    console.error(error)
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!')
  })
}

start()
