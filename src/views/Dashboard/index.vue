<template>
  <!-- <template #header>
    <div>Content header dashboard</div>
  </template> -->
  <div>
    <h2>Dashboard Page</h2>

    <label for="locale-select">Change locale:</label>
    <select id="locale-select" v-model="locale">
      <option v-for="locale in localeList" :key="locale.value" :value="locale.value">
        {{ locale.label }}
      </option>
    </select>
  </div>

  <k-button variant="primary" size="md" @click="isOpenModalText = true"> Open modal </k-button>

  <k-modal v-model:open="isOpenModalText" header="Edit user" size="lg">
    <template #modal-body>
      <p>Body content</p>
      <p>Body content</p>
      <p>Body content</p>
      <p>Body content</p>

      <p>End</p>
    </template>
  </k-modal>

  <k-button variant="primary" size="md" icon circle @click="isOpenModalText = true">
    <project-icon />
  </k-button>

  <k-input
    v-model:value="inputModel"
    style="margin-top: 24px"
    size="lg"
    native-type="text"
    icon-position="left"
    placeholder="Please input"
    label="プロジェクト名"
  >
    <template #icon>
      <project-icon />
    </template>
  </k-input>

  <k-input
    v-model:value="inputModel"
    style="margin-top: 24px"
    size="lg"
    native-type="text"
    icon-position="right"
    placeholder="Please input"
  >
    <template #icon>
      <project-icon />
    </template>
  </k-input>

  <k-accordion :duration="400">
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
    v-model:value="inputModel"
    style="margin-top: 24px"
    size="lg"
    native-type="text"
    placeholder="Please input"
    label="プロジェクト名"
    variant="error"
    error="Error message"
  >
  </k-input>

  <br />
  <br />

  <k-checkbox v-model:value="checkboxModel" :options="checkboxOptions" inline name="label-1" label="Label (checkbox)" />

  <k-radio v-model:value="radioModel" :options="radioOptions" inline name="radio-1" label="Label (checkbox)" />

  <k-pagination
    v-model:value="page"
    :page-range="3"
    :total-item="92"
    :per-page="10"
    :click-handler="clickPagerHandler"
  />

  <div class="u-mt-16" style="width: 300px">
    <!-- <k-multiselect
      v-model="selectModel"
      searchable
      :options="selectOptions"
      label="name"
      trackBy="name"
      placeholder="...." /> -->
  </div>

  <div class="u-mt-16" style="width: 300px">
    <k-multiselect
      v-model="selectModel"
      searchable
      mode="multiple"
      :options="selectOptions"
      label="name"
      track-by="name"
      placeholder="...."
    >
      <template #option="{ option }">
        <div class="k-select-option--checkbox">{{ option.name }}</div>
      </template>
    </k-multiselect>
  </div>
  <k-button v-tooltip.tooltip="'Tooltip content'" variant="primary">Tooltip test</k-button>
  <k-tooltip title="Tooltip content">
    <k-button variant="danger">Tooltip test</k-button>
  </k-tooltip>

  <k-datetime-picker v-model:value="timeToday" mode="date" label="Datetime picker day:" />
  <k-datetime-picker v-model:value="timeToday" mode="month" label="Datetime picker month:" />
  <k-datetime-picker v-model:value="timeRange" mode="date" is-range label="Datetime picker range - day:" />
  <k-datetime-picker v-model:value="timeRange" mode="month" is-range label="Datetime picker range - month:" />
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import KMultiselect from '@vueform/multiselect'

const KButton = defineAsyncComponent(() => import('@/components/KButton'))
const KInput = defineAsyncComponent(() => import('@/components/KInput'))
const KCheckbox = defineAsyncComponent(() => import('@/components/KCheckbox'))
const KRadio = defineAsyncComponent(() => import('@/components/KRadio'))
const KModal = defineAsyncComponent(() => import('@/components/KModal'))
const KAccordion = defineAsyncComponent(() => import('@/components/KAccordion'))
const KPagination = defineAsyncComponent(() => import('@/components/KPagination'))
const KTooltip = defineAsyncComponent(() => import('@/components/KTooltip'))
const KDatetimePicker = defineAsyncComponent(() => import('@/components/KDatetimePicker'))
import ProjectIcon from '@/assets/icons/ico_project.svg'

export default defineComponent({
  name: 'Dashboard',

  components: {
    KButton,
    KInput,
    KCheckbox,
    KRadio,
    KModal,
    KAccordion,
    KPagination,
    KTooltip,
    ProjectIcon,
    KMultiselect,
    KDatetimePicker
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

    const selectOptions = ref([
      { value: 'batman', name: 'Batman' },
      { value: 'a', name: 'Amen' },
      { value: 'b', name: 'Alibaba' },
      { value: 'c', name: 'Hoho' },
      { value: 'd', name: 'Hihihihih' },
      { value: 'e', name: 'Emanan' }
    ])

    return {
      locale,
      isOpenModalText,
      localeList,
      selectOptions
    }
  },

  data() {
    return {
      inputModel: '',
      selectModel: ['batman'],
      checkboxModel: ['出金'],
      checkboxOptions: [
        {
          label: '入金',
          value: '入金'
        },
        {
          label: '出金',
          value: '出金'
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
          value: 1
        },
        {
          label: '出金',
          value: 2
        },
        {
          label: 'Text',
          value: 'Text'
        }
      ],
      page: 1,
      timeToday: new Date(),
      timeRange: {
        start: new Date(2021, 1, 2),
        end: new Date(2021, 3, 16)
      }
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
