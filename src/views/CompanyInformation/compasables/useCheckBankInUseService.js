import services from '@/services'
const CompanyInfomationGroupService = services.get('CompanyInfomationGroupService')

export default function useCheckBankInUseService(id) {
  const checkBankInUse = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyInfomationGroupService.checkBankInUse(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { checkBankInUse }
}
