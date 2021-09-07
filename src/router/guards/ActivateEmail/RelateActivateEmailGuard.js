export const RelateActivateEmailGuard = async (to, from, next) => {
  if (to.redirectedFrom?.name === 'activate-email') {
    next()
  }
  if (from.name === 'activate-email') {
    next()
  }
  next('/login')
}
