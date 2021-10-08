import services from '@/services'
const CompanyInfomationGroupService = services.get('CompanyInfomationGroupService')

export default function useGetTabIDService(id) {
  const getTabID = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyInfomationGroupService.getTabID(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { getTabID }
}
