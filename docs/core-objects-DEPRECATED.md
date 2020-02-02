# Rollbooking Core Objects

## Accounts

### User
```ts
{
  id: string
  type: "account#user"
  name: string
  primaryCalendarId: string
}
```

### Salon
```ts
{
  id: string
  type: "account#salon"
  name: string
}
```

## Calendar
```ts
{
  id: string
  summary: string
  timeZone: string
}
```

## Event
```ts
{
  id: string
  type: "event#single"
  start: {
    date: date,
    dateTime: datetime,
    timeZone: string
  },
  end: {
    date: date,
    dateTime: datetime,
    timeZone: string
  }
  summary: string
  description: string
  status: string
  startTime: string
  endTime: string
}
```

## FreeBusy

```ts
{
  timeMin: string
  timeMax: string
  calendars: {
    [calendarId: string]: Array<{
      startTime: string,
      endTime: string
    }>
  }
}
```

## Primitives

### Date

```ts
type Date = "yyyy-mm-dd"
```

### DateTime

```ts
type DateTime = "yyyy-mm-ddThh:mm:ssZ"
```