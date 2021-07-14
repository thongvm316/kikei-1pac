import services from '@/services'
const CurrencyService = services.get('CurrencyService')

export default function useGetGroupListService() {
  const getCurrency = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CurrencyService.getCurrency()
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getCurrency
  }
}
