import * as dateFns from "date-fns"


interface URLBuilder {
  (date: Date): string
}

interface Options {
  selectedDate: Date
  urlBuilder: URLBuilder

  /**
   * the index of the first day of the week (0 - Sunday)
   * @see https://date-fns.org/v2.10.0/docs/getWeeksInMonth#arguments
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

interface Week {
  days: Day[]
}

interface Day {
  day: number
  url: string
  selected: boolean
}

export class DatePicker {
  selectedDate: Date;
  urlBuilder: URLBuilder
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6

  constructor(options: Options) {
    this.selectedDate = options.selectedDate
    this.urlBuilder = options.urlBuilder
    this.weekStartsOn = options.weekStartsOn || 0
  }

  getWeeks(): Week[] {
    const weeksInMonth = dateFns.getWeeksInMonth(this.selectedDate, { weekStartsOn: this.weekStartsOn })
    const startOfMonth = dateFns.startOfMonth(this.selectedDate)
    const startOfWeek = dateFns.startOfWeek(startOfMonth, { weekStartsOn: this.weekStartsOn })
    const weeks: Week[] = []
    let cursor = startOfWeek

    for (let week = 1; week <= weeksInMonth; week++) {
      const week: Week = {
        days: []
      }

      for (let i = 0; i < 7; i++) {
        week.days.push({
          day: cursor.getDate(),
          url: this.urlBuilder(cursor),
          selected: dateFns.isSameDay(this.selectedDate, cursor)
        })

        // add day
        cursor = dateFns.addDays(cursor, 1)
      }

      weeks.push(week)
    }
    return weeks
  }

  getFormattedDate() {
    return dateFns.format(this.selectedDate, "MMMM yyyy")
  }

  getPreviousUrl() {
    return this.urlBuilder(dateFns.addMonths(this.selectedDate, -1))
  }

  getNextUrl() {
    return this.urlBuilder(dateFns.addMonths(this.selectedDate, 1))
  }
}
