import moment from 'moment'
import { typeDepositEnums } from '@/enums/deposit.enum'
import i18n from '@/locale'
const { t } = i18n.global

export default {
  /* ---------------------- date time format ---------------------------- */
  moment_l(value) {
    return `${moment(value).format('DD/MM/YYYY')}`
  },

  moment_mm_dd(value) {
    return `${moment(value).format('MM/YYYY')}`
  },

  /* ---------------------- number & price format ----------------------- */
  number_with_commas(value) {
    if (!value) return 0
    const floatNumberFormatted = value
      ? parseFloat(value)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : 0
    return floatNumberFormatted
  },

  format_bolean_text_confirmed(value) {
    if(!value) return 'No'

    return 'Yes'
  },

  format_deposit_type_name(value) {
    const type = typeDepositEnums.filter(item => item.type === value)[0]
    if (!type) return ''

    return t(`deposit.deposit_list.${type.name}`)
  }
}
