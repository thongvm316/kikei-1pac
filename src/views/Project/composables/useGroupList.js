import service from '@/services'
const GroupService = service.get('GroupService')

export const useGroupList = async () => {
  try {
    const { data } = await GroupService.getGroups()
    return data.result || []
  } catch(e) {
    throw e
  }
}
