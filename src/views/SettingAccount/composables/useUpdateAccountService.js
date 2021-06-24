import services from '@/services'
const SettingAccountService = services.get('SettingAccountService')

export default function useUpdateAccountService(id, data) {
  const updateAccount = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SettingAccountService.updateAccount(id, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { updateAccount }
}
