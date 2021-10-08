import services from '@/services'
const CompanyInfomationGroupService = services.get('CompanyInfomationGroupService')

export default function useUpdateCompanyInfomationService(id, data) {
  const updateCompanyInfomation = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyInfomationGroupService.updateCompanyInfomation(id, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { updateCompanyInfomation }
}
