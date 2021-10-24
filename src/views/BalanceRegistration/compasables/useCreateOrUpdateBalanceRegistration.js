import services from '@/services'
const BalanceRegistrationService = services.get('BalanceRegistrationService')

export default function useCreateOrUpdateBalanceRegistrationService(id, data) {
  const createOrUpdate = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await BalanceRegistrationService.createOrUpdateRegistration(id, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { createOrUpdate }
}
