<template>
  <a-modal v-model:visible="visible" class="noticeRoleUserModal" centered width="485px" :closable="false">
    <template #footer>
      <p>更新された機能はご使用できるように、ユーザーにログアウトして再ログインするのをお知らせください。</p>
      <a-button type="primary" @click="$emit('update:visible', false)">了解</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NoticeRoleUserModal',

  emits: ['update:visible'],

  setup() {
    const visible = ref()

    return {
      visible
    }
  }
})
</script>

<style lang="scss">
.noticeRoleUserModal .ant-modal-footer {
  padding: 16px 62px;
}
</style>
