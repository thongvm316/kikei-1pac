import services from '@/services'
const LogService = services.get('LogService')

export default function useGetLogListService(params, data) {
  const getLists = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await LogService.getLists(params, data)
      return response.data
    } catch (e) {
      throw e
    }
  }
  return {
    getLists
  }
}
