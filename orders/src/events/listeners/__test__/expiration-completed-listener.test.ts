import { ExpirationCompletedEvent, OrderStatus } from '@khanhdp955/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompletedListener } from '../expiration-completed-listener'

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'red',
    price: 20,
  })
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, order, data, msg }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const cancelledOrder = await Order.findById(order.id)

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an OrderCancelledEvent', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(eventData!.id).toEqual(order.id)
})

it('ack th message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
