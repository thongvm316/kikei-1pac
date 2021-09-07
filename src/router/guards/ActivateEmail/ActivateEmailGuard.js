import jwt_decode from 'jwt-decode'
import useGetTokenActiveEmailService from '@/router/composables/useGetTokenActiveEmailService'

export const ActivateEmailGuard = async (to, from, next) => {
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
        const { getTokenActiveEmail } = useGetTokenActiveEmailService({ ...params })
        await getTokenActiveEmail()
        next()
      } catch (_) {
        next('/activated-email')
      }
    }
  }
  next('/login')
}
