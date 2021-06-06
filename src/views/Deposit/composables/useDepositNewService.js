import services from '@/services'
const CategoryService = services.get('CategoryService')
const SubCategoryService = services.get('SubCategoryService')
const BankAccountsService = services.get('BankAccountsService')
const GroupService = services.get('GroupService')
const DepositService = services.get('DepositService')

export default function useDepositNewService() {
  function getCategoryList() {
    return CategoryService.getCategory().then((res) => res.data)
  }

  function getSubCategoryList() {
    return SubCategoryService.getSubCategory().then((res) => res.data)
  }

  function getBankAccountList() {
    return BankAccountsService.getBankAccounts().then((res) => res.data)
  }

  function getGroupList() {
    return GroupService.getGroupList().then((res) => res.data)
  }

  function createDeposit(data) {
    return DepositService.create(data).then((res) => res.data)
  }

  return {
    getCategoryList,
    getSubCategoryList,
    getBankAccountList,
    getGroupList,
    createDeposit
  }
}
