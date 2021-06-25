import moment from 'moment'

export const fromStringToDateTimeFormat = (dateTimeValueStr, formatter = 'YYYY/MM') => {
  if (!dateTimeValueStr) return ''

  return moment(new Date(dateTimeValueStr)).format(formatter)
}

export const fromDateObjectToDateTimeFormat = (dateValue, formatter = 'YYYY-MM-DD') => {
  if (!dateValue) return ''

  return moment(dateValue).format(formatter)
}

export const fromStringToDateTimeFormatPicker = (dateValue, formatter = 'YYYY/MM') => {
  if (!dateValue) return null // default value empty of datepicker

  return moment(new Date(dateValue), formatter)
}
