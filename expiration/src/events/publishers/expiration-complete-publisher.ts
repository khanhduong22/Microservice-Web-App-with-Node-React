import {
  Publisher,
  ExpirationCompletedEvent,
  Subjects,
} from '@khanhdp955/common'

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted
}
