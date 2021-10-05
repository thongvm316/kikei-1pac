<template>
  <a-modal v-model:visible="visible" class="noticeRoleUserModal" centered width="485px" :closable="false">
    <template #footer>
      <p>更新された機能はご使用できるように、ユーザーにログアウトして再ログインするのをお知らせください。</p>
      <a-button :loading="loading" type="primary" @click="handleSubmit">了解</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NoticeRoleUserModal',

  emits: ['on-submit-notice-modal'],

  setup(_, { emit }) {
    const visible = ref()
    const loading = ref()

    const handleSubmit = () => {
      loading.value = true
      emit('on-submit-notice-modal')
    }

    return {
      visible,
      loading,
      handleSubmit
    }
  }
})
</script>

<style lang="scss">
.noticeRoleUserModal .ant-modal-footer {
  padding: 16px 62px;
}
</style>
