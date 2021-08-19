export const RelateActivateAccountGuard = async (to, from, next) => {
  if (from.name === 'activate-account') {
    next()
  }
  next('/login')
}
