<template>
  <a-modal
    v-model:visible="visible"
    centered
    class="directly-person-cost"
    width="85%"
    title="直接労務費"
    @cancel="handleCancel"
  >
    <template #footer>
      <div class="directly-person-cost__wrapper">
        <div class="u-relative">
          <a-tooltip color="fff" :title="checkAll ? '全て解除' : '全てを選択'">
            <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange" />
          </a-tooltip>

          <div v-if="checkedList?.length > 0" class="directly-person-cost__delete-btn">
            <a-tooltip color="fff" title="削除">
              <a-button type="primary" shape="circle" @click="handleDeleteCostItem">
                <template #icon>
                  <span class="btn-icon"><DeleteWhiteIcon /></span>
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </div>

        <div class="u-mt-16">
          <a-tabs :active-key="activeKey" :animated="false" @tabClick="tabClick">
            <a-tab-pane v-for="tab in PROJECT_COST_TYPES" :key="tab.key" :tab="tab.text">
              <div
                :class="['directly-person-cost__filter', { 'u-py-16': project.value.type === PROJECT_TYPES[0].value }]"
              >
                <div>
                  <!-- filter month -->
                  <a-month-picker
                    v-if="project.value.type === PROJECT_TYPES[1].value"
                    v-model:value="filterMonth"
                    :style="{ width: '122px' }"
                    :disabled-date="disabledDate"
                    class="u-my-12"
                    format="YYYY/MM"
                    placeholder="YYYY/MM"
                    :allow-clear="false"
                    @change="handleFilterMonth"
                  >
                    <template #suffixIcon>
                      <calendar-outlined />
                    </template>
                  </a-month-picker>
                </div>

                <!-- filter curency -->
                <a-space :size="32">
                  <a-button
                    v-if="activeKey === PROJECT_COST_TYPES[1].key"
                    :disabled="costStateToClone.length < 1"
                    class="cost-tabs-clone"
                    @click="handleCloneCostState"
                  >
                    <template #icon>
                      <span class="btn-icon"><copy-icon /></span>
                    </template>
                    予測の内容をコピー
                  </a-button>
                  <a-space>
                    <span>通貨</span>
                    <a-select
                      v-model:value="selectedCurrency"
                      show-arrow
                      option-label-prop="label"
                      class="u-ml-8"
                      :style="{ width: '80px' }"
                      :default-active-first-option="false"
                    >
                      <a-select-option
                        v-for="currency in currencyList"
                        :key="currency.id"
                        :value="currency.id"
                        :label="currency.code"
                      >
                        {{ currency.code }}
                      </a-select-option>
                    </a-select>
                  </a-space>
                </a-space>
              </div>

              <!-- table -->
              <a-spin :spinning="isLoadingDataTable">
                <table class="directly-person-cost__table">
                  <!-- head -->
                  <thead>
                    <tr>
                      <th style="min-width: 200px">役職</th>
                      <th style="min-width: 200px; width: 100%">氏名</th>
                      <th v-if="authProfile?.isAdmin" style="min-width: 232px">月給</th>
                      <th style="min-width: 234px">所定労働時間</th>
                      <th style="min-width: 234px">時間外労働時間（*1.25）</th>
                      <th style="min-width: 234px">時間外労働時間（*1.5）</th>
                      <th style="min-width: 250px">手当等</th>
                      <th v-if="authProfile?.isAdmin" style="min-width: 130px">小計</th>
                    </tr>
                  </thead>

                  <tbody>
                    <template v-if="costState.length > 0">
                      <tr v-for="cost in costState" :key="cost.id" :class="[cost.checked && 'isCheckedRow']">
                        <!-- position -->
                        <td>
                          <a-space>
                            <a-checkbox v-model:checked="cost.checked" />

                            <a-select
                              v-model:value="cost.positionId"
                              style="width: 150px"
                              :default-active-first-option="false"
                            >
                              <a-select-option v-for="position in positionList" :key="position.id">{{
                                position?.name
                              }}</a-select-option>
                            </a-select>
                          </a-space>
                        </td>

                        <!-- name -->
                        <td><a-input v-model:value="cost.name" placeholder="氏名 氏名" /></td>

                        <!-- month salary -->
                        <td v-if="authProfile?.isAdmin">
                          <a-space>
                            <a-input-number
                              v-model:value="cost.monthlySalary"
                              style="width: 130px"
                              placeholder="0"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />
                            <a-select
                              v-model:value="cost.salaryCurrencyId"
                              show-arrow
                              option-label-prop="label"
                              :style="{ width: '80px' }"
                              :default-active-first-option="false"
                            >
                              <a-select-option
                                v-for="currency in currencyList"
                                :key="currency.id"
                                :value="currency.id"
                                :label="currency.code"
                              >
                                {{ currency.code }}
                              </a-select-option>
                            </a-select>
                          </a-space>
                        </td>

                        <!-- working hour -->
                        <td>
                          <a-space>
                            <!-- day -->
                            <a-input-number
                              v-model:value="cost.workingDays"
                              placeholder="0"
                              style="width: 80px"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />
                            <span>日</span>
                            <!-- hour -->
                            <a-input-number
                              v-model:value="cost.workingHours"
                              placeholder="0"
                              style="width: 80px"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />
                            <span>時間</span>
                          </a-space>
                        </td>

                        <!-- over time 1.25 -->
                        <td>
                          <a-space>
                            <a-input-number
                              v-model:value="cost.overtimeDaysFirst"
                              placeholder="0"
                              style="width: 80px"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />
                            <span>日</span>
                            <a-input-number
                              v-model:value="cost.overtimeHoursFirst"
                              placeholder="0"
                              style="width: 80px"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />
                            <span>時間</span>
                          </a-space>
                        </td>

                        <!-- over time 1.5 -->
                        <td>
                          <a-space>
                            <a-input-number
                              v-model:value="cost.overtimeDaysSecond"
                              placeholder="0"
                              style="width: 80px"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />
                            <span>日</span>
                            <a-input-number
                              v-model:value="cost.overtimeHoursSecond"
                              placeholder="0"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />
                            <span>時間</span>
                          </a-space>
                        </td>

                        <!-- allowance -->
                        <td>
                          <a-space>
                            <a-input-number
                              v-model:value="cost.allowance"
                              placeholder="0"
                              style="width: 130px"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />
                            <a-select
                              v-model:value="cost.allowanceCurrencyId"
                              show-arrow
                              option-label-prop="label"
                              :style="{ width: '80px' }"
                              :default-active-first-option="false"
                            >
                              <a-select-option
                                v-for="currency in currencyList"
                                :key="currency.id"
                                :value="currency.id"
                                :label="currency.code"
                              >
                                {{ currency.code }}
                              </a-select-option>
                            </a-select>
                          </a-space>
                        </td>

                        <!-- count -->
                        <td v-if="authProfile?.isAdmin">
                          {{ $filters.number_with_commas(countSubTotal(cost)) }}
                        </td>
                      </tr>
                    </template>

                    <tr v-else>
                      <td colspan="8">該当データなし</td>
                    </tr>
                  </tbody>
                </table>
              </a-spin>

              <!-- Button add more row -->
              <a-button size="small" class="u-mt-24" @click="handleAddCostItem">
                <template #icon>
                  <span class="btn-icon"><line-add-icon /></span>
                </template>
                見積項目を追加
              </a-button>

              <!-- total money -->
              <div class="directly-person-cost__count">
                <span>合計: {{ $filters.number_with_commas(salaryTotal) }} ({{ selectedCurrencyCode }})</span>
              </div>

              <!-- modal action buttons -->
              <div class="directly-person-cost__submit-buttons">
                <a-button @click="handleCancel">キャンセル</a-button>
                <a-button
                  :disabled="isHaveNoChangeCostState"
                  :loading="isLoaddingSubmitButton"
                  type="primary"
                  class="u-ml-8"
                  @click="submit"
                  >登録</a-button
                >
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </template>
    <ConfirmSubmitModal
      v-model:visible="isVisibleModalConfirmSubmit"
      @on-cancel="hanleCancelConfirmSubmitModal"
      @on-confirm="handleConfirmSubmitModal"
    />
    <ConfirmCloneModal v-model:visible="isVisibleModalConfirmClone" @on-confirm="handleConfirmCloneModal" />
  </a-modal>
</template>

<script>
import { watch, defineComponent, onBeforeMount, reactive, ref, toRefs, computed, onMounted, onUnmounted } from 'vue'
import moment from 'moment'
import { CalendarOutlined } from '@ant-design/icons-vue'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import {
  getLaborDirectCostList,
  getPositionList,
  upsertLaborDirectCostList,
  deleteLaborDirectCostList
} from '../../composables/useProject'
import { useRoute } from 'vue-router'
import { PROJECT_COST_TYPES } from '@/enums/project.enum'
import { cloneDeep, find, uniqueId, isEqual } from 'lodash-es'
import DeleteWhiteIcon from '@/assets/icons/ico_delete_white.svg'
import CopyIcon from '@/assets/icons/ico_copy.svg'
import { PROJECT_TYPES } from '@/enums/project.enum'
import ConfirmSubmitModal from './ConfirmSubmitModal.vue'
import ConfirmCloneModal from './ConfirmCloneModal.vue'
import { useStore } from 'vuex'
import { fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'

export default defineComponent({
  name: 'DirectlyPersionCost',

  components: {
    CalendarOutlined,
    LineAddIcon,
    DeleteWhiteIcon,
    CopyIcon,
    ConfirmSubmitModal,
    ConfirmCloneModal
  },

  props: {
    project: {
      type: Object,
      required: true
    },
    currencyList: Array,
    currencyExchange: Object
  },

  emits: ['update:visible', 'on-submit', 'on-submit-direct-person-cost-modal'],

  setup(props, { emit }) {
    const disabledDate = (current) => {
      return (
        (current && current < moment(props.project.value.statisticsFromMonth).startOf('month')) ||
        (current && current > moment(props.project.value.statisticsToMonth).endOf('month'))
      )
    }
    const visible = ref()
    const activeKey = ref('1')
    const currencyList = computed(() => props.currencyList)
    const route = useRoute()
    const projectId = Number(route.params?.id)
    const positionList = ref([])
    const filterMonth = ref(
      moment(new Date()).endOf('month') > moment(props.project?.value?.statisticsToMonth).endOf('month') ||
        moment(new Date()).endOf('month') < moment(props.project?.value?.statisticsFromMonth).endOf('month')
        ? moment(props.project?.value?.statisticsFromMonth)
        : fromStringToDateTimeFormatPicker(moment(new Date()).format('YYYY-MM'))
    )

    const store = useStore()
    const authProfile = computed(() => store.state?.auth.authProfile)

    const currencyExchange = computed(() => props.currencyExchange)
    const costState = ref([])

    const isLoadingDataTable = ref()

    const isLoaddingSubmitButton = ref()

    const UNIQUE_ID_PREFIX = '__cost__'

    const state = reactive({
      indeterminate: false,
      checkAll: false
    })

    const costDeleteList = ref([])

    const checkedList = computed(() => costState.value.filter((item) => item.checked).map((item) => item.id))

    const salaryTotal = computed(() => {
      let total = 0
      costState.value.forEach((item) => {
        total += countSubTotal(item)
      })

      return authProfile.value?.isAdmin ? total : totalSalaryCountForUser.value
    })

    const selectedCurrency = ref()

    const lowerCaseFirstLetter = (str) => {
      if (str) {
        let newStr = ''

        for (let i = 0; i < str.length; i++) {
          if (i === 0) {
            newStr += str[i].toLowerCase()
          } else {
            newStr += str[i]
          }
        }

        return newStr
      }
    }

    const converExchangeIdToCode = (id) => {
      if (id) {
        const o = find(currencyList.value, { id })
        const newStr = lowerCaseFirstLetter(o?.code)
        return newStr
      }
    }

    const selectedCurrencyCode = computed(() => {
      const currency = find(currencyList.value, { id: selectedCurrency.value })

      return currency?.code
    })

    const countSubTotal = (item) => {
      const {
        allowance,
        workingDays,
        workingHours,
        overtimeDaysFirst,
        overtimeHoursFirst,
        overtimeDaysSecond,
        overtimeHoursSecond,
        monthlySalary,
        salaryCurrencyId,
        allowanceCurrencyId
      } = item

      const salaryPerHour = monthlySalary / (20 * 8)
      const normalWorkingHours = workingDays * 8 + workingHours
      const overTimeFirstHours = (overtimeDaysFirst * 8 + overtimeHoursFirst) * (125 / 100)
      const overTimeSecondHours = (overtimeDaysSecond * 8 + overtimeHoursSecond) * 1.5

      const salary = (normalWorkingHours + overTimeFirstHours + overTimeSecondHours) * salaryPerHour

      const salaryExchange = converExchangeIdToCode(salaryCurrencyId)
      const selectedExchange = converExchangeIdToCode(selectedCurrency.value)
      const allowanceExchange = converExchangeIdToCode(allowanceCurrencyId)

      return authProfile.value?.isAdmin
        ? salary * currencyExchange.value[salaryExchange][selectedExchange] +
            allowance * currencyExchange.value[allowanceExchange][selectedExchange]
        : 0
    }

    const onCheckAllChange = (e) => {
      Object.assign(state, {
        indeterminate: false
      })

      if (e.target.checked) {
        costState.value.forEach((item) => (item.checked = true))
      } else {
        costState.value.forEach((item) => (item.checked = false))
      }
    }

    watch(
      () => checkedList.value,
      (val) => {
        state.indeterminate = !!val.length && val.length > 0 && val.length < costState.value.length
        state.checkAll = !!val.length && val.length === costState.value.length
      }
    )

    const handleCancel = () => {
      if (isHaveNoChangeCostState.value) {
        emit('update:visible', false)
      } else {
        isVisibleModalConfirmSubmit.value = true
        purposeConfirm.value = 'close-modal'
      }
    }

    const submit = async () => {
      if (isHaveNoChangeCostState.value) return
      isLoaddingSubmitButton.value = true

      let dataRequest = cloneDeep(costState.value)

      dataRequest.forEach((item) => {
        item.month =
          props.project.value?.type === PROJECT_TYPES[1].value ? moment(filterMonth.value).format('YYYY-MM-DD') : null
        delete item.checked
        delete item.subtotal
        if (item.id && item.id.toString().indexOf(UNIQUE_ID_PREFIX) === 0) delete item.id
        if (!authProfile.value?.isAdmin) {
          delete item.monthlySalary
          delete item.salaryCurrencyId
        }
      })

      dataRequest = dataRequest.filter(
        (item) =>
          item.allowance ||
          item.monthlySalary ||
          item.name ||
          item.overtimeDaysFirst ||
          item.overtimeDaysSecond ||
          item.overtimeHoursFirst ||
          item.overtimeHoursSecond ||
          item.positionId ||
          item.workingDays ||
          item.workingHours
      )

      try {
        await upsertLaborDirectCostList({ projectLaborDirectCost: dataRequest })
        if (costDeleteList.value.length > 0) {
          await deleteLaborDirectCostList({ id: costDeleteList.value })
          costDeleteList.value = []
        }

        await fetDataTable(activeKey.value, filterMonth.value)

        costStateToCompare.value = cloneDeep(costState.value)
        costStateToClone.value = cloneDeep(costState.value)
        emit('on-submit-direct-person-cost-modal')
      } finally {
        isLoaddingSubmitButton.value = false
      }
    }

    const handleAddCostItem = () => {
      costState.value = [
        ...costState.value,
        {
          id: uniqueId(UNIQUE_ID_PREFIX),
          projectCostsType: Number(activeKey.value),
          allowance: null,
          allowanceCurrencyId: selectedCurrency.value,
          name: null,
          overtimeDaysFirst: null,
          overtimeDaysSecond: null,
          overtimeHoursFirst: null,
          overtimeHoursSecond: null,
          positionId: null,
          projectId,
          workingDays: null,
          workingHours: null,
          monthlySalary: null,
          salaryCurrencyId: selectedCurrency.value
        }
      ]
    }

    const costStateToClone = ref([])
    const costStateToCompare = ref()
    const isHaveNoChangeCostState = computed(() => isEqual(costStateToCompare.value, costState.value))
    const totalSalaryCountForUser = ref()

    const fetDataTable = async (type = activeKey.value, month = filterMonth.value) => {
      isLoadingDataTable.value = true

      try {
        const { data } = await getLaborDirectCostList({
          projectId,
          projectCostsType: type,
          month: props.project.value?.type === PROJECT_TYPES[1].value ? moment(month).format('YYYY-MM') : null
        })

        totalSalaryCountForUser.value = data?.total || 0
        selectedCurrency.value = data?.adProjectLaborDirectCosts[0]?.defaultCurrencyId || 2 // default JPY

        costState.value = cloneDeep(data?.adProjectLaborDirectCosts) || []
        costState.value = costState.value.map((cost) => ({
          ...cost,
          checked: false
        }))

        // create default items
        if (costState.value.length < 10) {
          costState.value = costState.value.concat(
            new Array(10 - costState.value.length).fill(undefined).map(() => ({
              id: uniqueId(UNIQUE_ID_PREFIX),
              projectCostsType: Number(activeKey.value),
              allowance: null,
              allowanceCurrencyId: selectedCurrency.value,
              monthlySalary: null,
              name: null,
              overtimeDaysFirst: null,
              overtimeDaysSecond: null,
              overtimeHoursFirst: null,
              overtimeHoursSecond: null,
              positionId: null,
              projectId,
              checked: false,
              salaryCurrencyId: selectedCurrency.value,
              workingDays: null,
              workingHours: null
            }))
          )
        }
        costStateToCompare.value = cloneDeep(costState.value)
        if (type === '1') costStateToClone.value = cloneDeep(costState.value)
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const prevMonthFilter = ref()

    const hanleCancelConfirmSubmitModal = () => {
      if (prevMonthFilter.value) filterMonth.value = prevMonthFilter.value
      prevMonthFilter.value = null
    }

    const handleFilterMonth = (val) => {
      if (isHaveNoChangeCostState.value) {
        fetDataTable(activeKey.value, val)
      } else {
        isVisibleModalConfirmSubmit.value = true
        purposeConfirm.value = 'change-month'
      }
    }

    watch(
      () => filterMonth.value,
      (newVal, oldVal) => {
        prevMonthFilter.value = oldVal
      }
    )

    const nextTab = ref()
    const purposeConfirm = ref()
    const isVisibleModalConfirmSubmit = ref()

    const tabClick = (val) => {
      if (val === activeKey.value) return
      if (isHaveNoChangeCostState.value) {
        activeKey.value = val
        fetDataTable(val, filterMonth.value)
      } else {
        isVisibleModalConfirmSubmit.value = true
        nextTab.value = val
        purposeConfirm.value = 'change-tab'
      }
    }

    const handleConfirmSubmitModal = () => {
      isVisibleModalConfirmSubmit.value = false

      if (purposeConfirm.value === 'change-tab') {
        fetDataTable(nextTab.value, filterMonth.value)
        activeKey.value = nextTab.value
      } else if (purposeConfirm.value === 'close-modal') {
        emit('update:visible', false)
      } else if (purposeConfirm.value === 'change-month') {
        fetDataTable(activeKey.value, filterMonth.value)
      }
    }

    const handleDeleteCostItem = () => {
      checkedList.value.forEach((id) => {
        if (id.toString().indexOf(UNIQUE_ID_PREFIX) === -1) {
          costDeleteList.value = [...costDeleteList.value, id]
        }

        costState.value = costState.value.filter((item) => item.id !== id)
      })
    }

    const isVisibleModalConfirmClone = ref()

    const cloneCostState = () => {
      costState.value.forEach((cost) => {
        if (cost.id.toString().indexOf(UNIQUE_ID_PREFIX) === -1) {
          costDeleteList.value = [...costDeleteList.value, cost.id]
        }
      })

      costState.value = costStateToClone.value.map((cost) => ({
        ...cost,
        id: uniqueId(UNIQUE_ID_PREFIX),
        projectCostsType: PROJECT_COST_TYPES[1].value
      }))

      isVisibleModalConfirmClone.value = false
    }

    const handleCloneCostState = () => {
      if (!isHaveNoChangeCostState.value) {
        isVisibleModalConfirmClone.value = true
      } else {
        cloneCostState()
      }
    }

    const handleConfirmCloneModal = () => {
      cloneCostState()
    }

    onBeforeMount(async () => {
      const { result } = await getPositionList()
      positionList.value = result?.data || []

      await fetDataTable()
    })

    function handleBeforeReload(event) {
      if (isHaveNoChangeCostState.value) return

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
      disabledDate,
      visible,
      activeKey,
      positionList,
      PROJECT_COST_TYPES,
      costState,
      costStateToCompare,
      ...toRefs(state),
      checkedList,
      isLoaddingSubmitButton,
      costDeleteList,
      isLoadingDataTable,
      PROJECT_TYPES,
      salaryTotal,
      selectedCurrency,
      selectedCurrencyCode,
      isVisibleModalConfirmSubmit,
      costStateToClone,
      authProfile,
      filterMonth,
      isHaveNoChangeCostState,
      totalSalaryCountForUser,

      // func
      handleCancel,
      submit,
      handleAddCostItem,
      onCheckAllChange,
      handleDeleteCostItem,
      handleCloneCostState,
      countSubTotal,
      tabClick,
      handleConfirmSubmitModal,
      isVisibleModalConfirmClone,
      handleConfirmCloneModal,
      hanleCancelConfirmSubmitModal,
      handleFilterMonth
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.directly-person-cost {
  .ant-modal-footer {
    background-color: $color-grey-96;
  }

  &__wrapper {
    text-align: left;
  }

  &__count {
    display: flex;
    justify-content: flex-end;
    margin: 24px 0;
    padding-top: 12px;
    border-top: 1px dashed $color-grey-85;
  }

  &__submit-buttons {
    text-align: center;
    margin-top: 24px;
    margin-bottom: 16px;
  }

  &__filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__table {
    border: 1px solid $color-grey-75;
    overflow: auto;
    display: block;
    max-height: 528px;

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: $color-grey-55;
      opacity: 0.7;
      background-clip: padding-box;
    }

    thead {
      background-color: $color-grey-92;
      color: $color-primary-9;
      font-weight: 700;
      font-size: 12px;
      position: sticky;
      top: 0;
      z-index: 100;

      th {
        border-bottom: 1px solid $color-grey-75;
        width: 200px;
      }
    }

    th,
    td {
      white-space: nowrap;
      padding: 16px;
      border-right: 1px solid $color-grey-75;

      &:last-child {
        border-right: none;
      }
    }

    tbody {
      background-color: $color-grey-100;

      tr.isCheckedRow {
        background-color: $color-primary-1;
      }

      td {
        border-bottom: 1px solid $color-grey-75;
      }
    }
  }

  &__delete-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 40px;
  }

  .cost-tabs-clone {
    border: 0;
    color: $color-primary-6;
    background-color: $color-grey-96;

    &:hover:not(.ant-btn[disabled]) {
      span {
        text-decoration: underline;
      }
    }
  }

  .cost-tabs-clone.ant-btn[disabled] {
    color: $color-grey-55;
    background-color: $color-grey-96;
  }
}
</style>
