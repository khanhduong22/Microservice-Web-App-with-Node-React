import { Publisher, Subjects, TicketUpdatedEvent } from '@khanhdp955/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
