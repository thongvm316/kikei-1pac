<template>
  <a-modal v-model:visible="visible" class="directly-person-cost" width="85%" title="直接労務費" @cancel="handleCancel">
    <template #footer>
      <div class="directly-person-cost__wrapper">
        <div class="u-relative">
          <a-tooltip color="fff" title="Check all">
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
          <a-tabs v-model:activeKey="activeKey" :animated="false" @change="handleChangeTab">
            <a-tab-pane v-for="tab in PROJECT_COST_TYPES" :key="tab.key" :tab="tab.text">
              <div class="directly-person-cost__filter">
                <div>
                  <a-month-picker
                    v-if="project.value.type === PROJECT_TYPES[1].value"
                    :style="{ width: '122px' }"
                    class="u-my-12"
                    format="YYYY/MM"
                    placeholder="YYYY/MM"
                  >
                    <template #suffixIcon>
                      <calendar-outlined />
                    </template>
                  </a-month-picker>
                </div>

                <a-space :size="32">
                  <a-button
                    v-if="activeKey === PROJECT_COST_TYPES[1].key"
                    :disabled="costState.predict.length < 1"
                    class="cost-tabs-clone"
                    @click="clonePredictToActual"
                  >
                    <template #icon>
                      <span class="btn-icon"><copy-icon /></span>
                    </template>
                    予測の内容をコピー
                  </a-button>
                  <a-space>
                    <span>通貨</span>
                    <a-select
                      :value="1"
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
              <a-spin :spinning="isLoadingDataTable">
                <table class="directly-person-cost__table">
                  <thead>
                    <tr>
                      <th style="min-width: 158px">役職</th>
                      <th style="min-width: 160px">氏名</th>
                      <th style="min-width: 232px">月給</th>
                      <th style="min-width: 234px">所定労働時間</th>
                      <th style="min-width: 234px">時間外労働時間（*1.25）</th>
                      <th style="min-width: 234px">時間外労働時間（*1.5）</th>
                      <th style="min-width: 232px">手当等</th>
                      <th style="min-width: 130px">小計</th>
                    </tr>
                  </thead>

                  <tbody v-if="costList.length > 0">
                    <tr v-for="item in costList" :key="item.id">
                      <!-- position -->
                      <td>
                        <a-space>
                          <a-checkbox v-model:checked="item.checked" />

                          <a-select
                            v-model:value="item.positionId"
                            style="width: 76px"
                            option-label-prop="label"
                            :default-active-first-option="false"
                          >
                            <a-select-option v-for="position in positionList" :key="position.value">{{
                              option.label
                            }}</a-select-option>
                          </a-select>
                        </a-space>
                      </td>

                      <!-- name -->
                      <td><a-input v-model:value="item.name" placeholder="氏名 氏名" /></td>

                      <!-- month -->
                      <td>
                        <a-space>
                          <a-input-number
                            v-model:value="item.monthlySalary"
                            placeholder="0"
                            :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="0"
                            :min="0"
                            :max="999999999999"
                          />
                          <a-select
                            v-model:value="item.salaryCurrencyId"
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
                            v-model:value="item.workingDays"
                            placeholder="0"
                            :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="0"
                            :min="0"
                            :max="999999999999"
                          />
                          <span>日</span>
                          <!-- hour -->
                          <a-input-number
                            v-model:value="item.workingHours"
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

                      <!-- over time 1.25 -->
                      <td>
                        <a-space>
                          <a-input-number
                            v-model:value="item.overtimeDaysFirst"
                            placeholder="0"
                            :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="0"
                            :min="0"
                            :max="999999999999"
                          />
                          <span>日</span>
                          <a-input-number
                            v-model:value="item.overtimeHoursFirst"
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

                      <!-- over time 1.5 -->
                      <td>
                        <a-space>
                          <a-input-number
                            v-model:value="item.overtimeDaysSecond"
                            placeholder="0"
                            :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="0"
                            :min="0"
                            :max="999999999999"
                          />
                          <span>日</span>
                          <a-input-number
                            v-model:value="item.overtimeHoursSecond"
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
                            v-model:value="item.allowance"
                            placeholder="0"
                            :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="0"
                            :min="0"
                            :max="999999999999"
                          />
                          <a-select
                            v-model:value="item.allowanceCurrencyId"
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
                      <td>
                        {{ $filters.number_with_commas(countSubTotal(item)) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </a-spin>

              <a-button size="small" class="u-mt-24" @click="handleAddCostItem">
                <template #icon>
                  <span class="btn-icon"><line-add-icon /></span>
                </template>
                見積項目を追加
              </a-button>

              <div class="directly-person-cost__count">
                <span>合計: {{ $filters.number_with_commas(salaryTotal) }} (VND)</span>
              </div>

              <div class="directly-person-cost__submit-buttons">
                <a-button @click="handleCancel">キャンセル</a-button>
                <a-button :loading="isLoaddingSubmitButton" type="primary" class="u-ml-8" @click="submit"
                  >登録</a-button
                >
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { watch, defineComponent, onBeforeMount, onUnmounted, reactive, ref, toRefs, computed } from 'vue'
import { CalendarOutlined } from '@ant-design/icons-vue'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import {
  getLaborDirectCostList,
  getPositionList,
  upsertLaborDirectCostList,
  deleteLaborDirectCostList
} from '../../composables/useProject'
import { getCurrencyList } from '../../composables/useCurrency'
import { useRoute } from 'vue-router'
import { PROJECT_COST_TYPES } from '@/enums/project.enum'
import { uniqueId } from 'lodash-es'
import DeleteWhiteIcon from '@/assets/icons/ico_delete_white.svg'
import CopyIcon from '@/assets/icons/ico_copy.svg'
import { PROJECT_TYPES } from '@/enums/project.enum'

export default defineComponent({
  name: 'DirectlyPersionCost',

  components: {
    CalendarOutlined,
    LineAddIcon,
    DeleteWhiteIcon,
    CopyIcon
  },

  props: {
    project: Object
  },

  emits: ['update:visible', 'on-submit', 'on-submit-direct-person-cost-modal'],

  setup(_, { emit }) {
    const visible = ref()
    const activeKey = ref('1')
    const height = ref(0)
    const currencyList = ref([])
    const route = useRoute()
    const projectId = Number(route.params?.id)
    const positionList = ref()
    const costState = reactive({
      predict: [],
      actual: []
    })

    const selectedRowKeys = reactive({
      predict: [],
      actual: []
    })

    const isLoadingDataTable = ref()

    const isLoaddingSubmitButton = ref()

    const UNIQUE_ID_PREFIX = '__cost__'

    const state = reactive({
      indeterminate: false,
      checkAll: false
    })

    const costDeleteList = ref([])

    const costList = computed(() =>
      activeKey.value === PROJECT_COST_TYPES[0].key ? costState.predict : costState.actual
    )

    const checkedList = computed(() => costList.value.filter((item) => item.checked).map((item) => item.id))

    const salaryTotal = computed(() => {
      let total = 0
      costList.value.forEach((item) => {
        total += countSubTotal(item)
      })

      return total
    })

    const onCheckAllChange = (e) => {
      Object.assign(state, {
        indeterminate: false
      })

      if (activeKey.value === PROJECT_COST_TYPES[0].key) {
        if (e.target.checked) {
          costState.predict.map((item) => {
            item.checked = true
            return item
          })
        } else {
          costState.predict.map((item) => {
            item.checked = false
            return item
          })
        }
      } else {
        if (e.target.checked) {
          costState.actual.map((item) => {
            item.checked = true
            return item
          })
        } else {
          costState.actual.map((item) => {
            item.checked = false
            return item
          })
        }
      }
    }

    watch(
      () => checkedList.value,
      (val) => {
        state.indeterminate = !!val.length && val.length > 0 && val.length < costList.value.length
        state.checkAll = !!val.length && val.length === costList.value.length
      }
    )

    const handleCancel = () => emit('update:visible', false)

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const submit = async () => {
      const dataRequest = convertDataToSubmit()
      isLoaddingSubmitButton.value = true

      try {
        await upsertLaborDirectCostList({ projectLaborDirectCost: dataRequest })
        if (costDeleteList.value.length > 0) {
          await deleteLaborDirectCostList({ id: costDeleteList.value })
        }
        emit('update:visible', false)
        emit('on-submit-direct-person-cost-modal')
      } finally {
        isLoaddingSubmitButton.value = false
      }
    }

    const handleChangeTab = async (val) => {
      console.log(val)
    }

    const convertDataToSubmit = () => {
      let data = []
      data.push(...costState.predict)
      data.push(...costState.actual)

      return (
        data
          // .filter((item) => !!item.name)
          .map((item) => {
            delete item.checked
            delete item.subtotal
            if (item.id && item.id.toString().indexOf(UNIQUE_ID_PREFIX) === 0) delete item.id
            return item
          })
      )
    }

    const createCostItem = (costTypeIndex) => ({
      id: uniqueId(UNIQUE_ID_PREFIX),
      projectCostsType: PROJECT_COST_TYPES[costTypeIndex].value,
      allowance: null,
      allowanceCurrencyId: 1,
      monthlySalary: null,
      name: '',
      overtimeDaysFirst: null,
      overtimeDaysSecond: null,
      overtimeHoursFirst: null,
      overtimeHoursSecond: null,
      positionId: 1,
      projectId,
      salaryCurrencyId: 1,
      workingDays: null,
      workingHours: null
    })

    const handleAddCostItem = () => {
      if (activeKey.value === PROJECT_COST_TYPES[0].key) {
        costState.predict = [...costState.predict, createCostItem(0)]
      } else if (activeKey.value === PROJECT_COST_TYPES[1].key) {
        costState.actual = [...costState.actual, createCostItem(1)]
      }
    }

    const countSubTotal = (item) => {
      const {
        allowance,
        workingDays,
        workingHours,
        overtimeDaysFirst,
        overtimeHoursFirst,
        overtimeDaysSecond,
        overtimeHoursSecond,
        monthlySalary
      } = item

      const salaryPerHour = monthlySalary / (20 * 8)
      const normalWorkingHours = workingDays * 8 + workingHours
      const overTimeFirstHours = (overtimeDaysFirst * 8 + overtimeHoursFirst) * (125 / 100)
      const overTimeSecondHours = (overtimeDaysSecond * 8 + overtimeHoursSecond) * 1.5

      const subtotal = (normalWorkingHours + overTimeFirstHours + overTimeSecondHours) * salaryPerHour

      return allowance + subtotal
    }

    const fetDataTable = async () => {
      isLoadingDataTable.value = true

      try {
        const { data } = await getLaborDirectCostList({
          projectId: projectId,
          projectCostsType: '1,2'
        })

        costState.predict = data
          .filter((item) => item.projectCostsType === 1)
          .map((item) => ({ ...item, checked: false, subtotal: countSubTotal(item) }))
        costState.actual = data
          .filter((item) => item.projectCostsType === 2)
          .map((item) => ({ ...item, checked: false, subtotal: countSubTotal(item) }))
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const handleDeleteCostItem = async () => {
      checkedList.value.forEach((item) => {
        if (item.toString().indexOf(UNIQUE_ID_PREFIX) === -1) {
          costDeleteList.value = [...costDeleteList.value, item]
        }
      })

      if (activeKey.value === PROJECT_COST_TYPES[0].key) {
        costState.predict = costState.predict.filter((item) => !checkedList.value.includes(item.id))
      } else if (activeKey.value === PROJECT_COST_TYPES[1].key) {
        costState.actual = costState.actual.filter((item) => !checkedList.value.includes(item.id))
      }
    }

    const clonePredictToActual = () => {
      costState.actual.forEach((cost) => {
        if (cost.id.toString().indexOf(UNIQUE_ID_PREFIX) === -1) {
          costDeleteList.value = [...costDeleteList.value, cost.id]
        }
      })
      costState.actual = costState.predict.map((cost) => ({
        ...cost,
        id: uniqueId(UNIQUE_ID_PREFIX),
        projectCostsType: PROJECT_COST_TYPES[1].value
      }))
    }

    onBeforeMount(async () => {
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)

      // get currency list
      const currencyReponse = await getCurrencyList()
      currencyList.value = currencyReponse?.result?.data || []

      const { result } = await getPositionList()
      positionList.value = result.data

      await fetDataTable(activeKey.value)

      // await createLaborDirectCostList({
      //   project_labor_direct_cost: [
      //     {
      //       project_id: 75,
      //       position_id: 2,
      //       name: 'Testttt',
      //       monthly_salary: 4000,
      //       salary_currency_id: 1,
      //       working_hours: 10,
      //       overtime_hours_first: 1,
      //       overtime_hours_second: 1.5,
      //       allowance: 1000,
      //       allowance_currency_id: 1,
      //       project_costs_type: 1
      //     },
      //     {
      //       project_id: 75,
      //       position_id: 1,
      //       name: 'Test 2',
      //       monthly_salary: 3000,
      //       salary_currency_id: 1,
      //       working_hours: 10,
      //       overtime_hours_first: 1,
      //       overtime_hours_second: 1.5,
      //       allowance: 1000,
      //       allowance_currency_id: 1,
      //       project_costs_type: 2
      //     }
      //   ]
      // })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getInnerHeight)
    })

    return {
      visible,
      activeKey,
      height,
      currencyList,
      positionList,
      PROJECT_COST_TYPES,
      costState,
      ...toRefs(selectedRowKeys),
      ...toRefs(state),
      checkedList,
      isLoaddingSubmitButton,
      costList,
      costDeleteList,
      isLoadingDataTable,
      PROJECT_TYPES,
      salaryTotal,

      // func
      handleCancel,
      submit,
      handleChangeTab,
      handleAddCostItem,
      onCheckAllChange,
      handleDeleteCostItem,
      clonePredictToActual,
      countSubTotal
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
    height: 500px;

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
