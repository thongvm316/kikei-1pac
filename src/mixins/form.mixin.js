export default {
  methods: {
    onSuccess (mess, des) {
      this.$notification.success({
        message: mess,
        description: des
      })
    },

    onError (mess, des) {
      this.$notification.error({
        message: mess,
        description: des
      })
    }
  }
}
