<template>
  <a-modal v-model:visible="open" :title="$t('modal.title')" class="modal-delete" @cancel="handleCancel">
    <template #footer>
      <template v-if="locale === 'en'">
        <p>{{ $t('modal.message_en') }} {{ nameCompany }}?</p>
      </template>
      <template v-if="locale === 'ja'">
        <p>{{ nameCompany }} {{ $t('modal.message_ja') }}</p>
      </template>
      <a-button key="back" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
      <a-button type="danger" @click="handleDelete">
        {{ $t('modal.delete') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ModalDelete',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    }
  },

  emits: ['update:visible', 'delete'],

  setup(props, context) {
    const { visible } = toRefs(props)
    const { name } = toRefs(props)
    const open = ref(props.visible)
    const nameCompany = ref(props.name)
    const { locale } = useI18n()

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    watch(visible, (val) => {
      open.value = val
    })

    watch(name, (val) => {
      nameCompany.value = val
    })

    const handleDelete = (evt) => {
      context.emit('delete', evt)
    }

    return {
      open,
      nameCompany,
      locale,
      handleCancel,
      handleDelete
    }
  }
})
</script>
