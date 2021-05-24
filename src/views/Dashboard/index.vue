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
    size="lg"
    v-model:open="isOpenModalText">
    <template #modal-body>
      <p>Body content</p>
      <p>Body content</p>
      <p>Body content</p>
      <p>Body content</p>

      <p>End</p>
    </template>

  </k-modal>

  <k-button variant="primary" size="md" @click="isOpenModalText = true" icon circle>
    <project-icon />
  </k-button>

  <k-input
    style="margin-top: 24px"
    v-model:value="inputModel"
    size="lg"
    native-type="text"
    icon-position="left"
    placeholder="Please input"
    label="プロジェクト名">
    <template #icon>
      <project-icon />
    </template>
  </k-input>

  <k-input
    style="margin-top: 24px"
    v-model:value="inputModel"
    size="lg"
    native-type="text"
    icon-position="right"
    placeholder="Please input">
    <template #icon>
      <project-icon />
    </template>
  </k-input>

  <k-accordion duration="400">
    <template #header>
      <div>Open accordion</div>
    </template>
    <ul>
      <li>Accordion content</li>
      <li>Accordion content</li>
      <li>Accordion content</li>
      <li>Accordion content</li>
      <li>Accordion content</li>
      <li>Accordion content</li>
    </ul>
  </k-accordion>
   <k-input
    style="margin-top: 24px"
    v-model:value="inputModel"
    size="lg"
    native-type="text"
    placeholder="Please input"
    label="プロジェクト名"
    variant="error"
    error="Error message">
  </k-input>

  <br />
  <br />

  <k-checkbox
    v-model:value="checkboxModel"
    :options="checkboxOptions"
    inline
    name="label-1"
    label="Label (checkbox)" />

  <k-radio
    v-model:value="radioModel"
    :options="radioOptions"
    inline
    name="radio-1"
    label="Label (checkbox)" />

  <k-pagination
    v-model:value="page"
    :page-range="3"
    :total-item="42"
    :per-page="10"
    :click-handler="clickPagerHandler" />
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const KButton = defineAsyncComponent(() => import('@/components/KButton'))
const KInput = defineAsyncComponent(() => import('@/components/KInput'))
const KCheckbox = defineAsyncComponent(() => import('@/components/KCheckbox'))
const KRadio = defineAsyncComponent(() => import('@/components/KRadio'))
const KModal = defineAsyncComponent(() => import('@/components/KModal'))
const KAccordion = defineAsyncComponent(() => import('@/components/KAccordion'))
const KPagination = defineAsyncComponent(() => import('@/components/KPagination'))
import ProjectIcon from '@/assets/icons/ico_project.svg'

export default defineComponent({
  name: 'Dashboard',

  data() {
    return {
      inputModel: '',
      inputModel: '',
      inputModel: '',
      checkboxModel: ['出金'],
      checkboxOptions: [
        {
          label: '入金',
          value: '入金',
        },
        {
          label: '出金',
          value: '出金',
        },
        {
          label: 'Text',
          value: 'Text'
        }
      ],
      radioModel: 2,
      radioOptions: [
        {
          label: '入金',
          value: 1,
        },
        {
          label: '出金',
          value: 2,
        },
        {
          label: 'Text',
          value: 'Text'
        }
      ],
      page: 1
    }
  },

  components: {
    KButton,
    KInput,
    KCheckbox,
    KRadio,
    KModal,
    KAccordion,
    KPagination,
    ProjectIcon
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
    },

    clickPagerHandler() {
      console.log('pager click')
    }
  }
})
</script>
