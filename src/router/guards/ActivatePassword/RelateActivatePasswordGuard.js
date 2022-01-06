export const RelateActivatePasswordGuard = async (to, from, next) => {
  if (to.redirectedFrom?.name === 'activate-change-password') {
    next()
  }
  if (from.name === 'activate-change-password') {
    next()
  }
  next('/login')
}
