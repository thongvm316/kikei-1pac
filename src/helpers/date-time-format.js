import moment from 'moment'

export const fromStringToDateTimeFormat = (dateTimeValueStr, formatter = 'YYYY/MM') =>  {
  if (!dateTimeValueStr) return ''

  return moment(new Date(dateTimeValueStr)).format(formatter)
}

export const fromDateObjectToDateTimeFormat = (dateValue, formatter = 'YYYY-MM-DD') => {
  if (!dateValue) return ''

  return moment(dateValue).format(formatter)
}
