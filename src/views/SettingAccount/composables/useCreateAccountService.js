import services from '@/services'
const SettingAccountService = services.get('SettingAccountService')

export default function useCreateAccountService(data) {
  const createAccount = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SettingAccountService.createAccount(data)

      return response.data
    } catch (e) {
      throw e
    }
  }

  return { createAccount }
}
