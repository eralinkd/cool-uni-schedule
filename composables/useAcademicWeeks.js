export const useAcademicWeeks = () => {
  const getAcademicYear = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const september1 = new Date(currentYear, 8, 1)

    if (now >= september1) {
      return {
        start: currentYear,
        end: currentYear + 1
      }
    }
    else {
      return {
        start: currentYear - 1,
        end: currentYear
      }
    }
  }

  const getWeekDates = (weekNumber) => {
    const academicYear = getAcademicYear()
    const september1 = new Date(academicYear.start, 8, 1)

    const firstMonday = new Date(september1)
    const dayOfWeek = september1.getDay()
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7
    firstMonday.setDate(september1.getDate() + daysUntilMonday)

    const startDate = new Date(firstMonday)
    startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    return { startDate, endDate }
  }

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${day}.${month}`
  }

  const formatDateUkrainian = (date) => {
    const months = [
      'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ]
    return `${date.getDate()} ${months[date.getMonth()]}`
  }

  const getCurrentWeekNumber = () => {
    const academicYear = getAcademicYear()
    const september1 = new Date(academicYear.start, 8, 1)
    const now = new Date()

    const firstMonday = new Date(september1)
    const dayOfWeek = september1.getDay()
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7
    firstMonday.setDate(september1.getDate() + daysUntilMonday)

    const diffTime = now.getTime() - firstMonday.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weekNumber = Math.ceil(diffDays / 7)

    return Math.max(1, Math.min(weekNumber, 43))
  }

  const getWeekInfo = (weekNumber) => {
    const { startDate, endDate } = getWeekDates(weekNumber)
    const july1 = new Date(getAcademicYear().end, 6, 1)

    if (endDate > july1) {
      return null
    }

    let type = 'навчання'
    if (weekNumber >= 16 && weekNumber <= 18) type = 'сесія'
    if (weekNumber >= 19 && weekNumber <= 21) type = 'канікули'
    if (weekNumber >= 35 && weekNumber <= 37) type = 'сесія'
    if (weekNumber >= 38 && weekNumber <= 43) type = 'канікули'

    return {
      number: weekNumber,
      start: formatDateUkrainian(startDate),
      end: formatDateUkrainian(endDate),
      startFormatted: formatDate(startDate),
      endFormatted: formatDate(endDate),
      type,
      dates: { startDate, endDate }
    }
  }

  const getAllWeeks = () => {
    const weeks = []
    for (let i = 1; i <= 43; i++) {
      const weekInfo = getWeekInfo(i)
      if (weekInfo) {
        weeks.push(weekInfo)
      }
    }
    return weeks
  }

  return {
    getAcademicYear,
    getCurrentWeekNumber,
    getWeekInfo,
    getAllWeeks,
    formatDate,
    formatDateUkrainian
  }
}
