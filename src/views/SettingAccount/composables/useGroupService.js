/* eslint-disable no-useless-catch */
import services from '@/services'
const GroupService = services.get('GroupService')

export const getGroups = async () => {
  try {
    const { data = {} } = await GroupService.getGroups()

    return data
  } catch (e) {
    throw e
  }
}
