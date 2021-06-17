<template>
  <div class="box-btn modal-actions">
    <a-button size="large" @click="$emit('on-go-to-edit')">
      <template #icon>
        <span class="btn-icon">
          <edit-icon />
        </span>
      </template>
      {{ $t('project.float_modal.edit') }}
    </a-button>

    <a-button size="large" @click="$emit('on-go-to-copy')">
      <template #icon>
        <span class="btn-icon">
          <copy-icon />
        </span>
      </template>
      {{ $t('project.float_modal.copy') }}
    </a-button>

    <a-button v-if="enableGoToDeposit" size="large" @click="$emit('on-go-to-deposit')">
      <template #icon>
        <span class="btn-icon">
          <to-deposit-icon />
        </span>
      </template>
      {{ $t('project.float_modal.search_deposit') }}
    </a-button>

    <a-button :disabled="isDisableDelete" size="large" @click="$emit('on-go-to-delete')">
      <template #icon>
        <span class="btn-icon">
          <delete-icon />
        </span>
      </template>
      {{ $t('project.float_modal.delete') }}
    </a-button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import DeleteIcon from '@/assets/icons/ico_delete.svg'
import EditIcon from '@/assets/icons/ico_edit.svg'
import CopyIcon from '@/assets/icons/ico_copy.svg'
import ToDepositIcon from '@/assets/icons/ico_to_deposit.svg'

export default defineComponent({
  name: 'ProjectFloatButtons',

  components: {
    DeleteIcon,
    EditIcon,
    CopyIcon,
    ToDepositIcon
  },

  props: {
    enableGoToDeposit: {
      type: Boolean,
      default: false
    },

    isDisableDelete: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const visible = ref()
    return { visible }
  }
})
</script>

<style lang="scss">
.modal-actions {
  button + button {
    margin-left: 16px;
  }
}

.ant-layout .box-btn.modal-actions {
  bottom: 32px;
}
</style>
