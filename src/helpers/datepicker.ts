import * as dateFns from "date-fns"

interface Options {
  selectedDate: Date
  urlBuilder(date: Date): string
  /**
   * the index of the first day of the week (0 - Sunday)
   * @see https://date-fns.org/v2.10.0/docs/getWeeksInMonth#arguments
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

interface Week {
  days: Array<{
    day: number
    url: string
    selected: boolean
  }  >
}

interface Day {
  day: number
  url: string
  selected: boolean
}

export function datepicker(options: Options) {
  const weeksInMonth = dateFns.getWeeksInMonth(options.selectedDate, {
    weekStartsOn: options.weekStartsOn
  })
  const startOfMonth = dateFns.startOfMonth(options.selectedDate)
  const startOfWeek = dateFns.startOfWeek(startOfMonth, {
    weekStartsOn: options.weekStartsOn
  })
  const weeks: Week[] = []
  const prevUrl = options.urlBuilder(dateFns.addMonths(options.selectedDate, -1))
  const nextUrl = options.urlBuilder(dateFns.addMonths(options.selectedDate, 1))
  const formattedDate = dateFns.format(options.selectedDate, "MMMM yyyy")
  let cursor = startOfWeek

  for (let week = 1; week <= weeksInMonth; week++) {
    const week: Week = {
      days: []
    }

    for (let i = 0; i < 7; i++) {
      week.days.push({
        day: cursor.getDate(),
        url: options.urlBuilder(cursor),
        selected: dateFns.isSameDay(options.selectedDate, cursor)
      })

      // add day
      cursor = dateFns.addDays(cursor, 1)
    }

    weeks.push(week)
  }

  return {
    weeks,
    prevUrl,
    nextUrl,
    formattedDate,
  }
}
