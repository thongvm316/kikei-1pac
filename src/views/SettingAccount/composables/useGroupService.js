/* eslint-disable no-useless-catch */
import services from '@/services'
const GroupService = services.get('GroupService')

export const getGroups = async (params) => {
  try {
    const { data = {} } = await GroupService.getGroups(params)

    return data
  } catch (e) {
    throw e
  }
}
