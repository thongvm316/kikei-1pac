import services from '@/services'
const FinancingService = services.get('FinancingService')

export default function useGetFinancingListService(params, data) {
  const getLists = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await FinancingService.getLists(params, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getLists
  }
}
