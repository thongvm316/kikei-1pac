<template>
  <a-form
    ref="projectFormRef"
    class="project-add-form"
    :rules="projectFormRules"
    :model="projectParams"
    layout="vertical"
    @submit="onSubmit"
  >
    <!-- companyID -->
    <a-form-item name="companyId" label="クライアント名" :class="{ 'has-error': localErrors['companyId'] }">
      <div>
        <span v-if="!!companyOwnerData" class="text-grey-55 mr-8">{{ companyOwnerData.name }}</span>
        <p class="modal-link" @click="openCompanySearchForm('owner')">選択</p>
      </div>

      <p v-if="localErrors['companyId']" class="ant-form-explain">
        {{ $t(`common.local_error.${localErrors['companyId']}`) }}
      </p>
    </a-form-item>
    <!-- companyID -->

    <!-- code -->
    <a-form-item name="code" label="プロジェクトコード">
      <a-input v-model:value="projectParams.code" :style="{ width: '300px' }" placeholder="GXX-YYYY-ZZZ" />
      <p class="form-caption">※入力しないとき、自動採番です。</p>

      <p v-if="localErrors['code']" class="ant-form-explain u-text-additional-red-6">
        {{ $t(`common.local_error.${localErrors['code']}`) }}
      </p>
    </a-form-item>
    <!-- code -->

    <!-- name -->
    <a-form-item name="name" label="プロジェクト名" :class="{ 'has-error': localErrors['name'] }">
      <a-input v-model:value="projectParams.name" placeholder="入力してください" :style="{ width: '300px' }" />

      <p v-if="localErrors['name']" class="ant-form-explain">{{ $t(`common.local_error.${localErrors['name']}`) }}</p>
    </a-form-item>
    <!-- name -->

    <!-- clientInCharge -->
    <a-form-item name="clientInCharge" label="顧客担当">
      <a-input
        v-model:value="projectParams.clientInCharge"
        placeholder="入力してください"
        :style="{ width: '300px' }"
      />
    </a-form-item>
    <!-- clientInCharge -->

    <!-- type -->
    <a-form-item name="type" label="区分">
      <a-radio-group v-model:value="projectParams.type" name="projectType" :options="dataTypes" />
    </a-form-item>
    <!-- type -->

    <!-- status -->
    <a-form-item name="statusId" label="ステータス" :class="{ 'has-error': localErrors['statusId'] }">
      <a-select v-model:value="projectParams.statusId" placeholder="選択してください" :style="{ width: '164px' }">
        <a-select-option v-for="status in dataStatuses" :key="status.id" :value="status.id">
          {{ status.name }}
        </a-select-option>
      </a-select>

      <p v-if="localErrors['statusId']" class="ant-form-explain">
        {{ $t(`common.local_error.${localErrors['statusId']}`) }}
      </p>
    </a-form-item>
    <!-- status -->

    <!-- accuracy -->
    <a-form-item name="accuracyId" label="受注確度" :class="{ 'has-error': localErrors['statusId'] }">
      <a-select v-model:value="projectParams.accuracyId" placeholder="選択してください" :style="{ width: '164px' }">
        <a-select-option v-for="accuracy in dataAccuracies" :key="accuracy.id" :value="accuracy.id">
          {{ accuracy.code }} ({{ accuracy.name }})
        </a-select-option>
      </a-select>

      <p v-if="localErrors['accuracyId']" class="ant-form-explain">
        {{ $t(`common.local_error.${localErrors['accuracyId']}`) }}
      </p>
    </a-form-item>
    <!-- accuracy -->

    <!-- release date -->
    <a-form-item name="releaseDate" label="リリース日（予定）">
      <a-date-picker v-model:value="projectParams.releaseDate" format="YYYY/MM/DD" placeholder="YYYY/MM/DD" />
    </a-form-item>
    <!-- release date -->

    <!-- statistics month -->
    <a-form-item
      v-if="projectParams.type === 0"
      name="statisticsMonth"
      label="計上予定月"
      :class="{ 'has-error': localErrors['statisticFromMonth'] }"
    >
      <a-month-picker
        v-model:value="projectParams.statisticsMonth"
        :style="{ width: '164px' }"
        format="YYYY/MM"
        placeholder="YYYY/MM"
      >
        <template #suffixIcon>
          <calendar-outlined />
        </template>
      </a-month-picker>

      <p v-if="localErrors['statisticFromMonth']" class="ant-form-explain">
        {{ $t(`common.local_error.${localErrors['statisticFromMonth']}`) }}
      </p>
    </a-form-item>

    <a-form-item
      v-else
      name="statisticsMonths"
      label="計上予定月"
      :class="{ 'has-error': localErrors['statisticFromMonth'] }"
    >
      <a-range-picker
        v-model:value="projectParams.statisticsMonths"
        :style="{ width: '300px' }"
        format="YYYY/MM"
        :mode="['month', 'month']"
        :placeholder="['YYYY/MM', 'YYYY/MM']"
        @panelChange="handleChangeStatisticsDateValue"
      >
        <template #suffixIcon>
          <calendar-outlined />
        </template>
      </a-range-picker>

      <p v-if="localErrors['statisticFromMonth']" class="u-text-additional-red-6">
        {{ $t(`common.local_error.${localErrors['statisticFromMonth']}`) }}
      </p>
    </a-form-item>
    <!-- statistics month -->

    <!-- groupID -->
    <a-form-item name="groupId" label="請求グループ" :class="{ 'has-error': localErrors['groupId'] }">
      <a-select v-model:value="projectParams.groupId" placeholder="選択してください" :style="{ width: '164px' }">
        <a-select-option
          v-for="group in dataGroups"
          :key="group.id"
          :value="group.id"
          @click="onSelectGroup(group.depositCurrencyCode)"
        >
          {{ group.name }}
        </a-select-option>
      </a-select>
      <p v-if="localErrors['groupId']" class="ant-form-explain">
        {{ $t(`common.local_error.${localErrors['groupId']}`) }}
      </p>
    </a-form-item>
    <!-- groupID -->

    <!-- director -->
    <a-form-item name="director" label="ディレクタ（予定）">
      <a-input v-model:value="projectParams.director" placeholder="入力してください" :style="{ width: '300px' }" />
    </a-form-item>
    <!-- director -->

    <!-- accountID -->
    <a-form-item name="accountId" label="営業担当" :class="{ 'has-error': localErrors['accountId'] }">
      <a-select v-model:value="projectParams.accountId" placeholder="入力してください" :style="{ width: '164px' }">
        <a-select-option v-for="account in dataAccounts" :key="account.id" :value="account.id">
          {{ account.fullname }}
        </a-select-option>
      </a-select>
      <p v-if="localErrors['accountId']" class="ant-form-explain">
        {{ $t(`common.local_error.${localErrors['accountId']}`) }}
      </p>
    </a-form-item>
    <!-- accountID -->

    <div class="moneyWrapper">
      <!-- money -->
      <a-form-item
        name="estimateMoney"
        label="予測金額"
        class="u-relative"
        :class="{ 'has-error': localErrors['estimateMoney'] }"
      >
        <a-input-number
          v-model:value="projectParams.estimateMoney"
          placeholder="入力してください"
          :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :precision="0"
          :style="{ width: '300px' }"
        />
        <span v-if="depositCurrencyCode" class="u-ml-8 u-text-grey-75">{{ `(${depositCurrencyCode})` }}</span>
        <p v-if="localErrors['estimateMoney']" class="ant-form-explain">
          {{ $t(`common.local_error.${localErrors['estimateMoney']}`) }}
        </p>
      </a-form-item>
      <!-- money -->
    </div>

    <!-- tag  -->
    <a-form-item name="tags" label="タグ">
      <a-auto-complete
        v-model:value="valueTag"
        :options="options"
        placeholder="タグを入力してください"
        :style="{ width: '300px', border: 0, zIndex: 1 }"
        @keyup.enter="createTag"
        @search="onSearchTag"
      />

      <div v-if="projectParams.tags.length > 0" class="tags-container">
        <a-tooltip
          v-for="(tag, index) in projectParams.tags"
          :key="index"
          :title="tag"
          overlay-class-name="project-form-tags__tooltip"
        >
          <a-tag closable @close="removeTag($event, index)">
            {{ tag }}
          </a-tag>
        </a-tooltip>
      </div>

      <p class="text-grey-55 u-mt-2">※タグを入力して「Enter」を押してください</p>
    </a-form-item>

    <!-- tag  -->

    <!-- memo -->
    <a-form-item name="memo" label="メモ">
      <a-textarea
        v-model:value="projectParams.memo"
        placeholder="入力してください"
        :style="{ width: '300px', height: '160px' }"
      />
    </a-form-item>
    <!-- memo -->

    <a-form-item>
      <a-button type="default" @click="$router.go(-1)">キャンセル</a-button>
      <a-button type="primary" :loading="loading" :style="{ marginLeft: '8px' }" @click="onSubmit">登録</a-button>
    </a-form-item>
  </a-form>

  <modal-select-company v-model:visible="isCompanySearchFormOpen" @select-company="selectCompanyOnSearchForm" />
</template>

<script>
import { defineComponent, ref, onBeforeMount, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { debounce, find, forEach } from 'lodash-es'

import { PROJECT_TYPES } from '@/enums/project.enum'
import { useAccountList } from '../../composables/useAccountList'
import { useGroupList } from '../../composables/useGroupList'
import { getProjectAccuracies, getProjectStatuses, addProject } from '../../composables/useProject'
import { deepCopy } from '@/helpers/json-parser'
import { fromDateObjectToDateTimeFormat, fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'
import ModalSelectCompany from '@/containers/ModalSelectCompany'

import { CalendarOutlined } from '@ant-design/icons-vue'
import useSuggestSearch from '../../composables/useSuggest'

export default defineComponent({
  name: 'ProjectAddForm',

  components: {
    CalendarOutlined,
    ModalSelectCompany
  },

  props: {
    project: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const projectProp = props.project
    const options = ref([])
    const projectFormRef = ref()
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()

    const projectParams = ref({
      companyId: null,
      name: '',
      code: '',
      clientInCharge: '',
      type: PROJECT_TYPES[0].value,
      statusId: null,
      accuracyId: null,
      releaseDate: null,
      statisticsMonth: null,
      statisticsMonths: [null, null],
      groupId: null,
      accountId: null,
      director: '',
      tags: [],
      memo: '',
      estimateMoney: null
    })
    const localErrors = ref({})
    const loading = ref(false)
    const valueTag = ref()
    const isCompanySearchFormOpen = ref(false)
    const companyTargetSearch = ref('owner') // owner || outsource
    const outsouringCompanyTarget = ref()
    const companyOwnerData = ref({})
    const depositCurrencyCode = ref()

    const dataTypes = ref([])
    const dataAccounts = ref([])
    const dataGroups = ref([])
    const dataStatuses = ref([])
    const dataAccuracies = ref([])

    const handleChangeStatisticsDateValue = (val) => (projectParams.value.statisticsMonths = val)

    // input validator rules
    const projectFormRules = ref({
      companyId: [{ type: 'number', required: true, message: t('project.error_message.company'), trigger: 'change' }],
      name: [{ required: true, message: t('project.error_message.name'), trigger: 'change' }],
      statusId: [{ type: 'number', required: true, message: t('project.error_message.status'), trigger: 'change' }],
      accuracyId: [{ type: 'number', required: true, message: t('project.error_message.accuracy'), trigger: 'change' }],
      groupId: [{ type: 'number', required: true, message: t('project.error_message.group'), trigger: 'change' }],
      accountId: [{ type: 'number', required: true, message: t('project.error_message.account'), trigger: 'change' }],
      estimateMoney: [{ type: 'number', required: true, message: t('project.error_message.money'), trigger: 'change' }]
    })

    const dynamicBaseOnAccuracy = () => {
      if (highestAccuracyRequired.value) {
        projectFormRules.value.memo = [{ required: true, message: t('project.error_message.memo'), trigger: 'change' }]
      } else {
        projectFormRules.value.memo = []
      }
    }

    /* --------------------- handle search company ------------------- */
    const openCompanySearchForm = (target, key = null) => {
      companyTargetSearch.value = target
      isCompanySearchFormOpen.value = true

      if (target === 'outsource') {
        outsouringCompanyTarget.value = key
      }
    }

    const selectCompanyOnSearchForm = (payload) => {
      if (companyTargetSearch.value === 'owner') {
        projectParams.value.companyId = parseInt(payload.id)
        companyOwnerData.value = payload
      }
    }

    /* --------------------- ./handle search company ------------------- */

    /* --------------------- handle project orders --------------------- */
    const highestAccuracyRequired = computed(() => {
      if (!projectParams.value.accuracyId || dataAccuracies.value.length <= 0) return false
      const accuracy = dataAccuracies.value.filter((da) => da.id === projectParams.value.accuracyId)[0]
      if (!accuracy) return false
      // TODO: hard check more
      return accuracy.code === 'S'
    })
    /* --------------------- ./handle project orders --------------------- */

    /* --------------------- ./handle project tags --------------------- */
    const createTag = () => {
      if (!valueTag.value || (valueTag.value && !valueTag.value.trim())) return
      const valueTagLowerCase = valueTag.value.trim().toLowerCase()
      if (projectParams.value.tags.includes(valueTagLowerCase)) return

      projectParams.value.tags.push(valueTagLowerCase)
      valueTag.value = ''
    }

    const removeTag = (e, index) => {
      e.preventDefault()
      projectParams.value.tags.splice(index, 1)
      return false
    }

    const onSearchTag = debounce(async (searchText) => {
      options.value = []
      const { getSuggestTag } = useSuggestSearch({ q: searchText, limit: 10 })
      const { result } = await getSuggestTag()

      forEach(result.data, (value) => {
        options.value.push({ value: value.name })
      })
      if (searchText === '') options.value = []
    }, 500)
    /* --------------------- ./handle project tags --------------------- */

    /* --------------------- /handle check require statistic month --------------------- */
    const checkRequireStatisticMonth = () => {
      const statusId = projectParams.value.statusId
      const accuracyId = projectParams.value.accuracyId

      const statusRequire = ['billed', 'process', 'received']
      const accuracyRequire = ['S']

      const statusObj = find(dataStatuses.value, { id: statusId })
      const accuracyObj = find(dataAccuracies.value, { id: accuracyId })

      if (
        (statusObj && statusRequire.findIndex((item) => item === statusObj.code) !== -1) ||
        (accuracyObj && accuracyRequire.findIndex((item) => item === accuracyObj.code) !== -1)
      ) {
        projectFormRules.value.statisticsMonth = [
          {
            type: 'object',
            required: true,
            message: t('project.error_message.statistics_month'),
            trigger: ['blur', 'change']
          }
        ]
        projectFormRules.value.statisticsMonths = [
          {
            type: 'array',
            required: true,
            message: t('project.error_message.statistics_months'),
            trigger: ['blur', 'change']
          }
        ]
      } else {
        // disable rules
        projectFormRules.value.statisticsMonth = [
          {
            type: 'object',
            required: false,
            trigger: ['blur', 'change']
          }
        ]
        projectFormRules.value.statisticsMonths = [
          {
            type: 'array',
            required: false,
            trigger: ['blur', 'change']
          }
        ]

        projectFormRef.value.validateFields(['statisticsMonth', 'statisticsMonths'])
      }
    }
    /* --------------------- ./handle check require statistic month --------------------- */

    /* -------------------- init data when project props ------------------------- */
    const initProjectPropData = () => {
      if (!projectProp || (projectProp && !projectProp.value)) return
      const { value: projectPropValue } = projectProp
      Object.keys(projectParams.value).forEach((key) => {
        if (projectPropValue[key]) projectParams.value[key] = deepCopy(projectPropValue[key])
      })

      // init company
      projectParams.value.companyId = projectPropValue.adCompany.id
      // init dummy company
      companyOwnerData.value = {
        id: projectPropValue.adCompany.id,
        name: projectPropValue.adCompany.name
      }

      // init date month value
      projectParams.value.releaseDate = fromStringToDateTimeFormatPicker(projectPropValue.releaseDate, 'YYYY/MM/DD')
      projectParams.value.statisticsMonth = fromStringToDateTimeFormatPicker(
        projectPropValue.statisticsFromMonth,
        'YYYY/MM'
      )
      projectParams.value.statisticsMonths = [
        fromStringToDateTimeFormatPicker(projectPropValue.statisticsFromMonth, 'YYYY/MM'),
        fromStringToDateTimeFormatPicker(projectPropValue.statisticsToMonth, 'YYYY/MM')
      ]

      // Force tags ['']
      if (projectParams.value.tags.length === 1 && !projectParams.value.tags[0]) projectParams.value.tags.length = 0
    }
    /* -------------------- ./init data when project props ------------------------- */

    /* ------------------- api intergration --------------------------- */
    const projectDataRequest = computed(() => {
      const { value: projectParamsValue } = projectParams
      let dataRequest = {
        ...projectParamsValue,
        releaseDate: projectParamsValue.releaseDate
          ? fromDateObjectToDateTimeFormat(projectParamsValue.releaseDate)
          : null,
        statisticsFromMonth:
          projectParamsValue.type === 0
            ? fromDateObjectToDateTimeFormat(projectParamsValue.statisticsMonth)
            : fromDateObjectToDateTimeFormat(projectParamsValue.statisticsMonths[0]),
        statisticsToMonth:
          projectParamsValue.type === 0
            ? fromDateObjectToDateTimeFormat(projectParamsValue.statisticsMonth)
            : fromDateObjectToDateTimeFormat(projectParamsValue.statisticsMonths[1])
      }

      dataRequest.statisticsFromMonth = dataRequest.statisticsFromMonth ? dataRequest.statisticsFromMonth : null
      dataRequest.statisticsToMonth = dataRequest.statisticsToMonth ? dataRequest.statisticsToMonth : null

      delete dataRequest.statisticsMonth
      delete dataRequest.statisticsMonths

      return dataRequest
    })

    const onSubmit = async () => {
      try {
        const validateRes = await projectFormRef.value.validate()
        if (validateRes) {
          callAddProject()
        }
      } catch (e) {
        console.log(e)
      }
    }

    const callAddProject = async () => {
      const response = await addProject(projectDataRequest.value)
      if (response.status === 200) {
        const name = projectDataRequest.value?.name || ''

        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          message: t('project.flash_message.create_success', { name })
        })
        router.push({ name: 'project' })
        return
      }
      if (response.data?.errors) {
        localErrors.value = response.data.errors
      }
    }
    /* ------------------- api intergration --------------------------- */

    const onSelectGroup = (currency) => {
      depositCurrencyCode.value = currency
    }

    watch(highestAccuracyRequired, dynamicBaseOnAccuracy)

    // check require statistic month
    watch(
      () => [projectParams.value.statusId, projectParams.value.accuracyId],
      () => {
        checkRequireStatisticMonth()
      }
    )

    onBeforeMount(async () => {
      /* ------------------- get all datas --------------------------- */
      dataAccounts.value = await useAccountList({ types: '0,2', active: true })
      // groups
      const paramsGroup = { allGroup: true }
      const { data: groups } = await useGroupList(paramsGroup)
      dataGroups.value = groups

      dataGroups.value.forEach((group) => {
        if (group.id === props.project.value?.groupId) depositCurrencyCode.value = group.depositCurrencyCode
      })

      // statuses
      const { data: statuses } = await getProjectStatuses()
      dataStatuses.value = statuses
      // accuracies
      const { data: accuracies } = await getProjectAccuracies()
      dataAccuracies.value = accuracies
      // types
      dataTypes.value = PROJECT_TYPES.map((type) => ({
        ...type,
        label: t(`project.${type.label}`)
      }))
      /* ------------------- ./get all datas --------------------------- */

      // init project params
      initProjectPropData()
    })

    return {
      projectFormRef,
      projectParams,
      localErrors,
      projectFormRules,
      dataGroups,
      dataTypes,
      dataStatuses,
      dataAccounts,
      dataAccuracies,
      loading,
      valueTag,
      isCompanySearchFormOpen,
      companyOwnerData,
      depositCurrencyCode,
      options,
      openCompanySearchForm,
      selectCompanyOnSearchForm,
      onSubmit,
      createTag,
      removeTag,
      handleChangeStatisticsDateValue,
      onSelectGroup,
      onSearchTag
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.project-add-form {
  .modal-link {
    color: $color-additional-blue-6;
    margin-bottom: 0;
    display: inline-block;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .outsource {
    p {
      margin-bottom: 0;
    }

    &__item td {
      padding-bottom: 8px;
    }

    &__total {
      width: 340px;
      margin-top: 12px;
      padding-top: 12px;
      margin-bottom: 0;
      color: $color-grey-55;
      border-top: 1px dashed $color-grey-55;
      text-align: right;
    }

    &__company-info {
      @include flexbox(flex-start, center);

      p + p {
        margin-left: 12px;
        cursor: pointer;
      }
    }
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-label > label.ant-form-item-required {
    &:after {
      display: inline-block;
      margin-left: 4px;
      color: $color-additional-red-6;
      font-size: 14px;
      line-height: 1;
      content: '*';
    }
  }

  .ant-form-item-required {
    &:before {
      display: none;
    }
  }

  .tags-container {
    width: 300px;
    padding: 4px 10px 0 12px;
    background-color: $color-grey-100;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;

    .ant-tag {
      background-color: $color-grey-85;
      color: $color-grey-15;
      font-size: 12px;
      line-height: 18px;
      font-weight: normal;
      padding: 2px 28px 2px 7px;
      max-width: calc(100% - 10px);
      text-overflow: ellipsis;
      overflow: hidden;
      position: relative;

      .ant-tag-close-icon {
        position: absolute;
        top: 5px;
        right: 8px;
      }

      svg {
        color: $color-grey-15;
      }
    }
  }

  .form-caption {
    color: $color-grey-75;
    font-size: 12px;
    line-height: 18px;
  }

  .ant-radio-wrapper {
    margin: 0 16px 0 0;
  }

  .ant-form-item-label {
    padding: 0 0 4px;
  }

  .project-form-tags__tooltip {
    .ant-tooltip-inner {
      color: $color-grey-100;
      background-color: $color-grey-35;
    }
  }

  .moneyWrapper {
    display: flex;
    align-items: flex-start;
    gap: 32px;
  }
}
</style>
