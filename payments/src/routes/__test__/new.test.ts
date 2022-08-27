import { OrderStatus } from '@khanhdp955/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import { stripe } from '../../stripe'

// jest.mock('../../stripe')

it('return a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asd',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404)
})

it('returns a status 401 if the user do not own the order', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asd',
      orderId: order.id,
    })
    .expect(401)
})

it('returns a status 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'asd',
      orderId: order.id,
    })
    .expect(400)
})

it('return a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 1000_00)
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list({ limit: 100 })
  const stripeCharge = stripeCharges.data.find(
    charge => charge.amount === price * 100
  )

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toEqual('usd')

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  })
  expect(payment).toBeDefined()
})
