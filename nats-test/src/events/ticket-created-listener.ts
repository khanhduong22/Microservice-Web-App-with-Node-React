import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent, Subjects, Listener } from '@khanhdp955/common'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = 'payment-service'

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data)

    console.log(data.title)
    console.log(data.price)

    msg.ack()
  }
}
