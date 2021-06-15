import services from '@/services'
const PeriodService = services.get('PeriodService')

export default function useGetGroupListService(id) {
  const getPeriods = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await PeriodService.getPeriods(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getPeriods
  }
}
