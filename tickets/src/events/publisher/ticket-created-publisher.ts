import { Publisher, Subjects, TicketCreatedEvent } from '@khanhdp955/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
