import {
  NotAuthorizeError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@khanhdp955/common'
import express, { Request, Response } from 'express'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { Order } from '../models/order'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizeError()
    }

    order.status = OrderStatus.Cancelled

    await order.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }
