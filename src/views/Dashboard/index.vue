<template>
  <!-- <template #header>
    <div>Content header dashboard</div>
  </template> -->
  <div>
    <h2>Dashboard Page</h2>

    <label for="locale-select">Change locale:</label>
    <select v-model="locale" id="locale-select">
      <option v-for="locale in localeList" :key="locale.value" :value="locale.value">
        {{ locale.label }}
      </option>
    </select>
  </div>

  <k-button
    variant="primary"
    size="md"
    @click="isOpenModalText = true"
  >
    Open modal
  </k-button>

  <k-modal
    header="Edit user"
    v-model:open="isOpenModalText">
    <template #modal-body>Body content</template>
  </k-modal>

  <k-button variant="primary" size="md" @click="isOpenModalText = true" icon circle>
    <project-icon />
  </k-button>

  <k-input size="lg" nativeType="number" variant="error" placeholder="Please input">
    <project-icon class="form-icon--left" />
  </k-input>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const KButton = defineAsyncComponent(() => import('@/components/KButton'))
const KInput = defineAsyncComponent(() => import('@/components/KInput'))
const KModal = defineAsyncComponent(() => import('@/components/KModal'))
import ProjectIcon from '@/assets/ico_project.svg'

export default defineComponent({
  name: 'Dashboard',

  components: {
    KButton,
    ProjectIcon,
    KInput,
    KModal
  },

  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const localeList = ref([
      {
        value: 'en',
        label: 'English'
      },

      {
        value: 'ja',
        label: 'Japan'
      },

      {
        value: 'vi',
        label: 'Việt Nam'
      }
    ])
    const isOpenModalText = ref(false)

    return {
      locale,
      isOpenModalText,
      localeList
    }
  },

  methods: {
    onClickButton() {
      console.log('test click')
    }
  }
})
</script>
