import services from '@/services'
const CurrencyService = services.get('CurrencyService')

export default function useGetCurrencyListService() {
  const getCurrencyCompanyInfomation = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CurrencyService.getCurrencyCompanyInfomation()
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getCurrencyCompanyInfomation
  }
}
