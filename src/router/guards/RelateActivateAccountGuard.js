export const RelateActivateAccountGuard = async (to, from, next) => {
  if (to.redirectedFrom?.name === 'activate-account') {
    next()
  }
  if (from.name === 'activate-account') {
    next()
  }
  next('/login')
}
