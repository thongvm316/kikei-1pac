import jwt_decode from 'jwt-decode'
import useGetTokenActiveService from '@/router/composables/useGetTokenActiveService'
import store from '@/store'

export const ActivateAccountGuard = async (to, from, next) => {
  if (to.query?.token) {
    const jwt = jwt_decode(to.query.token)
    const tokenTime = jwt.exp
    const currentTime = new Date().getTime() / 1000

    // save store
    store.commit('token/STORE_JWT_TOKEN', jwt)

    // still time to live
    if (tokenTime <= currentTime) {
      next('/error-expired')
    } else {
      const params = {
        token: to.query.token
      }
      try {
        const { getTokenActive } = useGetTokenActiveService({ ...params })
        await getTokenActive()
        next()
      } catch (_) {
        next('/error-verified')
      }
    }
  }
  next('/login')
}
