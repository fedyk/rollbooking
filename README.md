# Rollbooking - fast, modern, powerful booking system for barbershops

### Concepts

#### Resources:

* Account / User | Business
* Calendar
* Calendar List
* Event
* Service
* Booking service

#### Relationships

 - User can have many Businesses
 - The business has one Calendar List
 - Calendar List has a list of User’s Calendars
 - User can have many Calendars
 - Freebusy are real-time data based on calendar list and events 

``` 
-> one-to-one
=> many-to-many

`Account/User` => `Account/Bussiness` []
`Account/User` => `Calendar` 
`Account/User` => `Services` []
`Account/Bussiness` -> `CalendarList` 
`CalendarList` .    => `Calendar` (here `CalendarList` has many References to User Calendars)
`Account/Business` => `Services` []
`Calendar` => `Events` 
```
