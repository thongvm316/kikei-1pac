import services from '@/services'
const CompanyInfomationGroupService = services.get('CompanyInfomationGroupService')

export default function useGetListSaleTargetService(id) {
  const getListSaleTarget = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyInfomationGroupService.getListSaleTarget(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { getListSaleTarget }
}
