import { OrderCancelledEvent, OrderStatus } from '@khanhdp955/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 123,
    status: OrderStatus.Created,
    userId: 'asdas',
    version: 0,
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, order }
}

it('update status of the order', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)

  const cancelledOrder = await Order.findById(order.id)

  expect(cancelledOrder).toBeDefined()
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled)
  expect(cancelledOrder!.id).toEqual(data.id)
})

it('test acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
