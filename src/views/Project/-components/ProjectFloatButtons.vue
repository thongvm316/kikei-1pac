<template>
  <div class="box-btn project-buttons-float">
    <a-button size="large" @click="$emit('on-go-to-edit-project')">
      <template #icon>
        <span class="btn-icon">
          <edit-icon />
        </span>
      </template>
      {{ $t('project.float_modal.edit') }}
    </a-button>

    <a-button size="large" @click="$emit('on-copy-project')">
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

    <a-button size="large" @click="$emit('on-confirm-delete')">
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
    enableGoToDeposit: Boolean
  },

  setup() {
    const visible = ref()
    return { visible }
  }
})
</script>

<style lang="scss">
.project-buttons-float {
  button + button {
    margin-left: 16px;
  }
}

.ant-layout .box-btn.project-buttons-float {
  bottom: 32px;
}
</style>
