<template>
  <div class="project-budget-table">
    <div class="project-budget-table__head">
      <div class="project-budget-table__head--left">
        <div class="table-title">予算</div>
      </div>
      <div class="project-budget-table__head--right">
        <div>
          <a-button v-if="!isEditing" type="default" @click="isEditing = true">
            <template #icon>
              <span class="btn-icon">
                <edit-icon />
              </span>
            </template>
            編集
          </a-button>
          <a-button v-if="isEditing" type="default" @click="handleCancelEditForm">キャンセル</a-button>
          <a-button v-if="isEditing" type="primary" :style="{ marginLeft: '8px' }" @click="submitButton">
            登録
          </a-button>
        </div>

        <DownOutlined :class="['arrow-icon', isCollapse && 'isCollapse']" @click="isCollapse = !isCollapse" />
      </div>
    </div>

    <a-collapse :active-key="isCollapse ? [] : [1]" :bordered="false" class="project-budget-table__collapse">
      <a-collapse-panel key="1">
        <a-form layout="vertical">
          <a-spin :spinning="isLoadingBudgetTable">
            <table class="table-body">
              <tbody>
                <!-- 1 -->
                <tr>
                  <td>
                    <p>受注金額</p>
                  </td>

                  <td class="table-body__content">
                    <table class="table-cost">
                      <tbody>
                        <tr class="solid-bottom">
                          <td class="table-cost__type">予測 ({{ month.format('MMMM') }})</td>
                          <td class="table-cost__content">
                            <tr>
                              <td class="table-cost__content--name"></td>
                              <td class="table-cost__content--money">
                                <a-input-number
                                  v-if="isEditing"
                                  v-model:value="revenueEstimateMoney"
                                  :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                                  :precision="0"
                                  :min="0"
                                  :max="999999999999"
                                  style="width: 154px"
                                />
                                <span v-if="!isEditing">{{ $filters.number_with_commas(revenueEstimateMoney) }}</span>
                                ({{ revenueCost?.predict?.code }})
                              </td>
                            </tr>
                          </td>
                          <td class="table-cost__edit"></td>
                        </tr>

                        <tr class="dashed-bottom">
                          <td class="table-cost__type">見積 ({{ month.format('MMMM') }})</td>
                          <td class="table-cost__content">
                            <tr>
                              <td class="table-cost__content--name"></td>
                              <td class="table-cost__content--money">
                                {{ $filters.number_with_commas(revenueCost?.predict?.total) }} ({{
                                  revenueCost?.predict?.code
                                }})
                              </td>
                            </tr>
                          </td>
                          <td class="table-cost__edit">
                            <a-button type="link" @click="openModalRevenue">
                              <template #icon>
                                <edit-large-icon />
                              </template>
                            </a-button>
                          </td>
                        </tr>

                        <tr>
                          <td class="table-cost__type">請求 ({{ month.format('MMMM') }})</td>
                          <td class="table-cost__content">
                            <tr>
                              <td class="table-cost__content--name"></td>
                              <td class="table-cost__content--money">
                                {{ $filters.number_with_commas(revenueCost?.actual?.total) }} ({{
                                  revenueCost?.actual?.code
                                }})
                              </td>
                            </tr>
                          </td>
                          <td class="table-cost__edit"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- 2 -->
                <tr>
                  <td>
                    <p>直接労務費</p>
                  </td>

                  <td class="table-body__content">
                    <table class="table-cost">
                      <tbody>
                        <tr class="solid-bottom">
                          <td class="table-cost__type">予測</td>
                          <td class="table-cost__content">
                            <tr>
                              <td class="table-cost__content--name"></td>
                              <td class="table-cost__content--money">
                                {{ $filters.number_with_commas(directlyPersonCost.predict) }} ({{
                                  directlyPersonCost.code
                                }})
                              </td>
                            </tr>
                          </td>
                          <td class="table-cost__edit">
                            <a-button type="link" @click="openModalDirectCost">
                              <template #icon>
                                <edit-large-icon />
                              </template>
                            </a-button>
                          </td>
                        </tr>

                        <tr>
                          <td class="table-cost__type">実績</td>
                          <td class="table-cost__content">
                            <tr>
                              <td class="table-cost__content--name"></td>
                              <td class="table-cost__content--money">
                                {{ $filters.number_with_commas(directlyPersonCost.actual) }} ({{
                                  directlyPersonCost.code
                                }})
                              </td>
                            </tr>
                          </td>
                          <td class="table-cost__edit"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- order, material, direct cost -->
                <tr
                  v-for="costList in [
                    { costType: COST_MODAL_TYPES[0].id, data: orderCostList },
                    { costType: COST_MODAL_TYPES[1].id, data: materialCostList },
                    { costType: COST_MODAL_TYPES[2].id, data: directCostList }
                  ]"
                  :key="costList.costType"
                >
                  <td v-if="costList.costType === COST_MODAL_TYPES[0].id">外注費</td>
                  <td v-else-if="costList.costType === COST_MODAL_TYPES[1].id">直接材料費</td>
                  <td v-else>直接経費</td>

                  <!-- content -->
                  <td class="table-body__content">
                    <table class="table-cost">
                      <tbody>
                        <template
                          v-for="contentList in [
                            { type: 1, data: costList?.data?.predict, total: costList?.data?.totalPredict },
                            { type: 2, data: costList?.data?.actual, total: costList?.data?.totalActual }
                          ]"
                          :key="contentList.type"
                        >
                          <tr>
                            <td class="table-cost__type">{{ contentList.type === 1 ? '予測' : '実績' }}</td>
                            <td class="table-cost__content">
                              <tr v-for="costItem in contentList.data" :key="costItem.id">
                                <td class="table-cost__content--name">{{ costItem.name }}</td>
                                <td class="table-cost__content--money">
                                  {{ $filters.number_with_commas(costItem.money) + ` (${costItem.currencyCode})` }}
                                </td>
                              </tr>
                            </td>
                            <td class="table-cost__edit">
                              <a-button
                                v-if="contentList.type === 1"
                                type="link"
                                @click="handleOpenCostModal(costList.costType)"
                              >
                                <template #icon>
                                  <edit-large-icon />
                                </template>
                              </a-button>
                            </td>
                          </tr>

                          <tr class="table-cost__total">
                            <td></td>
                            <td class="table-cost__content">
                              <tr>
                                <td></td>
                                <td>
                                  <div class="table-cost__total--content">
                                    <div class="u-mr-12">合計</div>

                                    <div v-if="contentList.total?.length !== 0">
                                      <div v-for="totalItem in contentList.total" :key="totalItem.id">
                                        {{ $filters.number_with_commas(totalItem.total) + ` (${totalItem.code})` }}
                                      </div>
                                    </div>
                                    <div v-else>0</div>
                                  </div>
                                </td>
                              </tr>
                            </td>
                            <td></td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </a-form>
      </a-collapse-panel>
    </a-collapse>
  </div>

  <CostsModal
    v-if="isCostsModalOpen"
    v-model:visible="isCostsModalOpen"
    :title="titleCostModal"
    :cost-modal-type="costModalType"
    :project="project"
    :currency-list="currencyList"
    @fetchOrderCostList="onFetchOrderCostList"
    @fetchMaterialCostList="onFetchMaterialCostList"
    @fetchDirectCostList="onFetchDirectCostList"
  />

  <DirectlyPersonCost
    v-if="isOpenDirectlyCostModal"
    v-model:visible="isOpenDirectlyCostModal"
    :project="project"
    :currency-list="currencyList"
    :currency-exchange="currencyExchange"
    @on-submit-direct-person-cost-modal="onSubmitDirectPersonCostModal"
  />

  <RevenueModal
    v-if="isOpenRevenueModal"
    v-model:visible="isOpenRevenueModal"
    :currency-list="currencyList"
    :project="project"
    :data-groups="dataGroups"
    :currency-exchange="currencyExchange"
    :data-accounts="dataAccounts"
    @on-submit-revenue-modal="onSubmitRevenueModal"
  />

  <RemindInputStatisticMonthModal v-model:visible="remindInputStatisticMonthModal" />
</template>

<script>
import { defineComponent, ref, onBeforeMount, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { find, sumBy } from 'lodash-es'

import { PROJECT_TYPES } from '@/enums/project.enum'

import CostsModal from './CostsModal'
import DirectlyPersonCost from './DirectlyPersonCost'
import RevenueModal from './RevenueModal.vue'

import { COST_MODAL_TYPES, PROJECT_COST_TYPES } from '@/enums/project.enum'
import { getOrderCostList, getDirectCostList, getMaterialCostList } from '../../composables/useCosts'
import { getCurrencyExchange, getCurrencyList } from '../../composables/useCurrency'

import EditIcon from '@/assets/icons/ico_edit.svg'
import EditLargeIcon from '@/assets/icons/ico_edit_large.svg'
import { DownOutlined } from '@ant-design/icons-vue'
import { getLaborDirectCostList, getRevenueList } from '../../composables/useProject'
import moment from 'moment'
import RemindInputStatisticMonthModal from './RemindInputStatisticMonthModal.vue'
import { fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'

export default defineComponent({
  name: 'ProjectBudgetTable',

  components: {
    CostsModal,
    EditIcon,
    EditLargeIcon,
    DownOutlined,
    DirectlyPersonCost,
    RevenueModal,
    RemindInputStatisticMonthModal
  },

  props: {
    project: Object,
    dataAccounts: Array,
    dataGroups: Array,
    projectRef: Object
  },

  emits: ['on-submit-predict-budget', 'on-update-total-revenue'],

  setup(props, { emit }) {
    const route = useRoute()
    const projectId = Number(route.params?.id)

    const isCollapse = ref(false)
    const isEditing = ref(false)

    // costs modal
    const isCostsModalOpen = ref(false)
    const titleCostModal = ref('')
    const costModalType = ref()

    // directly person cost modal
    const isOpenDirectlyCostModal = ref()

    // data
    const isLoadingBudgetTable = ref(false)
    const orderCostList = reactive({
      predict: [],
      actual: [],
      totalPredict: [],
      totalActual: []
    })
    const materialCostList = reactive({
      predict: [],
      actual: [],
      totalPredict: [],
      totalActual: []
    })
    const directCostList = reactive({
      predict: [],
      actual: [],
      totalPredict: [],
      totalActual: []
    })
    const currencyList = ref([])
    const currencyExchange = ref()
    const isOpenRevenueModal = ref()
    const revenueEstimateMoney = ref()
    const remindInputStatisticMonthModal = ref()
    const directlyPersonCost = reactive({
      predict: 0,
      actual: 0,
      code: null
    })
    const revenueCost = reactive({
      predict: {
        total: 0,
        code: null
      },
      actual: {
        total: 0,
        code: null
      }
    })
    const month = computed(() =>
      moment(new Date()).endOf('month') > moment(props.projectRef?.statisticsToMonth).endOf('month') ||
      moment(new Date()).endOf('month') < moment(props.projectRef?.statisticsFromMonth).endOf('month')
        ? moment(props.projectRef?.statisticsFromMonth)
        : fromStringToDateTimeFormatPicker(moment(new Date()).format('YYYY-MM'))
    )
    const estimateCurrencyId = ref()

    const handleCancelEditForm = () => {
      isEditing.value = false
      revenueEstimateMoney.value = props?.project?.value?.estimate
    }

    const handleOpenCostModal = (typeId) => {
      if (props.project.value?.statisticsFromMonth === '' || props.project.value?.statisticsToMonth === '') {
        remindInputStatisticMonthModal.value = true

        return
      }
      const costFound = find(COST_MODAL_TYPES, { id: typeId })
      if (!costFound) return

      isCostsModalOpen.value = true
      titleCostModal.value = costFound.title
      costModalType.value = typeId
    }

    const openModalRevenue = () => {
      if (props.project.value?.statisticsFromMonth === '' || props.project.value?.statisticsToMonth === '') {
        remindInputStatisticMonthModal.value = true
      } else {
        isOpenRevenueModal.value = true
      }
    }

    const openModalDirectCost = () => {
      if (props.project.value?.statisticsFromMonth === '' || props.project.value?.statisticsToMonth === '') {
        remindInputStatisticMonthModal.value = true
      } else {
        isOpenDirectlyCostModal.value = true
      }
    }

    const getCostListFiltered = (dataList, costType) => {
      return dataList
        .filter((item) => item.projectCostsType === costType)
        .map((item) => {
          const currencyFound = find(currencyList.value, { id: item.currencyId })
          return { ...item, currencyCode: currencyFound?.code || '' }
        })
    }

    const getTotalCost = (costList) => {
      return currencyList.value
        .map((currency) => {
          let total = null
          const listFiltered = costList.filter((cost) => cost.currencyId === currency.id)

          if (listFiltered.length > 0) {
            total = total ? total + sumBy(listFiltered, 'money') : sumBy(listFiltered, 'money')
          }

          return { id: currency.id, total, code: currency.code }
        })
        .filter((item) => item.total !== null)
    }

    const convertListToDatatable = (responseRequest) => {
      const dataList = responseRequest?.result?.data || []
      const predict = getCostListFiltered(dataList, 1)
      const actual = getCostListFiltered(dataList, 2)
      const totalPredict = getTotalCost(predict)
      const totalActual = getTotalCost(actual)

      return { predict, actual, totalPredict, totalActual }
    }

    const onFetchOrderCostList = () => {
      emit('on-update-total-revenue')
      fetchOrderCostList()
    }

    const onFetchMaterialCostList = () => {
      emit('on-update-total-revenue')
      fetchMaterialCostList()
    }

    const onFetchDirectCostList = () => {
      emit('on-update-total-revenue')
      fetchDirectCostList()
    }

    const fetchOrderCostList = async () => {
      const params = {
        projectId,
        projectCostsType: `${PROJECT_COST_TYPES[0].value},${PROJECT_COST_TYPES[1].value}`,
        month: props.project.value?.type === PROJECT_TYPES[1].value ? moment(month.value).format('YYYY-MM') : null
      }

      try {
        isLoadingBudgetTable.value = true
        const responseRequest = await getOrderCostList(params)

        const { predict, actual, totalPredict, totalActual } = convertListToDatatable(responseRequest)
        orderCostList.predict = predict
        orderCostList.actual = actual
        orderCostList.totalPredict = totalPredict
        orderCostList.totalActual = totalActual
      } finally {
        isLoadingBudgetTable.value = false
      }
    }

    const fetchMaterialCostList = async () => {
      const params = {
        projectId,
        projectCostsType: `${PROJECT_COST_TYPES[0].value},${PROJECT_COST_TYPES[1].value}`,
        month: props.project.value?.type === PROJECT_TYPES[1].value ? moment(month.value).format('YYYY-MM') : null
      }

      try {
        isLoadingBudgetTable.value = true
        const responseRequest = await getMaterialCostList(params)

        const { predict, actual, totalPredict, totalActual } = convertListToDatatable(responseRequest)
        materialCostList.predict = predict
        materialCostList.actual = actual
        materialCostList.totalPredict = totalPredict
        materialCostList.totalActual = totalActual
      } finally {
        isLoadingBudgetTable.value = false
      }
    }

    const fetchDirectCostList = async () => {
      const params = {
        projectId,
        projectCostsType: `${PROJECT_COST_TYPES[0].value},${PROJECT_COST_TYPES[1].value}`,
        month: props.project.value?.type === PROJECT_TYPES[1].value ? moment(month.value).format('YYYY-MM') : null
      }

      try {
        isLoadingBudgetTable.value = true
        const responseRequest = await getDirectCostList(params)

        const { predict, actual, totalPredict, totalActual } = convertListToDatatable(responseRequest)
        directCostList.predict = predict
        directCostList.actual = actual
        directCostList.totalPredict = totalPredict
        directCostList.totalActual = totalActual
      } finally {
        isLoadingBudgetTable.value = false
      }
    }

    const lowerCaseFirstLetter = (str) => {
      let newStr = ''

      for (let i = 0; i < str?.length; i++) {
        if (i === 0) {
          newStr += str[i].toLowerCase()
        } else {
          newStr += str[i]
        }
      }

      return newStr
    }

    const fetchLaborDirectCostList = async () => {
      try {
        isLoadingBudgetTable.value = true
        const { data } = await getLaborDirectCostList({
          projectId,
          projectCostsType: '1,2',
          month: props.project.value?.type === PROJECT_TYPES[1].value ? moment(month.value).format('YYYY-MM') : null
        })

        let predictCount = 0
        let actualCount = 0

        data?.adProjectLaborDirectCosts.forEach((item) => {
          if (item.projectCostsType === 1) {
            predictCount += item.subtotal
          } else {
            actualCount += item.subtotal
          }
        })

        const currency = find(currencyList.value, { id: data?.adProjectLaborDirectCosts[0].defaultCurrencyId })

        const currencySalary = find(currencyList.value, { id: data?.adProjectLaborDirectCosts[0].salaryCurrencyId })

        directlyPersonCost.code = currency?.code || 'JPY' // default JPY
        directlyPersonCost.predict =
          predictCount *
          currencyExchange.value[lowerCaseFirstLetter(currencySalary.code)][lowerCaseFirstLetter(currency.code)]
        directlyPersonCost.actual =
          actualCount *
          currencyExchange.value[lowerCaseFirstLetter(currencySalary.code)][lowerCaseFirstLetter(currency.code)]
      } finally {
        isLoadingBudgetTable.value = false
      }
    }

    const onSubmitDirectPersonCostModal = async () => {
      emit('on-update-total-revenue')
      fetchLaborDirectCostList()
    }

    const fetchRevenueList = async () => {
      const { result } = await getRevenueList({
        projectId,
        projectCostsType: '1,2',
        month: props.project.value?.type === PROJECT_TYPES[1].value ? moment(month.value).format('YYYY-MM') : null
      })

      const currentGroup = find(props?.dataGroups, { id: props?.project?.value?.groupId })
      const currentGroupCurrencyId = find(currencyList.value, { code: currentGroup.depositCurrencyCode })
      estimateCurrencyId.value = result?.data[0]?.currencyId || currentGroupCurrencyId?.id
      const currency = find(currencyList.value, {
        id: result?.data[0]?.currencyId
      })
      revenueCost.predict.code = currency?.code || currentGroup?.depositCurrencyCode
      revenueCost.actual.code = currency?.code || currentGroup?.depositCurrencyCode

      result.data.forEach((item) => {
        if (item.projectCostsType === 1) {
          revenueCost.predict.total = item.total
        } else {
          revenueCost.actual.total = item.total
        }
      })
    }

    const onSubmitRevenueModal = () => {
      emit('on-update-total-revenue')
      fetchRevenueList()
    }

    const submitButton = () => {
      const emitData = {
        revenueEstimateMoney: revenueEstimateMoney.value,
        estimateCurrencyId: estimateCurrencyId.value
      }
      isEditing.value = false
      emit('on-submit-predict-budget', emitData)
    }

    watch(
      () => props.projectRef.statisticsFromMonth,
      () => {
        fetchOrderCostList()
        fetchMaterialCostList()
        fetchDirectCostList()
        fetchLaborDirectCostList()
        fetchRevenueList()
      }
    )

    watch(
      () => props.projectRef.statisticsToMonth,
      () => {
        fetchOrderCostList()
        fetchMaterialCostList()
        fetchDirectCostList()
        fetchLaborDirectCostList()
        fetchRevenueList()
      }
    )

    onBeforeMount(async () => {
      // get currency list
      const currencyReponse = await getCurrencyList()
      currencyList.value = currencyReponse?.result?.data || []

      // get currency exchange
      const { result } = await getCurrencyExchange()
      currencyExchange.value = result.data

      revenueEstimateMoney.value = props?.project?.value?.estimate

      fetchOrderCostList()
      fetchMaterialCostList()
      fetchDirectCostList()
      fetchLaborDirectCostList()
      fetchRevenueList()
    })

    return {
      isEditing,
      isCollapse,
      isCostsModalOpen,
      isLoadingBudgetTable,
      revenueEstimateMoney,
      currencyList,
      currencyExchange,
      remindInputStatisticMonthModal,

      COST_MODAL_TYPES,
      titleCostModal,
      costModalType,
      orderCostList,
      materialCostList,
      directCostList,
      isOpenDirectlyCostModal,
      directlyPersonCost,
      isOpenRevenueModal,
      revenueCost,
      month,

      submitButton,
      handleCancelEditForm,
      handleOpenCostModal,
      fetchOrderCostList,
      fetchMaterialCostList,
      fetchDirectCostList,
      onSubmitDirectPersonCostModal,
      onSubmitRevenueModal,
      onFetchOrderCostList,
      onFetchMaterialCostList,
      onFetchDirectCostList,
      openModalRevenue,
      openModalDirectCost
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.project-budget-table {
  margin-top: 24px;

  &__head {
    @include flexbox(center, center);
    padding: 12px 32px;
    background-color: $color-grey-92;
    border: 1px solid $color-grey-75;

    &--left {
      .table-title {
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
      }
    }

    &--right {
      @include flexbox(space-between, center);
      flex-grow: 1;
      padding-left: 24px;

      .arrow-icon {
        color: $color-grey-55;
        transition: transform 0.2s;

        &.isCollapse {
          transform: rotate(-180deg);
          transition: transform 0.2s;
        }
      }
    }
  }

  .ant-collapse-header {
    display: none;
  }

  .ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }

  .table-body {
    width: 100%;
    background-color: $color-grey-100;

    > tbody {
      border-right: 1px solid $color-grey-75;

      > tr:not(:last-child) {
        border-bottom: 5px solid $color-grey-75;
      }
    }

    td {
      padding: 13px;
      border-bottom: 1px solid $color-grey-75;

      &:first-child {
        font-size: 12px;
        border-right: 1px solid $color-grey-75;
        color: $color-primary-9;
        font-weight: 700;
        background-color: $color-grey-94;
        padding-left: 32px;
        white-space: nowrap;
        width: 30%;
        min-width: 169px;
        vertical-align: top;
      }
    }

    td.table-body__content {
      padding: 2px 32px 16px 16px;
    }
  }

  .table-cost {
    width: 100%;
    background-color: $color-grey-100;

    td {
      padding: 0;
      border-bottom: 0;
      vertical-align: top;

      &:first-child {
        background-color: $color-grey-100;
        padding: 0 0 0 12px;
        width: auto;
        vertical-align: top;
        min-width: 0;
        font-weight: 400;
        border-right: 0;
        text-align: left;
        color: $color-grey-15;
      }
    }

    td.table-cost__type {
      padding-top: 18px;
      padding-left: 0;
    }

    td.table-cost__content {
      padding-top: 12px;
    }

    td.table-cost__edit {
      padding-top: 10px;
      padding-left: 12px;
    }

    &__content {
      width: 100%;

      tr {
        width: 100%;
      }

      td {
        width: 100%;
        text-align: right;
        font-size: 12px;
      }

      td.table-cost__content--name {
        max-width: 165px;
        white-space: normal;
        width: 100%;
      }

      td.table-cost__content--money {
        white-space: nowrap;
        padding-left: 12px;
      }

      td.table-cost__content--name,
      td.table-cost__content--money {
        padding-top: 4px;
        padding-bottom: 4px;
      }
    }

    &__edit {
      button {
        height: 24px;
        width: 24px;
      }
    }

    &__total {
      border-top: 1px dashed $color-grey-85;
      border-bottom: 1px solid $color-grey-85;

      &--content {
        @include flexbox(flex-end, null);
        padding-bottom: 16px;
      }

      &:last-child {
        border-bottom: 0;

        .table-cost__total--content {
          padding-bottom: 0;
        }
      }
    }

    tr.solid-bottom {
      border-bottom: 1px solid $color-grey-85;
    }

    tr.dashed-bottom {
      border-bottom: 1px dashed $color-grey-85;
    }
  }
}
</style>
