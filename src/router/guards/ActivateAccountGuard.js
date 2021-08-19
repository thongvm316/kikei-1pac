import jwt_decode from 'jwt-decode'

export const ActivateAccountGuard = async (to, from, next) => {
  if (to.query?.token) {
    const jwt = jwt_decode(to.query.token)
    const tokenTime = jwt.exp
    const currentTime = new Date().getTime() / 1000
    // still time to live
    if (tokenTime <= currentTime) {
      next({ name: 'error-expired' })
    } else {
      next()
    }
  }
  next({ name: 'login' })
}
