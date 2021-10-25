<template>
  <a-form
    ref="projectFormRef"
    class="project-add-form"
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

                      <!-- money -->
                      <tr>
                        <td>金額</td>

                        <td>
                          <div class="moneyWrapper u-whitespace-nowrap">
                            <!-- money -->
                            <a-form-item name="money" class="u-relative" :class="{ 'has-error': localErrors['money'] }">
                              <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{ projectParams.money }}</span>
                              <a-input-number
                                v-if="isEditing"
                                v-model:value="projectParams.money"
                                placeholder="入力してください"
                                :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :precision="0"
                                :style="{ width: '300px' }"
                              />
                              <span v-if="depositCurrencyCode" class="u-ml-8">{{ `(${depositCurrencyCode})` }}</span>
                              <p v-if="localErrors['money']" class="ant-form-explain">
                                {{ $t(`common.local_error.${localErrors['money']}`) }}
                              </p>
                            </a-form-item>

                            <!-- tax -->
                            <div class="u-flex u-items-center">
                              <span class="u-mr-8">税金:</span>
                              <a-form-item name="tax">
                                <span v-if="!isEditing" class="u-text-grey-15 u-text-12">{{ projectParams.tax }}</span>
                                <a-input-number
                                  v-if="isEditing"
                                  v-model:value="projectParams.tax"
                                  :precision="0"
                                  :style="{ width: '68px' }"
                                  :min="0"
                                  :max="100"
                                />

                                <span class="u-ml-8">%</span>
                              </a-form-item>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <!-- money -->

                      <!-- projectOrders -->
                      <tr>
                        <td>外注</td>
                        <td>
                          <a-form-item name="adProjectOrders">
                            <div class="outsource">
                              <table class="project-oder">
                                <tbody>
                                  <template v-for="(order, index) in localProjectOrders" :key="order.key">
                                    <tr class="outsource__item">
                                      <td
                                        style="white-space: pre-wrap"
                                        :class="[
                                          {
                                            'has-error': order.errors && order.errors['companyId'],
                                            'u-flex u-flex-col': isEditing
                                          }
                                        ]"
                                      >
                                        <p>会社名</p>
                                        <div class="outsource__company-info">
                                          <p v-if="order.companyId" class="text-grey-500">{{ order.companyName }}</p>
                                          <p
                                            v-if="isEditing"
                                            class="modal-link"
                                            @click="openCompanySearchForm('outsource', index)"
                                          >
                                            選択
                                          </p>
                                        </div>
                                      </td>

                                      <td :class="['u-pl-40', { 'has-error': order.errors && order.errors['money'] }]">
                                        <p>金額</p>
                                        <p v-if="!isEditing">{{ order.money }}</p>
                                        <a-input-number
                                          v-else
                                          v-model:value="order.money"
                                          placeholder="入力してください"
                                          :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                          :precision="0"
                                          :style="{ width: '164px' }"
                                        />
                                      </td>

                                      <td class="u-pl-8">
                                        <p class="u-mt-24 u-text-grey-75">(JPY)</p>
                                      </td>

                                      <td v-if="!order.id" class="u-pl-8">
                                        <a-button
                                          size="small"
                                          class="u-mt-24"
                                          type="danger"
                                          ghost
                                          @click="removeProjectOrder(order)"
                                          >削除</a-button
                                        >
                                      </td>
                                    </tr>

                                    <tr
                                      v-if="
                                        isEditing &&
                                        ((order.errors && order.errors['companyId']) ||
                                          (order.errors && order.errors['money']))
                                      "
                                    >
                                      <td class="u-pb-12">
                                        <p class="u-text-additional-red-6">
                                          {{ order.errors && $t(`common.local_error.${order.errors['companyId']}`) }}
                                        </p>
                                      </td>
                                      <td class="u-pl-40 u-pb-12">
                                        <p class="u-text-additional-red-6">
                                          {{ order.errors && $t(`common.local_error.${order.errors['money']}`) }}
                                        </p>
                                      </td>
                                      <td></td>
                                    </tr>
                                  </template>
                                </tbody>
                              </table>

                              <a-button
                                v-if="isEditing"
                                type="default"
                                class="outsource__btn"
                                @click="addDummyProjectOrder"
                              >
                                <template #icon>
                                  <span class="btn-icon"><line-add-icon /></span>
                                </template>
                                外注を追加
                              </a-button>

                              <p class="outsource__total">
                                外注費合計: {{ $filters.number_with_commas(totalMoneyOutsourcing) }} (JPY)
                              </p>
                            </div>
                          </a-form-item>
                        </td>
                      </tr>
                      <!-- projectOrders -->

                      <!-- tag  -->
                      <tr>
                        <td>タグ</td>

                        <td>
                          <a-form-item name="tags">
                            <a-input
                              v-if="isEditing"
                              v-model:value="valueTag"
                              placeholder="タグを入力してください"
                              :style="{ width: '300px' }"
                              @pressEnter="createTag"
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

    <!-- projectOrders -->

    <!-- projectOrders -->
  </a-form>

  <modal-select-company v-model:visible="isCompanySearchFormOpen" @select-company="selectCompanyOnSearchForm" />
</template>

<script>
import { defineComponent, ref, onBeforeMount, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { cloneDeep, find, isEqual } from 'lodash-es'

import { PROJECT_TYPES } from '@/enums/project.enum'
import { useAccountList } from '../../composables/useAccountList'
import { useGroupList } from '../../composables/useGroupList'
import { getProjectAccuracies, getProjectStatuses, editProject } from '../../composables/useProject'
import {
  initProjectOutsouringOrders,
  toProjectOutsouringOrdersRequestData,
  addProjectOrder
} from '../../composables/useProjectOrders'
import { deepCopy } from '@/helpers/json-parser'
import { fromDateObjectToDateTimeFormat, fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'
import ModalSelectCompany from '@/containers/ModalSelectCompany'
import Filter from '@/filters'

import { CalendarOutlined } from '@ant-design/icons-vue'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import EditIcon from '@/assets/icons/ico_edit.svg'
// import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
import { DownOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'ProjectEditForm',

  components: {
    CalendarOutlined,
    ModalSelectCompany,
    LineAddIcon,
    EditIcon,
    DownOutlined
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

    revenueEstimateMoneyRequest: {
      type: Object,
      default: undefined
    },

    projectRef: Object
  },

  emits: ['on-submit-edit-project-form', 'update:is-loaded-overview-table'],

  setup(props, { emit }) {
    // eslint-disable-next-line vue/no-setup-props-destructure
    const projectProp = props.project
    const projectFormRef = ref()
    const store = useStore()
    const { t } = useI18n()

    const isEditing = ref()
    const isCollapse = ref()

    watch(
      () => props.revenueEstimateMoneyRequest,
      async (val) => {
        const paramRequest = cloneDeep(projectDataRequest.value)
        paramRequest.estimate = val.revenueEstimateMoney
        paramRequest.estimateCurrencyId = val.estimateCurrencyId

        await editProject(projectProp.value.id, paramRequest)

        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          message: 'Submit success'
        })
      }
    )

    watch(
      () => props.projectRef,
      () => {
        initProjectPropData()
      }
    )

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
      money: null,
      tags: [],
      memo: '',
      adProjectOrders: [],
      tax: null
    })
    const localErrors = ref({})
    const loading = ref(false)
    const valueTag = ref()
    const isCompanySearchFormOpen = ref(false)
    const companyTargetSearch = ref('owner') // owner || outsource
    const outsouringCompanyTarget = ref()
    const companyOwnerData = ref({})
    const localProjectOrders = ref([])
    const depositCurrencyCode = ref()

    const dataTypes = ref([])
    const dataAccounts = ref([])
    const dataGroups = ref([])
    const dataStatuses = ref([])
    const dataAccuracies = ref([])

    const statusName = computed(() => find(dataStatuses.value, { id: projectParams.value.statusId }))
    const accuracyName = computed(() => find(dataAccuracies.value, { id: projectParams.value.accuracyId }))
    const groupName = computed(() => find(dataGroups.value, { id: projectParams.value.groupId }))
    const accountName = computed(() => find(dataAccounts.value, { id: projectParams.value.accountId }))

    const handleChangeStatisticsDateValue = (val) => {
      projectParams.value.statisticsMonths = val
    }

    const isHaveChangeForm = computed(() => isEqual(projectParams.value, projectParamsToCompare.value))

    // input validator rules
    const projectFormRules = ref({
      companyId: [{ type: 'number', required: true, message: t('project.error_message.company'), trigger: 'change' }],
      name: [{ required: true, message: t('project.error_message.name'), trigger: 'change' }],
      statusId: [{ type: 'number', required: true, message: t('project.error_message.status'), trigger: 'change' }],
      accuracyId: [{ type: 'number', required: true, message: t('project.error_message.accuracy'), trigger: 'change' }],
      groupId: [{ type: 'number', required: true, message: t('project.error_message.group'), trigger: 'change' }],
      accountId: [{ type: 'number', required: true, message: t('project.error_message.account'), trigger: 'change' }],
      money: [{ type: 'number', required: true, message: t('project.error_message.money'), trigger: 'change' }]
    })

    const dynamicBaseOnAccuracy = () => {
      if (highestAccuracyRequired.value) {
        projectFormRules.value.memo = [{ required: true, message: t('project.error_message.memo'), trigger: 'change' }]
      } else {
        projectFormRules.value.memo = []
      }
    }

    /* --------------------- handle search company ------------------- */
    const removeProjectOrder = (order) => {
      const index = localProjectOrders.value.findIndex((data) => data.key === order.key)
      if (index < 0) return

      localProjectOrders.value.splice(index, 1)
    }

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
      } else {
        const order = localProjectOrders.value[outsouringCompanyTarget.value]
        if (!order) return

        order.companyId = payload.id
        order.companyName = payload.name
      }
    }

    /* --------------------- ./handle search company ------------------- */

    /* --------------------- handle project orders --------------------- */
    const addDummyProjectOrder = () => {
      addProjectOrder(localProjectOrders)
    }

    const totalMoneyOutsourcing = computed(() => {
      if (localProjectOrders.value.length <= 0) return 0
      return localProjectOrders.value.reduce((acc, curr) => acc + curr.money, 0)
    })

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
    const projectParamsToCompare = ref()
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

      // init dummy project orders
      if (projectParams.value.adProjectOrders) {
        localProjectOrders.value = []
        initProjectOutsouringOrders(projectParams.value.adProjectOrders, localProjectOrders)
      }

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
            : fromDateObjectToDateTimeFormat(projectParamsValue.statisticsMonths[1]),
        adProjectOrders: toProjectOutsouringOrdersRequestData(localProjectOrders)
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

    const addProjectOrdersErrors = () => {
      localProjectOrders.value.forEach((item, index) => {
        item.errors = localErrors.value.adProjectOrders[index] || {}
      })
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

        if (localErrors.value.adProjectOrders) {
          addProjectOrdersErrors()
          loading.value = false
        }
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
      dataGroups,
      dataTypes,
      dataStatuses,
      dataAccounts,
      dataAccuracies,
      loading,
      valueTag,
      isCompanySearchFormOpen,
      companyOwnerData,
      localProjectOrders,
      totalMoneyOutsourcing,
      depositCurrencyCode,
      isEditing,
      statusName,
      accuracyName,
      groupName,
      accountName,
      isCollapse,
      openCompanySearchForm,
      addDummyProjectOrder,
      removeProjectOrder,
      selectCompanyOnSearchForm,
      onSubmit,
      createTag,
      removeTag,
      handleChangeStatisticsDateValue,
      onSelectGroup,
      cancelEditOverViewForm,
      Filter
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
</style>
