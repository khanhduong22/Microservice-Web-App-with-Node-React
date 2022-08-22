import { OrderStatus } from '@khanhdp955/common'
import mongoose from 'mongoose'
import { TicketDoc } from './ticket'

export { OrderStatus }

// An interface that describes the properties
// that are required to create a new Order
interface OrderAttrs {
  status: OrderStatus
  expiresAt: Date
  userId: string
  ticket: TicketDoc
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
  status: OrderStatus
  expiresAt: Date
  userId: string
  ticket: TicketDoc
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
