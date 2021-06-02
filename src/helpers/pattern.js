const PASSWORD_COMPLETEX_REGEX = new RegExp('(?=.*[A-Z])(?=.*[!@#$&*()^])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{4}')

export function passwordComplexity(password) {
  return PASSWORD_COMPLETEX_REGEX.test(password)
}
