import services from '@/services'
const CompanyService = services.get('CompanyService')

export default function useCreateCompanyService(data) {
  const createCompany = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyService.createCompany(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { createCompany }
}
