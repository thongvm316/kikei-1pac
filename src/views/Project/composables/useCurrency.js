/* eslint-disable no-useless-catch */
import services from '@/services'
const CurrencyService = services.get('CurrencyService')

export const getCurrencyList = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await CurrencyService.getCurrencyCompanyInfomation()
    return response?.data || {}
  } catch (e) {
    throw e
  }
}
