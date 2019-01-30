export function rawEventToEvent(event) {
  return {
    id: event.id,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    resourceId: event.resourceId
  };
}
