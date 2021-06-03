import services from '@/services'
const CompanyService = services.get('CompanyService')

export default function useGetCompanyListService(params) {
  const getLists = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyService.getLists(params)
      return response
    } catch (e) {
      throw e
    }
  }

  return {
    getLists
  }
}
