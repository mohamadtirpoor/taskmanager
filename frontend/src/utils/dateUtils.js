import { format as formatJalali } from 'date-fns-jalali'

/**
 * تبدیل تاریخ میلادی به شمسی
 * @param {Date|string} date - تاریخ میلادی
 * @param {string} formatStr - فرمت خروجی (پیش‌فرض: 'yyyy/MM/dd')
 * @returns {string} تاریخ شمسی
 */
export const toJalali = (date, formatStr = 'yyyy/MM/dd') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatJalali(dateObj, formatStr)
}

/**
 * تبدیل تاریخ و ساعت میلادی به شمسی
 * @param {Date|string} date - تاریخ میلادی
 * @returns {string} تاریخ و ساعت شمسی
 */
export const toJalaliDateTime = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatJalali(dateObj, 'yyyy/MM/dd - HH:mm')
}

/**
 * تبدیل تاریخ میلادی به شمسی با نام ماه
 * @param {Date|string} date - تاریخ میلادی
 * @returns {string} تاریخ شمسی با نام ماه
 */
export const toJalaliWithMonth = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatJalali(dateObj, 'd MMMM yyyy')
}

/**
 * گرفتن نام ماه شمسی
 * @param {Date|string} date - تاریخ میلادی
 * @returns {string} نام ماه شمسی
 */
export const getJalaliMonthName = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatJalali(dateObj, 'MMMM yyyy')
}

/**
 * فرمت ساعت
 * @param {Date|string} date - تاریخ میلادی
 * @returns {string} ساعت
 */
export const formatTime = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatJalali(dateObj, 'HH:mm')
}
