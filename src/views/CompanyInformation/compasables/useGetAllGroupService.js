import services from '@/services'
const CompanyInfomationGroupService = services.get('CompanyInfomationGroupService')

export default function useGetAllGroupService() {
  const getAllGroup = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyInfomationGroupService.getAllGroup()
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { getAllGroup }
}
