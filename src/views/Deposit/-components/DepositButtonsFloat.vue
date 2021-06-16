<template>
  <div class="box-btn deposit-buttons-float">
    <a-button @click="$emit('on-edit-record-deposit')">
      <template #icon>
        <span class="btn-icon">
          <edit-icon />
        </span>
      </template>
      編集
    </a-button>
    <a-button @click="$emit('on-copy-record-deposit')">
      <template #icon>
        <span class="btn-icon">
          <copy-icon />
        </span>
      </template>
      複製
    </a-button>
    <a-button :disabled="isDisableDelete" @click="$emit('on-open-delete-deposit-modal')">
      <template #icon>
        <span class="btn-icon">
          <delete-icon />
        </span>
      </template>
      削除
    </a-button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import DeleteIcon from '@/assets/icons/ico_delete.svg'
import EditIcon from '@/assets/icons/ico_edit.svg'
import CopyIcon from '@/assets/icons/ico_copy.svg'

export default defineComponent({
  name: 'DepositButtonsFloat',

  components: {
    DeleteIcon,
    EditIcon,
    CopyIcon
  },

  props: {
    isDisableDelete: Boolean
  }
})
</script>

<style lang="scss">
.deposit-buttons-float {
  button + button {
    margin-left: 16px;
  }
}
</style>
