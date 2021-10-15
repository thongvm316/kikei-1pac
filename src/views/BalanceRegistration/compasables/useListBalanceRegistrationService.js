import services from '@/services'
const BalanceRegistrationService = services.get('BalanceRegistrationService')

export default function useGetListBalanceRegistrationService(data) {
  const getLists = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await BalanceRegistrationService.getListBalanceRegistration(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { getLists }
}
