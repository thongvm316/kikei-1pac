export const RelateActiveDeactiveGuard = async (to, from, next) => {
  if (to.redirectedFrom?.name === 'update-activate-account') {
    next()
  }
  if (from.name === 'update-activate-account') {
    next()
  }
  next('/login')
}
