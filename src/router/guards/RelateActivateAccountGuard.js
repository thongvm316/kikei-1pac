export const RelateActivateAccountGuard = async (to, from, next) => {
  if (to?.redirectedFrom?.name === 'activate-account') {
    next()
  }
  next({ name: 'login' })
}
