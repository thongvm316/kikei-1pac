/* eslint-disable no-useless-catch */
import Services from '@/services'
const Permission = Services.get('Permission')

export const getPermissionTemplate = async () => {
  try {
    const res = await Permission.getPermissionTemplate()

    return res || []
  } catch (error) {
    throw error
  }
}

export const createPermissionTemplate = async (data) => {
  try {
    const { data: dataRes } = await Permission.createPermissionTemplate(data)

    return dataRes
  } catch (error) {
    throw error
  }
}

export const deletePermissionTemplate = async (id) => {
  try {
    await Permission.deletePermissionTemplate(id)
  } catch (error) {
    throw error
  }
}
