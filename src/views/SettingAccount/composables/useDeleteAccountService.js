import services from '@/services'
const SettingAccountService = services.get('SettingAccountService')

export default function useDeleteCompanyService(id) {
  const deleteAccount = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SettingAccountService.deleteAccount(id)
      return response
    } catch (e) {
      throw e
    }
  }

  return { deleteAccount }
}
