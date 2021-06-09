import services from '@/services'
const CompanyService = services.get('CompanyService')

export default function useUpdateCompanyService(id, data) {
  const updateCompany = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyService.updateCompany(id, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { updateCompany }
}
