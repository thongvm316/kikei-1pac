import services from '@/services'
const CompanyService = services.get('CompanyService')

export default function useDepositNewService() {
  function getCompanyList(params, data) {
    return CompanyService.getLists(params, data).then((res) => res.data)
  }

  return {
    getCompanyList
  }
}
