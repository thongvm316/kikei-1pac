import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  account: '/account'
})

export default {
  changePassAccount(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.account}/changepassword/`, data })
  }
}
