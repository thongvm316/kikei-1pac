import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  revenue: '/revenue-item',
  revenueExpenseItem: '/revenue-expense-item',
  revenueQuantityUnit: '/revenue-quantity-unit'
})

export default {
  getRevenueItemList() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.revenue}` })
  },

  getRevenueExpenseItem() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.revenueExpenseItem}` })
  },

  getRevenueQuantityUnit() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.revenueQuantityUnit}` })
  }
}
