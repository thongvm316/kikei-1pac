import services from '@/services'
const DepositService = services.get('DepositService')

export default function useGetRecordRead(projectId) {
  const getRecordRead = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await DepositService.getRecordRead(projectId)

      return response.data
    } catch (e) {
      throw e
    }
  }

  return { getRecordRead }
}
