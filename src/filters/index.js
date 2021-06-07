import moment from 'moment'

export default {
  /* ---------------------- date time format ---------------------------- */
  moment_l(value) {
    return `${moment(value).format('DD/MM/YYYY')}`
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
  }

  // add more format here
}
