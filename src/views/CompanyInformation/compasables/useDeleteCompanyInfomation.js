import services from '@/services'
const CompanyInfomationGroupService = services.get('CompanyInfomationGroupService')

export default function useDeleteCompanyInfomationService(id) {
  const deleteCompanyInfomation = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyInfomationGroupService.deleteCompanyInfomation(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { deleteCompanyInfomation }
}
