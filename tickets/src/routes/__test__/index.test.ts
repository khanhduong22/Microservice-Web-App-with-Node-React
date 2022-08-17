import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

const createTicket = () => {
  const title = 'concert'
  const price = 20
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201)
}

it('cam fetch a list of ticket', async () => {
  Promise.all([createTicket(), createTicket(), createTicket()])

  const res = await request(app).get('/api/tickets').send().expect(200)

  expect(res.body.length).toEqual(3)
})
