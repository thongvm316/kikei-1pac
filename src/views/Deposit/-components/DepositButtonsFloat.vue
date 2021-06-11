<template>
  <a-modal v-model:visible="visible" :closable="false" width="350px" class="deposit-buttons-float">
    <template #footer>
      <a-button @click="$emit('on-edit-record-deposit')">
        <template #icon>
          <span class="btn-icon">
            <edit-icon />
          </span>
        </template>
        クリア
      </a-button>
      <a-button @click="$emit('on-copy-record-deposit')">
        <template #icon>
          <span class="btn-icon">
            <copy-icon />
          </span>
        </template>
        クリア
      </a-button>
      <a-button :disabled="disableButton" @click="$emit('on-open-delete-deposit-modal')">
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

export default defineComponent({
  name: 'DepositButtonsFloat',

  components: {
    DeleteIcon,
    EditIcon,
    CopyIcon
  },

  props: {
    disableButton: Boolean
  },

  setup() {
    const visible = ref()

    return {
      visible
    }
  }
})
</script>

<style lang="scss">
.deposit-buttons-float {
  .ant-modal-footer {
    display: flex;
    justify-content: space-between;
  }

  &.ant-modal {
    top: calc(100vh - 92px);
    width: fit-content !important;
  }

  button + button {
    margin-left: 16px;
  }
}
</style>
