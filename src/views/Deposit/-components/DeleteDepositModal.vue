<template>
  <a-modal
    v-model:visible="visible"
    title="削除"
    width="380px">
    <template #footer>
      <p>プロジェクト名 を削除してもよろしですか？</p>
      <a-button>キャンセル</a-button>
      <a-button type="danger">削除</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'
// import DeleteIcon from '@/assets/icons/ico_delete.svg'
// import EditIcon from '@/assets/icons/ico_edit.svg'
// import CopyIcon from '@/assets/icons/ico_copy.svg'

export default defineComponent({
  name: 'DeleteDepositModal',

  components: {
    // DeleteIcon,
    // EditIcon,
    // CopyIcon
  },

  setup() {
    const visible = ref(true)

    return {
      visible
    }
  }
})
</script>
