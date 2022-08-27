import { OrderCreatedEvent, OrderStatus } from '@khanhdp955/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdasd',
    expiresAt: 'asd',
    ticket: {
      id: 'asdasas',
      price: 99,
    },
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('replicate the order', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)
  expect(order!.price).toEqual(data.ticket.price)
})

it('test acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
