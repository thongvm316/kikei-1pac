import services from '@/services'
const CompanyService = services.get('CompanyService')

export default function useGetCompanyDetailService(id) {
  const companyDetail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyService.companyDetail(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    companyDetail
  }
}
