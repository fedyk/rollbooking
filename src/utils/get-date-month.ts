var defaultLocaleMonths: string[] = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');

export default function getDateMonth(date: Date, localeMonths = defaultLocaleMonths): string {
  if (date instanceof Date) {
    return localeMonths[date.getMonth()]
  }

  return null
}
