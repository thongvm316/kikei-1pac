<template>
  <a-modal
    v-model:visible="visible"
    :closable="false"
    width="470px"
    class="deposit-buttons-float">
    <template #footer>
      <a-button @click="$emit('on-go-to-edit-project')" size="large">
        <template #icon>
          <span class="btn-icon">
            <edit-icon />
          </span>
        </template>
        編集
      </a-button>

      <a-button @click="$emit('on-copy-project')" size="large">
        <template #icon>
          <span class="btn-icon">
            <copy-icon />
          </span>
        </template>
        複製
      </a-button>

      <a-button size="large" @click="$emit('on-go-to-deposit')">
        <template #icon>
          <span class="btn-icon">
            <to-deposit-icon />
          </span>
        </template>
        入出金明細
      </a-button>

      <a-button size="large" @click="$emit('on-confirm-delete')">
        <template #icon>
          <span class="btn-icon">
            <delete-icon />
          </span>
        </template>
        削除
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'
import DeleteIcon from '@/assets/icons/ico_delete.svg'
import EditIcon from '@/assets/icons/ico_edit.svg'
import CopyIcon from '@/assets/icons/ico_copy.svg'
import ToDepositIcon from '@/assets/icons/ico_to_deposit.svg'

export default defineComponent({
  name: 'ProjectFloatButtons',

  setup() {
    const visible = ref()
    return { visible }
  },

  components: {
    DeleteIcon,
    EditIcon,
    CopyIcon,
    ToDepositIcon
  }
})
</script>

<style lang="scss">
.deposit-buttons-float {
  :deep(.ant-modal-footer) {
    display: flex;
    justify-content: space-between;
  }

  &.ant-modal {
    top: calc(100vh - 80px);
  }

  button + button {
    margin-left: 16px;
  }
}
</style>
