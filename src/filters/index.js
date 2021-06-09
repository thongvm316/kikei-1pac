import moment from 'moment'
import { TYPE_NAME_DEPOSIT } from '@/enums/deposit.enum'
import i18n from '@/locale'
const { t } = i18n.global

export default {
  /* ---------------------- date time format ---------------------------- */
  moment_l(value) {
    if (!value) return ''
    return `${moment(new Date(value)).format('DD/MM/YYYY')}`
  },

  moment_mm_dd(value) {
    if (!value) return ''
    return `${moment(new Date(value)).format('MM/YYYY')}`
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

  /* ---------------------- text & status ----------------------- */
  format_bolean_confirmed_text(value) {
    if (!value) return 'No'

    return 'Yes'
  },

  format_deposit_type_name_text(value) {
    return t(`deposit.deposit_list.${TYPE_NAME_DEPOSIT[value]}`)
  }
}
