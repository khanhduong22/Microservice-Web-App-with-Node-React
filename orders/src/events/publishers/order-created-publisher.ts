import { Publisher, OrderCreatedEvent, Subjects } from '@khanhdp955/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}

