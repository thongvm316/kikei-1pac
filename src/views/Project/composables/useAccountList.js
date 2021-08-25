/* eslint-disable no-useless-catch */
import service from '@/services'
const SettingAccountService = service.get('SettingAccountService')

export const useAccountList = async () => {
  try {
    const { data } = await SettingAccountService.getListDropdown()
    return data.result.data || []
  } catch (e) {
    throw e
  }
}
