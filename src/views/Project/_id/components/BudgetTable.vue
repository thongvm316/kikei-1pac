<template>
  <a-collapse v-model:activeKey="activeKey" class="project-budget-table">
    <a-collapse-panel key="1" header="予算">
      <a-form layout="vertical">
        <table class="table-body">
          <tbody>
            <!-- order, material, direct cost -->
            <a-spin
              v-for="costList in [
                { costType: COST_MODAL_TYPES[0].id, loading: isOrderCostLoading, data: orderCostList },
                { costType: COST_MODAL_TYPES[1].id, loading: isMaterialCostLoading, data: materialCostList },
                { costType: COST_MODAL_TYPES[2].id, loading: isDirectCostLoading, data: directCostList }
              ]"
              :key="costList.costType"
              :spinning="costList.loading"
            >
              <tr>
                <td v-if="costList.costType === COST_MODAL_TYPES[0].id">外注費</td>
                <td v-else-if="costList.costType === COST_MODAL_TYPES[1].id">直接材料費</td>
                <td v-else>直接経費</td>

                <!-- content -->
                <td>
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
                          <td>{{ contentList.type === 1 ? '外注費' : '実績' }}</td>
                          <td class="table-cost__content">
                            <tr v-for="costItem in contentList.data" :key="costItem.id">
                              <td>{{ costItem.name }}</td>
                              <td>{{ $filters.number_with_commas(costItem.money) + ` (${costItem.currencyCode})` }}</td>
                            </tr>
                          </td>
                          <td>
                            <a-button
                              v-if="contentList.type === 1"
                              type="link"
                              @click="handleOpenCostModal(costList.costType)"
                            >
                              <template #icon>
                                <span class="btn-icon"><edit-icon /></span>
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
            </a-spin>
          </tbody>
        </table>
      </a-form>
    </a-collapse-panel>
  </a-collapse>

  <CostsModal
    v-if="isCostsModalOpen"
    v-model:visible="isCostsModalOpen"
    :title="titleCostModal"
    :cost-modal-type="costModalType"
    @fetchOrderCostList="fetchOrderCostList"
    @fetchMaterialCostList="fetchMaterialCostList"
    @fetchDirectCostList="fetchDirectCostList"
  />
</template>

<script>
import { defineComponent, ref, onBeforeMount, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { find, sumBy } from 'lodash-es'

import CostsModal from './CostsModal'

import { COST_MODAL_TYPES, PROJECT_COST_TYPES } from '@/enums/project.enum'
import { getOrderCostList, getDirectCostList, getMaterialCostList } from '../../composables/useCosts'
import { getCurrencyList } from '../../composables/useCurrency'

import EditIcon from '@/assets/icons/ico_edit.svg'

export default defineComponent({
  name: 'ProjectBudgetTable',

  components: {
    CostsModal,
    EditIcon
  },

  setup() {
    const route = useRoute()
    const projectId = Number(route.params?.id)

    const activeKey = ref(['1'])

    // costs modal
    const isCostsModalOpen = ref(false)
    const titleCostModal = ref('')
    const costModalType = ref()

    // data
    const isOrderCostLoading = ref(false)
    const isMaterialCostLoading = ref(false)
    const isDirectCostLoading = ref(false)
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

    const handleOpenCostModal = (typeId) => {
      const costFound = find(COST_MODAL_TYPES, { id: typeId })
      if (!costFound) return

      isCostsModalOpen.value = true
      titleCostModal.value = costFound.title
      costModalType.value = typeId
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

    const fetchOrderCostList = async () => {
      const params = {
        projectId,
        projectCostsType: `${PROJECT_COST_TYPES[0].value},${PROJECT_COST_TYPES[1].value}`
      }

      try {
        isOrderCostLoading.value = true
        const responseRequest = await getOrderCostList(params)

        const { predict, actual, totalPredict, totalActual } = convertListToDatatable(responseRequest)
        orderCostList.predict = predict
        orderCostList.actual = actual
        orderCostList.totalPredict = totalPredict
        orderCostList.totalActual = totalActual
      } finally {
        isOrderCostLoading.value = false
      }
    }

    const fetchMaterialCostList = async () => {
      const params = {
        projectId,
        projectCostsType: `${PROJECT_COST_TYPES[0].value},${PROJECT_COST_TYPES[1].value}`
      }

      try {
        isMaterialCostLoading.value = true
        const responseRequest = await getMaterialCostList(params)

        const { predict, actual, totalPredict, totalActual } = convertListToDatatable(responseRequest)
        materialCostList.predict = predict
        materialCostList.actual = actual
        materialCostList.totalPredict = totalPredict
        materialCostList.totalActual = totalActual
      } finally {
        isMaterialCostLoading.value = false
      }
    }

    const fetchDirectCostList = async () => {
      const params = {
        projectId,
        projectCostsType: `${PROJECT_COST_TYPES[0].value},${PROJECT_COST_TYPES[1].value}`
      }

      try {
        isDirectCostLoading.value = true
        const responseRequest = await getDirectCostList(params)

        const { predict, actual, totalPredict, totalActual } = convertListToDatatable(responseRequest)
        directCostList.predict = predict
        directCostList.actual = actual
        directCostList.totalPredict = totalPredict
        directCostList.totalActual = totalActual
      } finally {
        isDirectCostLoading.value = false
      }
    }

    onBeforeMount(async () => {
      // get currency list
      const currencyReponse = await getCurrencyList()
      currencyList.value = currencyReponse?.result?.data || []

      fetchOrderCostList()
      fetchMaterialCostList()
      fetchDirectCostList()
    })

    return {
      isCostsModalOpen,
      isOrderCostLoading,
      isMaterialCostLoading,
      isDirectCostLoading,

      COST_MODAL_TYPES,
      activeKey,
      titleCostModal,
      costModalType,
      orderCostList,
      materialCostList,
      directCostList,

      handleOpenCostModal,
      fetchOrderCostList,
      fetchMaterialCostList,
      fetchDirectCostList
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.project-budget-table {
  margin-top: 24px;

  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }

  .table-body {
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
    }

    &__total {
      border-top: 1px dashed $color-grey-85;
      border-bottom: 1px solid $color-grey-85;

      &--content {
        @include flexbox(flex-end, null);
        padding: 8px 0 16px;
      }

      &:last-child {
        border-bottom: 0;

        .table-cost__total--content {
          padding-bottom: 0;
        }
      }
    }
  }
}
</style>
