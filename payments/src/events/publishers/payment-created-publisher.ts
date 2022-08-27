import { Subjects, Publisher, PaymentCreatedEvent } from '@khanhdp955/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
