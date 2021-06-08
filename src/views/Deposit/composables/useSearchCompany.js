/* eslint-disable no-useless-catch */
import services from '@/services'
const CompanyService = services.get('CompanyService')

// export default function useDepositNewService() {
//   function getCompanyList(params, data) {
//     return CompanyService.getLists(params, data).then((res) => res.data)
//   }

//   return {
//     getCompanyList
//   }
// }

export const getCompanyList = async (data, params) => {
  try {
    const { data = {} } = await CompanyService.getLists(data, params)

    return data
  } catch (e) {
    throw e
  }
}
