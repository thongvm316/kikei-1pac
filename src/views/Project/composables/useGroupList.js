/* eslint-disable no-useless-catch */
import service from '@/services'
const GroupService = service.get('GroupService')

export const useGroupList = async (params) => {
  try {
    const { data } = await GroupService.getGroups(params)
    return data.result || []
  } catch (e) {
    throw e
  }
}
