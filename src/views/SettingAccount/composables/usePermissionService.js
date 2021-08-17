/* eslint-disable no-useless-catch */
import Services from '@/services'
const PermissionService = Services.get('PermissionService')

export const getPermissionTemplate = async () => {
  try {
    const res = await PermissionService.getPermissionTemplate()

    return res || []
  } catch (error) {
    throw error
  }
}

export const createPermissionTemplate = async (data) => {
  try {
    const { data: dataRes } = await PermissionService.createPermissionTemplate(data)

    return dataRes
  } catch (error) {
    throw error
  }
}

export const deletePermissionTemplate = async (id) => {
  try {
    await PermissionService.deletePermissionTemplate(id)
  } catch (error) {
    throw error
  }
}
