/* eslint-disable no-useless-catch */
import service from '@/services'

const RevenueService = service.get('RevenueService')

export const getRevenueItemList = async () => {
  try {
    const { data } = await RevenueService.getRevenueItemList()

    return data
  } catch (error) {
    throw error
  }
}

export const getRevenueExpenseItem = async () => {
  try {
    const { data } = await RevenueService.getRevenueExpenseItem()

    return data
  } catch (error) {
    throw error
  }
}

export const getRevenueQuantityUnit = async () => {
  try {
    const { data } = await RevenueService.getRevenueQuantityUnit()

    return data
  } catch (error) {
    throw error
  }
}
