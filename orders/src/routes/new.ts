import {
  BadRequestError,
  currentUser,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@khanhdp955/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 60 * 15

router.post(
  '/api/orders',
  currentUser,
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      //? assumption mongoDB is used
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    })
    await order.save()

    res.status(201).send(order)
  }
)

export { router as createOrderRouter }
