import services from '@/services'
const CompanyInfomationGroupService = services.get('CompanyInfomationGroupService')

export default function useCheckBankUsedService(data) {
  const checkBankUsed = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyInfomationGroupService.checkBankUsed(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { checkBankUsed }
}
