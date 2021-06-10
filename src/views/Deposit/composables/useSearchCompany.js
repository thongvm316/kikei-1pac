/* eslint-disable no-useless-catch */
import services from '@/services'
const CompanyService = services.get('CompanyService')

export const getCompanyList = async (params, data) => {
  try {
    const response = await CompanyService.getLists(params, data)
    return response?.data
  } catch (e) {
    return e.response
  }
}
