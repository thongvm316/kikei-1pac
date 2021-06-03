export default {
  set: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  },

  get: (key) => {
    const data = localStorage.getItem(key)
    return JSON.parse(data)
  },

  remove: (key) => {
    localStorage.removeItem(key)
  },

  has: (key) => {
    return !!localStorage.getItem(key)
  }
}
