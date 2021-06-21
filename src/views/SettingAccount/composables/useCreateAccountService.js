import services from '@/services'
const AccountService = services.get('AccountService')

export default function useCreateAccountService(data) {
  const createAccount = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AccountService.createAccount(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { createAccount }
}
