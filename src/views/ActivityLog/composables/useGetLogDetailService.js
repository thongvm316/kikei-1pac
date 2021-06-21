import services from '@/services'
const LogService = services.get('LogService')

export default function useGetLogDetailService(id) {
  const logDetail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await LogService.logDetail(id)
      return response.data
    } catch (e) {
      throw e
    }
  }
  return {
    logDetail
  }
}
