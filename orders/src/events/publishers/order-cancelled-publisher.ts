import { Subjects, Publisher, OrderCancelledEvent } from '@khanhdp955/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}

