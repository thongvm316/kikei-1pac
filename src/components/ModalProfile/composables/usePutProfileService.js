import services from '@/services'
import store from '@/store'
const ProfileService = services.get('ProfileService')

export default function usePutProfileService(data) {
  store.commit('loading/STORE_FLASH_LOADING', true)
  const putProfile = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProfileService.putProfile(data)
      return response.data
      // eslint-disable-next-line no-useless-catch
    } catch (e) {
      throw e
    } finally {
      store.commit('loading/STORE_FLASH_LOADING', false)
    }
  }

  return {
    putProfile
  }
}
