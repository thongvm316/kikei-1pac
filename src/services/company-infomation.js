import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  company_infomation: '/group'
})

export default {
  getAllGroup() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.company_infomation}/all` })
  },

  getTabID(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.company_infomation}/${id}` })
  },

  getListSaleTarget(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.company_infomation}/list_sale_target/${id}` })
  },

  updateCompanyInfomation(id, data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.company_infomation}/${id}`, data })
  },

  createCompanyInfomation(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.company_infomation}`, data })
  },

  deleteCompanyInfomation(id) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.company_infomation}/${id}` })
  }
}
