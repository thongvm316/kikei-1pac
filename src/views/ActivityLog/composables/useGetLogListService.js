import services from '@/services'
const LogService = services.get('LogService')

export default function useGetLogListService(param, data) {
  const getLists = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await LogService.getLists(param, data)
      return response.data
    } catch (e) {
      throw e
    }
  }
  return {
    getLists
  }
}
