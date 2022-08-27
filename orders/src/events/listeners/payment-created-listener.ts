import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@khanhdp955/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
  queueGroupName = queueGroupName

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new Error(`Invalid order ${data.orderId}`)
    }

    order.set({
      status: OrderStatus.Completed,
    })

    await order.save()

    msg.ack()
  }
}
