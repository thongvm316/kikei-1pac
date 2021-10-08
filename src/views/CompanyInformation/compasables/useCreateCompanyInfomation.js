import services from '@/services'
const CompanyInfomationGroupService = services.get('CompanyInfomationGroupService')

export default function useCreateCompanyInfomationService(data) {
  const createCompanyInfomation = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyInfomationGroupService.createCompanyInfomation(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { createCompanyInfomation }
}
