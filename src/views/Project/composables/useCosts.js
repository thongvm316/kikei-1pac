/* eslint-disable no-useless-catch */
import services from '@/services'
const DirectCostsService = services.get('DirectCostsService')
const MaterialCostsService = services.get('MaterialCostsService')
const OrderCostsService = services.get('OrderCostsService')

// ================== DIRECT COSTS ========================
export const getDirectCostList = async (params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await DirectCostsService.getList(params)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}

// export const createDirectCost = async (data) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const response = await DirectCostsService.create(data)
//     return response?.data || {}
//   } catch (e) {
//     throw e
//   }
// }

// export const updateDirectCost = async (data) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const response = await DirectCostsService.update(data)
//     return response?.data || {}
//   } catch (e) {
//     throw e
//   }
// }

export const upsertDirectCost = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await DirectCostsService.upsert(data)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}

export const deleteDirectCost = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await DirectCostsService.delete(data)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}

// ================== MATERIAL COSTS ========================
export const getMaterialCostList = async (params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await MaterialCostsService.getList(params)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}

// export const createMaterialCost = async (data) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const response = await MaterialCostsService.create(data)
//     return response?.data || {}
//   } catch (e) {
//     throw e
//   }
// }

// export const updateMaterialCost = async (data) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const response = await MaterialCostsService.update(data)
//     return response?.data || {}
//   } catch (e) {
//     throw e
//   }
// }

export const upsertMaterialCost = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await MaterialCostsService.upsert(data)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}

export const deleteMaterialCost = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await MaterialCostsService.delete(data)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}

// ================== ORDER COSTS ========================
export const getOrderCostList = async (params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await OrderCostsService.getList(params)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}

// export const createOrderCost = async (data) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const response = await OrderCostsService.create(data)
//     return response?.data || {}
//   } catch (e) {
//     throw e
//   }
// }

// export const updateOrderCost = async (data) => {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const response = await OrderCostsService.update(data)
//     return response?.data || {}
//   } catch (e) {
//     throw e
//   }
// }

export const upsertOrderCost = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await DirectCostsService.upsert(data)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}

export const deleteOrderCost = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await OrderCostsService.delete(data)
    return response?.data || {}
  } catch (e) {
    throw e
  }
}
