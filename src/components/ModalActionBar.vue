<template>
  <div class="box-btn modal-actions">
    <a-button data-test="goToEditButton" type="default" @click="$emit('on-go-to-edit')">
      <template #icon>
        <span class="btn-icon">
          <edit-icon />
        </span>
      </template>
      {{ $t('project.float_modal.edit') }}
    </a-button>

    <a-button data-test="goToCopyButton" type="default" @click="$emit('on-go-to-copy')">
      <template #icon>
        <span class="btn-icon">
          <copy-icon />
        </span>
      </template>
      {{ $t('project.float_modal.copy') }}
    </a-button>

    <a-button v-if="enableGoToDeposit" data-test="goToDepositButton" type="default" @click="$emit('on-go-to-deposit')">
      <template #icon>
        <span class="btn-icon">
          <to-deposit-icon />
        </span>
      </template>
      {{ $t('project.float_modal.search_deposit') }}
    </a-button>

    <a-button data-test="goToDeleteButton" type="default" :disabled="isDisableDelete" @click="$emit('on-go-to-delete')">
      <template #icon>
        <span class="btn-icon">
          <delete-icon />
        </span>
      </template>
      {{ $t('project.float_modal.delete') }}
    </a-button>

    <a-button type="link" ghost class="modal-actions__close-btn" @click="$emit('on-close-modal')">
      <template #icon>
        <span class="btn-icon">
          <close-icon />
        </span>
      </template>
    </a-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import DeleteIcon from '@/assets/icons/ico_delete.svg'
import EditIcon from '@/assets/icons/ico_edit.svg'
import CopyIcon from '@/assets/icons/ico_copy.svg'
import ToDepositIcon from '@/assets/icons/ico_to_deposit.svg'
import CloseIcon from '@/assets/icons/ico_close.svg'

export default defineComponent({
  name: 'ModalActionBar',

  components: {
    DeleteIcon,
    EditIcon,
    CopyIcon,
    ToDepositIcon,
    CloseIcon
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
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.modal-actions {
  @include flexbox(center, center);

  button + button {
    margin-left: 12px;
  }

  &__close-btn {
    width: 16px;

    &:hover {
      svg {
        color: $color-primary-6;
      }
    }

    svg {
      color: $color-grey-75;
    }
  }
}

.ant-layout .box-btn.modal-actions {
  bottom: 32px;
  padding: 16px 12px 16px 16px;
}
</style>
