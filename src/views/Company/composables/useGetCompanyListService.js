import services from '@/services'
const CompanyService = services.get('CompanyService')

export default function useGetCompanyListService(params, data) {
  const getLists = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyService.getLists(params, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getLists
  }
}
