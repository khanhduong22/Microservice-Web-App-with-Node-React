import { OrderStatus } from '@khanhdp955/common'
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// An interface that describes the properties
// that are required to create a new Order
interface OrderAttrs {
  id: string
  price: number
  userId: string
  version: number
  status: OrderStatus
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
  id: string
  price: number
  userId: string
  version: number
  status: OrderStatus
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
    // ...attrs,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
