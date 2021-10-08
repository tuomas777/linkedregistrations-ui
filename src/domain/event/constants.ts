export enum EventStatus {
  EventCancelled = 'EventCancelled',
  EventPostponed = 'EventPostponed',
  EventRescheduled = 'EventRescheduled',
  EventScheduled = 'EventScheduled',
}

export enum EventTypeId {
  General = 'General',
  Course = 'Course',
  Volunteering = 'Volunteering',
}

export enum PublicationStatus {
  Draft = 'draft',
  Public = 'public',
}

export enum SuperEventType {
  Recurring = 'recurring',
  Umbrella = 'umbrella',
}

export const TEST_EVENT_ID = 'helmet:222453';
export const EVENT_INCLUDES = ['keywords'];
