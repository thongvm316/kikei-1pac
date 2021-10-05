<template>
  <a-modal v-model:visible="visible" class="noticeRoleUserModal" centered title="" width="485px" :closable="false">
    <template #footer>
      <p>更新された機能はご使用できるように、ユーザーにログアウトして再ログインするのをお知らせください。</p>
      <a-button type="primary" @click="handleCancel">了解</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NoticeRoleUserModal',

  emits: ['update:visible'],

  setup(_, { emit }) {
    const visible = ref()

    const handleCancel = () => {
      emit('update:visible', false)
    }

    return {
      visible,
      handleCancel
    }
  }
})
</script>

<style lang="scss">
.noticeRoleUserModal {
  .ant-modal-footer {
    padding: 16px 62px;
  }
}
</style>
