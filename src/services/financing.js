import apiCaller from '@/services/api-caller'

const RESOURCES = Object.freeze({
  financing: '/financing'
})

export default {
  getLists(params = {}, data) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.financing}/search`,
      params,
      data
    })
  }
}
