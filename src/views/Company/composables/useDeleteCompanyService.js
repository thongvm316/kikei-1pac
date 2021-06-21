import services from '@/services'
const CompanyService = services.get('CompanyService')

export default function useDeleteCompanyService(id, params) {
  const deleteCompany = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CompanyService.deleteCompany(id, params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { deleteCompany }
}
