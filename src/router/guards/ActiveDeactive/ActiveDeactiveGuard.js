import jwt_decode from 'jwt-decode'
import useGetTokenActiveService from '@/router/composables/useGetTokenActiveService'

export const ActiveDeactiveGuard = async (to, from, next) => {
  if (to.query?.token) {
    const jwt = jwt_decode(to.query.token)
    const tokenTime = jwt.exp
    const currentTime = new Date().getTime() / 1000

    // still time to live
    if (tokenTime <= currentTime) {
      next('/expired-mail-edit')
    } else {
      const params = {
        token: to.query.token
      }
      try {
        const { getTokenActive } = useGetTokenActiveService({ ...params })
        await getTokenActive()
        next()
      } catch (err) {
        err.response.data.errors.account === 'has been disabled'
          ? next('/disabled-email')
          : next('/activated-email-edit-account')
      }
    }
  }
  next('/login')
}
