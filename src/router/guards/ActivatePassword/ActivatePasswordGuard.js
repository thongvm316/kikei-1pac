import jwt_decode from 'jwt-decode'
import useGetTokenActivePasswordService from '@/router/composables/useGetTokenActivatePasswordService'

export const ActivatePasswordGuard = async (to, from, next) => {
  if (to.query?.token) {
    const jwt = jwt_decode(to.query.token)
    const tokenTime = jwt.exp
    const currentTime = new Date().getTime() / 1000

    // still time to live
    if (tokenTime <= currentTime) {
      next('/expired-mail')
    } else {
      const params = {
        token: to.query.token
      }
      try {
        const { getTokenActivePassword } = useGetTokenActivePasswordService({ ...params })
        await getTokenActivePassword()
        next()
      } catch (_) {
        next('/activated-password')
      }
    }
  }
  next('/login')
}
