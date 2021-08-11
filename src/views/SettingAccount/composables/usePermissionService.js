import Services from '@/services'
const Permission = Services.get('Permission')

export const usePermission = async () => {
  try {
    const res = await Permission.getPermissionTemplate()

    return res || []
  } catch (error) {
    throw error
  }
}
