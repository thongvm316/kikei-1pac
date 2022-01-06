<template>
  <a-form
    ref="projectFormRef"
    class="project-edit-form"
    :rules="projectFormRules"
    :model="projectParams"
    layout="vertical"
    @submit="onSubmit"
  >
    <a-spin :spinning="isLoadedOverviewTable">
      <table class="table-form">
        <thead>
          <tr>
            <th>プロジェクト概要</th>
            <th>
              <div class="table-form__buttons">
                <div>
                  <a-button v-if="!isEditing" type="default" @click="isEditing = true">
                    <template #icon>
                      <span class="btn-icon">
                        <edit-icon />
                      </span>
                    </template>
                    編集
                  </a-button>
                  <a-button v-if="isEditing" type="default" @click="cancelEditOverViewForm">キャンセル</a-button>
                  <a-button
                    v-if="isEditing"
                    :disabled="isHaveChangeForm"
                    type="primary"
                    :loading="loading"
                    :style="{ marginLeft: '8px' }"
                    @click="onSubmit"
                    >登録</a-button
                  >
                </div>

                <DownOutlined
                  :class="['table-form__arrow-icon', isCollapse && 'isCollapse']"
                  @click="isCollapse = !isCollapse"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="2" style="padding: 0">
              <a-collapse :active-key="isCollapse ? [] : [1]" :bordered="false" class="table-form__collapse">
                <a-collapse-panel key="1">
                  <table class="table-body">
                    <tbody>
                      <!-- companyID -->
                      <tr>
                        <td>クライアント名</td>
                        <td>
                          <a-form-item name="companyId" :class="{ 'has-error': localErrors['companyId'] }">
                            <div>
                              <span
                                v-if="!!companyOwnerData"
                                :class="['u-text-12', isEditing ? 'u-text-grey-55' : 'u-text-grey-15']"
                                >{{ companyOwnerData.name }}</span
                              >
                            </div>

                            <p v-if="localErrors['companyId']" class="ant-form-explain">
                              {{ $t(`common.local_error.${localErrors['companyId']}`) }}
                            </p>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- companyID -->

                      <!-- name -->
                      <tr>
                        <td>プロジェクト名</td>

                        <td>
                          <a-form-item name="name" :class="{ 'has-error': localErrors['name'] }">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{ projectParams.name }}</span>
                            <a-input
                              v-if="isEditing"
                              v-model:value="projectParams.name"
                              placeholder="入力してください"
                              :style="{ width: '300px' }"
                            />

                            <p v-if="localErrors['name']" class="ant-form-explain">
                              {{ $t(`common.local_error.${localErrors['name']}`) }}
                            </p>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- name -->

                      <!-- code -->
                      <tr>
                        <td>プロジェクトコード</td>

                        <td>
                          <a-form-item name="code">
                            <span :class="['u-text-12', isEditing ? 'u-text-grey-55' : 'u-text-grey-15']">{{
                              projectParams.code
                            }}</span>

                            <p v-if="localErrors['code']" class="ant-form-explain u-text-additional-red-6">
                              {{ $t(`common.local_error.${localErrors['code']}`) }}
                            </p>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- code -->

                      <!-- clientInCharge -->
                      <tr>
                        <td>顧客担当</td>

                        <td>
                          <a-form-item name="clientInCharge">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{
                              projectParams.clientInCharge
                            }}</span>
                            <a-input
                              v-if="isEditing"
                              v-model:value="projectParams.clientInCharge"
                              placeholder="入力してください"
                              :style="{ width: '300px' }"
                            />
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- clientInCharge -->

                      <!-- type -->
                      <tr>
                        <td>区分</td>

                        <td>
                          <a-form-item name="type">
                            <span class="u-text-grey-15 u-text-12">{{ $t(`project.type_${projectParams.type}`) }}</span>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- type -->

                      <!-- status -->
                      <tr>
                        <td>ステータス</td>
                        <td>
                          <a-form-item name="statusId" :class="{ 'has-error': localErrors['statusId'] }">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{ statusName?.name }}</span>
                            <a-select
                              v-if="isEditing"
                              v-model:value="projectParams.statusId"
                              placeholder="選択してください"
                              :style="{ width: '300px' }"
                            >
                              <a-select-option v-for="status in dataStatuses" :key="status.id" :value="status.id">
                                {{ status.name }}
                              </a-select-option>
                            </a-select>

                            <p v-if="localErrors['statusId']" class="ant-form-explain">
                              {{ $t(`common.local_error.${localErrors['statusId']}`) }}
                            </p>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- status -->

                      <!-- accuracy -->
                      <tr>
                        <td>受注確度</td>
                        <td>
                          <a-form-item name="accuracyId" :class="{ 'has-error': localErrors['statusId'] }">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12"
                              >{{ accuracyName?.code }} ({{ accuracyName?.name }})</span
                            >
                            <a-select
                              v-if="isEditing"
                              v-model:value="projectParams.accuracyId"
                              placeholder="選択してください"
                              :style="{ width: '300px' }"
                            >
                              <a-select-option
                                v-for="accuracy in dataAccuracies"
                                :key="accuracy.id"
                                :value="accuracy.id"
                              >
                                {{ accuracy.code }} ({{ accuracy.name }})
                              </a-select-option>
                            </a-select>

                            <p v-if="localErrors['accuracyId']" class="ant-form-explain">
                              {{ $t(`common.local_error.${localErrors['accuracyId']}`) }}
                            </p>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- accuracy -->

                      <!-- release date -->
                      <tr>
                        <td>リリース日（予定）</td>

                        <td>
                          <a-form-item name="releaseDate">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{
                              Filter.moment_l(projectParams.releaseDate)
                            }}</span>
                            <a-date-picker
                              v-if="isEditing"
                              v-model:value="projectParams.releaseDate"
                              :style="{ width: '150px' }"
                              format="YYYY/MM/DD"
                              placeholder="YYYY/MM/DD"
                            />
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- release date -->

                      <!-- statistics month -->
                      <tr>
                        <td>計上予定月</td>

                        <td>
                          <a-form-item
                            v-if="projectParams.type === 0"
                            name="statisticsMonth"
                            :class="{ 'has-error': localErrors['statisticFromMonth'] }"
                          >
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{
                              Filter.moment_yyyy_mm(projectParams.statisticsMonth)
                            }}</span>
                            <a-month-picker
                              v-if="isEditing"
                              v-model:value="projectParams.statisticsMonth"
                              :style="{ width: '150px' }"
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
                            :class="{ 'has-error': localErrors['statisticFromMonth'] }"
                          >
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{
                              `${Filter.moment_yyyy_mm(projectParams.statisticsMonths[0])} -
                ${Filter.moment_yyyy_mm(projectParams.statisticsMonths[1])}`
                            }}</span>
                            <a-range-picker
                              v-if="isEditing"
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
                        </td>
                      </tr>
                      <!-- statistics month -->

                      <!-- groupID -->
                      <tr>
                        <td>請求グループ</td>

                        <td>
                          <a-form-item name="groupId" :class="{ 'has-error': localErrors['groupId'] }">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{ groupName?.name }}</span>
                            <a-select
                              v-if="isEditing"
                              v-model:value="projectParams.groupId"
                              placeholder="選択してください"
                              :style="{ width: '300px' }"
                            >
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
                        </td>
                      </tr>
                      <!-- groupID -->

                      <!-- director -->
                      <tr>
                        <td>ディレクタ（予定）</td>

                        <td>
                          <a-form-item name="director">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{ projectParams.director }}</span>
                            <a-input
                              v-if="isEditing"
                              v-model:value="projectParams.director"
                              placeholder="入力してください"
                              :style="{ width: '300px' }"
                            />
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- director -->

                      <!-- accountID -->
                      <tr>
                        <td>営業担当</td>
                        <td>
                          <a-form-item name="accountId" :class="{ 'has-error': localErrors['accountId'] }">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{ accountName?.fullname }}</span>
                            <a-select
                              v-if="isEditing"
                              v-model:value="projectParams.accountId"
                              placeholder="入力してください"
                              :style="{ width: '300px' }"
                            >
                              <a-select-option v-for="account in dataAccounts" :key="account.id" :value="account.id">
                                {{ account.fullname }}
                              </a-select-option>
                            </a-select>
                            <p v-if="localErrors['accountId']" class="ant-form-explain">
                              {{ $t(`common.local_error.${localErrors['accountId']}`) }}
                            </p>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- accountID -->

                      <!-- tag  -->
                      <tr>
                        <td>タグ</td>

                        <td>
                          <a-form-item name="tags">
                            <a-auto-complete
                              v-if="isEditing"
                              v-model:value="valueTag"
                              :options="tagOptions"
                              placeholder="タグを入力してください"
                              :style="{ width: '300px' }"
                              @keyup.enter="createTag"
                              @search="onSearchTag"
                            />

                            <p v-if="isEditing" class="text-grey-55 u-mt-2 mb-0">
                              ※タグを入力して「Enter」を押してください
                            </p>

                            <div
                              v-if="projectParams.tags.length > 0"
                              :class="['tags-container', isEditing && 'isEditing']"
                            >
                              <a-tooltip
                                v-for="(tag, index) in projectParams.tags"
                                :key="index"
                                :title="tag"
                                overlay-class-name="project-form-tags__tooltip"
                              >
                                <a-tag :closable="isEditing" @close="removeTag($event, index)">
                                  {{ tag }}
                                </a-tag>
                              </a-tooltip>
                            </div>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- tag  -->

                      <!-- memo -->
                      <tr>
                        <td>メモ</td>

                        <td>
                          <a-form-item name="memo">
                            <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{ projectParams.memo }}</span>
                            <a-textarea
                              v-if="isEditing"
                              v-model:value="projectParams.memo"
                              placeholder="入力してください"
                              :style="{ width: '355px' }"
                            />
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- memo -->
                    </tbody>
                  </table>
                </a-collapse-panel>
              </a-collapse>
            </td>
          </tr>
        </tbody>
      </table>
    </a-spin>
  </a-form>

  <modal-select-company v-model:visible="isCompanySearchFormOpen" @select-company="selectCompanyOnSearchForm" />
  <confirm-submit-modal v-model:visible="isVisibleModalConfirmSubmit" @on-confirm="handleConfirmSubmitModal" />
</template>

<script>
import { defineComponent, ref, onBeforeMount, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { cloneDeep, debounce, find, forEach, isEqual } from 'lodash-es'
import { PROJECT_TYPES } from '@/enums/project.enum'
import { editProject } from '../../composables/useProject'
import { deepCopy } from '@/helpers/json-parser'
import { fromDateObjectToDateTimeFormat, fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'
import ModalSelectCompany from '@/containers/ModalSelectCompany'
import Filter from '@/filters'
import { CalendarOutlined } from '@ant-design/icons-vue'
import EditIcon from '@/assets/icons/ico_edit.svg'
import { DownOutlined } from '@ant-design/icons-vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import ConfirmSubmitModal from './ConfirmSubmitModal.vue'
import useSuggestSearch from '../../composables/useSuggest'

export default defineComponent({
  name: 'ProjectEditForm',

  components: {
    CalendarOutlined,
    ModalSelectCompany,
    EditIcon,
    DownOutlined,
    ConfirmSubmitModal
  },

  props: {
    project: {
      type: Object,
      required: true
    },
    isLoadedOverviewTable: {
      type: Boolean,
      default: false
    },
    projectRef: Object,
    dataAccounts: Array,
    dataStatuses: Array,
    dataAccuracies: Array,
    dataGroups: Array
  },

  emits: ['on-submit-edit-project-form', 'update:is-loaded-overview-table'],

  setup(props, { emit }) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const projectProp = props.project
    const projectFormRef = ref()
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()
    const isEditing = ref()
    const isCollapse = ref()
    const routerNameToGo = ref()
    const answer = ref()
    const depositCurrencyCode = ref()
    const isVisibleModalConfirmSubmit = ref()
    const tagOptions = ref([])
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
      memo: ''
    })
    const localErrors = ref({})
    const loading = ref(false)
    const valueTag = ref()
    const isCompanySearchFormOpen = ref(false)
    const companyTargetSearch = ref('owner') // owner || outsource
    const outsouringCompanyTarget = ref()
    const companyOwnerData = ref({})
    const dataTypes = ref([])
    const dataAccounts = computed(() => props.dataAccounts)
    const dataGroups = computed(() => props.dataGroups)
    const dataStatuses = computed(() => props.dataStatuses)
    const dataAccuracies = computed(() => props.dataAccuracies)
    const statusName = computed(() => find(dataStatuses.value, { id: projectParams.value.statusId }))
    const accuracyName = computed(() => find(dataAccuracies.value, { id: projectParams.value.accuracyId }))
    const groupName = computed(() => find(dataGroups.value, { id: projectParams.value.groupId }))
    const accountName = computed(() => find(dataAccounts.value, { id: projectParams.value.accountId }))
    const isHaveChangeForm = computed(() => isEqual(projectParams.value, projectParamsToCompare.value))
    const projectParamsToCompare = ref()

    const onSelectGroup = (currency) => {
      depositCurrencyCode.value = currency
    }

    onBeforeRouteLeave((to) => {
      // cancel the navigation and stay on the same page
      if (!isHaveChangeForm.value && !answer.value) {
        routerNameToGo.value = to.name
        isVisibleModalConfirmSubmit.value = true
        return false
      }
    })

    const handleConfirmSubmitModal = () => {
      isVisibleModalConfirmSubmit.value = false
      answer.value = true

      router.push({ name: routerNameToGo.value })
    }

    watch(
      () => props.projectRef,
      () => {
        initProjectPropData()
      }
    )

    const handleChangeStatisticsDateValue = (val) => {
      projectParams.value.statisticsMonths = val
    }

    // input validator rules
    const projectFormRules = ref({
      companyId: [{ type: 'number', required: true, message: t('project.error_message.company'), trigger: 'change' }],
      name: [{ required: true, message: t('project.error_message.name'), trigger: 'change' }],
      statusId: [{ type: 'number', required: true, message: t('project.error_message.status'), trigger: 'change' }],
      accuracyId: [{ type: 'number', required: true, message: t('project.error_message.accuracy'), trigger: 'change' }],
      groupId: [{ type: 'number', required: true, message: t('project.error_message.group'), trigger: 'change' }],
      accountId: [{ type: 'number', required: true, message: t('project.error_message.account'), trigger: 'change' }]
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
      tagOptions.value = []
      const { getSuggestTag } = useSuggestSearch({ q: searchText, limit: 10 })
      const { result } = await getSuggestTag()

      forEach(result.data, (value) => {
        tagOptions.value.push({ value: value.name })
      })
      if (searchText === '') tagOptions.value = []
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

        projectFormRef.value && projectFormRef.value.validateFields(['statisticsMonth', 'statisticsMonths'])
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

      projectParamsToCompare.value = cloneDeep(projectParams.value)

      emit('update:is-loaded-overview-table', false)
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
          if (isHaveChangeForm.value) return
          callEditProject()
        }
      } catch (e) {
        console.log(e)
      }
    }

    const callEditProject = async () => {
      loading.value = true
      const response = await editProject(projectProp.value.id, projectDataRequest.value)
      if (response.status === 200) {
        const name = projectDataRequest.value.name

        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          message: t('project.flash_message.update_success', { name })
        })

        emit('on-submit-edit-project-form')
        isEditing.value = false
        loading.value = false

        return
      }
      if (response.data?.errors) {
        localErrors.value = response.data.errors
        loading.value = false
      }
    }
    /* ------------------- api intergration --------------------------- */
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

      // types
      dataTypes.value = PROJECT_TYPES.map((type) => ({
        ...type,
        label: t(`project.${type.label}`)
      }))

      depositCurrencyCode.value = props.project.value?.currencyCode
      /* ------------------- ./get all datas --------------------------- */

      // init project params
      initProjectPropData()
    })

    const cancelEditOverViewForm = () => {
      isEditing.value = false
      initProjectPropData()
    }

    function handleBeforeReload(event) {
      if (isHaveChangeForm.value) return

      event.preventDefault()
      event.returnValue = ''
    }

    onMounted(() => {
      window.addEventListener('beforeunload', handleBeforeReload)
    })

    onUnmounted(() => {
      window.removeEventListener('beforeunload', handleBeforeReload)
    })

    return {
      projectFormRef,
      projectParams,
      localErrors,
      projectFormRules,
      isHaveChangeForm,
      dataTypes,
      loading,
      valueTag,
      isCompanySearchFormOpen,
      companyOwnerData,
      isEditing,
      statusName,
      accuracyName,
      groupName,
      accountName,
      isCollapse,
      isVisibleModalConfirmSubmit,
      depositCurrencyCode,
      tagOptions,

      openCompanySearchForm,
      selectCompanyOnSearchForm,
      onSelectGroup,
      onSubmit,
      createTag,
      removeTag,
      handleChangeStatisticsDateValue,
      cancelEditOverViewForm,
      Filter,
      handleConfirmSubmitModal,
      onSearchTag
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.project-edit-form {
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
    margin-bottom: 0;
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
    background-color: $color-grey-100;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;

    &.isEditing {
      margin-top: 8px;
    }

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
    margin-bottom: 0;
  }

  .ant-radio-wrapper {
    margin: 0 16px 0 0;
  }

  .ant-form-item-label {
    padding: 0 0 4px;
  }

  .table-form {
    color: $color-grey-15;
    border: 1px solid $color-grey-75;
    width: 100%;
    border-bottom: 0;

    thead {
      background-color: $color-grey-92;
      color: $color-grey-15;
      font-weight: 700;
      font-size: 16px;

      th:first-child {
        padding-left: 32px;
        width: 30%;
        white-space: nowrap;
        min-width: 169px;
      }

      th {
        border-bottom: 1px solid $color-grey-75;
        padding: 12px;
      }
    }

    table.table-body {
      width: 100%;
      background-color: $color-grey-100;

      td {
        padding: 13px;
        border-bottom: 1px solid $color-grey-75;

        &:first-child {
          font-size: 12px;
          border-right: 1px solid $color-grey-75;
          color: $color-primary-9;
          font-weight: 700;
          width: 60px;
          background-color: $color-grey-94;
          padding-left: 32px;
          white-space: nowrap;
          width: 30%;
          min-width: 169px;
        }
      }

      .project-oder {
        td {
          border: 0;
          width: auto;
          background-color: transparent;
          min-width: auto;
          color: $color-grey-15;
          font-weight: 400;

          &:first-child {
            padding-left: 0;
          }
        }
      }
    }

    &__collapse {
      .ant-collapse-header {
        display: none;
      }

      .ant-collapse-content-box {
        padding: 0 !important;
      }

      .ant-collapse-item {
        border-bottom: 0;
      }
    }

    &__buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;
    }

    &__arrow-icon {
      color: $color-grey-55;
      transition: transform 0.2s;

      &.isCollapse {
        transform: rotate(-180deg);
        transition: transform 0.2s;
      }
    }

    &__text {
      color: red;
    }
  }

  .project-form-tags__tooltip {
    .ant-tooltip-inner {
      color: $color-grey-100;
      background-color: $color-grey-35;
    }
  }
}
</style>
