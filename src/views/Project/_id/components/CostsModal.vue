<template>
  <a-modal :visible="visible" centered width="656px" class="modal-project-costs" :title="title" @cancel="handleCancel">
    <template #footer>
      <div class="cost-tabs-wrapper">
        <a-tabs :active-key="activeKey" :animated="false" class="cost-tabs" @tabClick="tabClick">
          <a-tab-pane v-for="tab in PROJECT_COST_TYPES" :key="tab.key" :tab="tab.text" class="cost-tabs__tab">
            <a-spin :spinning="isDataLoading">
              <div class="modal-project-costs__filter">
                <div>
                  <a-month-picker
                    v-if="project.value.type === PROJECT_TYPES[1].value"
                    v-model:value="filterMonth"
                    :style="{ width: '122px' }"
                    format="YYYY/MM"
                    placeholder="YYYY/MM"
                  >
                    <template #suffixIcon>
                      <calendar-outlined />
                    </template>
                  </a-month-picker>
                </div>
                <a-button
                  v-if="activeKey === PROJECT_COST_TYPES[1].key"
                  :disabled="isDisableCloneCost"
                  class="cost-tabs-clone"
                  @click="handleCloneCostState"
                >
                  <template #icon>
                    <span class="btn-icon"><copy-icon /></span>
                  </template>
                  予測の内容をコピーする
                </a-button>
              </div>
              <template v-if="costState.length > 0">
                <div v-for="costItem in costState" :key="costItem.id" class="cost-tabs__tab--item">
                  <!-- name -->
                  <a-input v-model:value="costItem.name" class="cost-name" placeholder="企業名">
                    {{ costItem.name }}
                  </a-input>

                  <!-- money -->
                  <a-input-number
                    v-model:value="costItem.money"
                    placeholder="0"
                    class="u-ml-12"
                    :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                    :precision="0"
                    :min="0"
                    :max="999999999999"
                    :style="{ width: '180px' }"
                  />

                  <!-- curency -->
                  <a-select
                    v-model:value="costItem.currencyId"
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

                  <!-- button delete -->
                  <a-button class="btn-danger u-ml-24" @click="handleDeleteCostItem(costItem.id)">削除</a-button>
                </div>
              </template>
              <div v-else class="u-text-center">該当データなし</div>
              <a-button size="small" class="cost-tabs__tab--add-item" @click="handleAddCostItem">
                <template #icon>
                  <span class="btn-icon"><line-add-icon /></span>
                </template>
                {{ isOrderCostModal ? '外注を追加' : isMaterialCostModal ? '材料費を追加' : '経費を追加' }}
              </a-button>
            </a-spin>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="total-cost">
        <div class="total-cost__left">外注費合計:</div>
        <div v-if="totalCosts.length !== 0" class="total-cost__right">
          <div v-for="currencyTotal in totalCosts" :key="currencyTotal.code">
            {{ `${$filters.number_with_commas(currencyTotal.total)} (${currencyTotal.code})` }}
          </div>
        </div>
        <div v-else class="total-cost__left">0</div>
      </div>

      <div class="cost-submit">
        <a-button :disabled="isSubmitLoading" @click="handleCancel">キャンセル</a-button>
        <a-button
          :disabled="isDisabledSubmitButton"
          :loading="isSubmitLoading"
          type="primary"
          class="u-ml-12"
          @click="handleSubmit"
          >登録</a-button
        >
      </div>
    </template>
    <ConfirmSubmitModal v-model:visible="isVisibleModalConfirmSubmit" @on-confirm="handleConfirmSubmitModal" />
    <ConfirmCloneModal v-model:visible="isVisibleModalConfirmClone" @on-confirm="handleConfirmCloneModal" />
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed, onBeforeMount, onMounted, onUnmounted, watch } from 'vue'
import { PROJECT_TYPES } from '@/enums/project.enum'
import { useRoute } from 'vue-router'
import { find, uniqueId, sumBy, cloneDeep, isEqual } from 'lodash-es'
import { CalendarOutlined } from '@ant-design/icons-vue'

import { COST_MODAL_TYPES, PROJECT_COST_TYPES } from '@/enums/project.enum'
import { getCurrencyList } from '../../composables/useCurrency'
import {
  getOrderCostList,
  upsertOrderCost,
  deleteOrderCost,
  getDirectCostList,
  upsertDirectCost,
  deleteDirectCost,
  getMaterialCostList,
  upsertMaterialCost,
  deleteMaterialCost
} from '../../composables/useCosts'

import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import CopyIcon from '@/assets/icons/ico_copy.svg'
import ConfirmSubmitModal from './ConfirmSubmitModal.vue'
import ConfirmCloneModal from './ConfirmCloneModal.vue'
import { useStore } from 'vuex'
import moment from 'moment'
import { fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'

export default defineComponent({
  name: 'CostsModal',

  components: {
    LineAddIcon,
    CopyIcon,
    ConfirmSubmitModal,
    ConfirmCloneModal,
    CalendarOutlined
  },

  props: {
    visible: Boolean,
    title: String,
    costModalType: Number,
    project: Object
  },

  emits: ['fetchOrderCostList', 'fetchMaterialCostList', 'fetchDirectCostList', 'update:visible'],

  setup(props, { emit }) {
    const route = useRoute()
    const store = useStore()

    const projectId = Number(route.params?.id)
    const defaultCostItem = {
      projectId: projectId,
      projectCostsType: null,
      name: '',
      money: 0,
      currencyId: null
    }
    const UNIQUE_ID_PREFIX = '__cost__'

    const activeKey = ref('1')
    const currencyList = ref([])
    const costState = ref([])
    const costDeleteList = ref([])
    const isVisibleModalConfirmClone = ref()

    const isDataLoading = ref(false)
    const isSubmitLoading = ref(false)
    const isOrderCostModal = computed(() => props.costModalType === COST_MODAL_TYPES[0].id)
    const isMaterialCostModal = computed(() => props.costModalType === COST_MODAL_TYPES[1].id)
    const isDirectCostModal = computed(() => props.costModalType === COST_MODAL_TYPES[2].id)
    const isDisableCloneCost = computed(() => costStateToClone.value.length < 1)

    const currencyIdDefault = computed(() => {
      const JPYFound = find(currencyList.value, { code: 'JPY' })
      if (!JPYFound) return null
      return JPYFound.id
    })

    const totalCosts = computed(() => {
      return currencyList.value
        .map((currency) => {
          let total = null

          const costStateFiltered = costState.value.filter(
            (cost) => cost.currencyId === currency.id && cost.money !== null
          )
          if (costStateFiltered.length > 0) {
            total = total ? total + sumBy(costStateFiltered, 'money') : sumBy(costStateFiltered, 'money')
          }

          return { total, code: currency.code }
        })
        .filter((item) => item.total !== null)
    })

    const createCostItem = () => ({
      ...defaultCostItem,
      id: uniqueId(UNIQUE_ID_PREFIX),
      projectCostsType: Number(activeKey.value),
      currencyId: currencyIdDefault.value
    })

    const handleAddCostItem = () => {
      costState.value = [...costState.value, createCostItem()]
    }

    const handleDeleteCostItem = (itemId) => {
      costState.value = costState.value.filter((item) => item.id !== itemId)

      if (itemId.toString().indexOf(UNIQUE_ID_PREFIX) === -1) {
        costDeleteList.value = [...costDeleteList.value, itemId]
      }
    }

    const cloneCostState = () => {
      costState.value.forEach((cost) => {
        if (cost.id.toString().indexOf(UNIQUE_ID_PREFIX) === -1) {
          costDeleteList.value = [...costDeleteList.value, cost.id]
        }
      })

      costState.value = costStateToClone.value.map((cost) => ({
        ...cost,
        id: uniqueId(UNIQUE_ID_PREFIX),
        projectCostsType: 2
      }))

      isVisibleModalConfirmClone.value = false
    }

    const handleCloneCostState = () => {
      if (costState.value.length > 0) {
        isVisibleModalConfirmClone.value = true
      } else {
        cloneCostState()
      }
    }

    const handleConfirmCloneModal = () => {
      cloneCostState()
    }

    const handleCancel = () => {
      if (isEqual(costStateToCompare.value, costState.value)) {
        emit('update:visible', false)
      } else {
        isVisibleModalConfirmSubmit.value = true
        purposeConfirm.value = 'close-modal'
      }
    }

    const convertDataToSubmit = () => {
      let data = cloneDeep(costState.value)

      data.forEach((item) => {
        if (item.id && item.id.toString().indexOf(UNIQUE_ID_PREFIX) === 0) delete item.id
      })

      return data
    }

    const handleSubmit = async () => {
      // remove id auto generate
      const dataRequest = convertDataToSubmit()

      try {
        isSubmitLoading.value = true
        const paramsDelete = { id: costDeleteList.value }

        if (isOrderCostModal.value) {
          paramsDelete.id.length !== 0 && (await deleteOrderCost(paramsDelete))
          await upsertOrderCost({ projectOrderCosts: dataRequest })

          emit('fetchOrderCostList')
        } else if (isMaterialCostModal.value) {
          paramsDelete.id.length !== 0 && (await deleteMaterialCost(paramsDelete))
          await upsertMaterialCost({ projectMaterialCosts: dataRequest })

          emit('fetchMaterialCostList')
        } else if (isDirectCostModal.value) {
          paramsDelete.id.length !== 0 && (await deleteDirectCost(paramsDelete))
          await upsertDirectCost({ projectDirectCosts: dataRequest })

          emit('fetchDirectCostList')
        }

        costDeleteList.value = []
        costStateToCompare.value = cloneDeep(costState.value)
        costStateToClone.value = cloneDeep(costState.value)
        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          message: 'Submit success'
        })
      } finally {
        isSubmitLoading.value = false
      }
    }

    const costStateToCompare = ref([])

    const isDisabledSubmitButton = computed(() => isEqual(costStateToCompare.value, costState.value))

    const isVisibleModalConfirmSubmit = ref()
    const nextTab = ref()
    const purposeConfirm = ref()

    const tabClick = (val) => {
      if (val === activeKey.value) return

      if (isEqual(costStateToCompare.value, costState.value)) {
        activeKey.value = val
        fetchDataDirectList(val, filterMonth.value)
      } else {
        isVisibleModalConfirmSubmit.value = true
        nextTab.value = val
        purposeConfirm.value = 'change-tab'
      }
    }

    const handleConfirmSubmitModal = () => {
      isVisibleModalConfirmSubmit.value = false

      if (purposeConfirm.value === 'change-tab') {
        activeKey.value = nextTab.value
        fetchDataDirectList(nextTab.value, filterMonth.value)
      } else if (purposeConfirm.value === 'close-modal') {
        emit('update:visible', false)
      }
    }

    const costStateToClone = ref()

    const filterMonth = ref(fromStringToDateTimeFormatPicker(moment(new Date()).format('YYYY-MM')))

    watch(
      () => filterMonth.value,
      (val) => {
        fetchDataDirectList(activeKey.value, val)
      }
    )

    const fetchDataDirectList = async (projectCostsType = activeKey.value, month = new Date()) => {
      isDataLoading.value = true

      // get direct list
      try {
        const paramsRequest = {
          projectId,
          projectCostsType,
          month: month ? moment(month).format('YYYY-MM') : null
        }
        let responseRequest = null

        if (isOrderCostModal.value) {
          responseRequest = await getOrderCostList(paramsRequest)
        } else if (isMaterialCostModal.value) {
          responseRequest = await getMaterialCostList(paramsRequest)
        } else if (isDirectCostModal.value) {
          responseRequest = await getDirectCostList(paramsRequest)
        }

        costState.value = responseRequest?.result?.data || []

        // create default items
        // if (costState.value.length === 0) {
        //   costState.value = new Array(3).fill(undefined).map(() => createCostItem())
        // }

        costState

        costStateToCompare.value = cloneDeep(costState.value)
        if (projectCostsType === '1') costStateToClone.value = cloneDeep(costState.value)
      } finally {
        isDataLoading.value = false
      }
    }

    onBeforeMount(async () => {
      isDataLoading.value = true

      // get currency list
      const currencyReponse = await getCurrencyList()
      currencyList.value = currencyReponse?.result?.data || []

      await fetchDataDirectList()
    })

    function handleBeforeReload(event) {
      if (isEqual(costState.value, costStateToCompare.value)) return

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
      PROJECT_COST_TYPES,
      activeKey,
      costState,
      currencyList,
      totalCosts,
      costStateToCompare,
      isDisabledSubmitButton,
      isVisibleModalConfirmSubmit,
      isVisibleModalConfirmClone,
      costStateToClone,
      filterMonth,
      PROJECT_TYPES,

      isDisableCloneCost,
      isSubmitLoading,
      isDataLoading,
      isOrderCostModal,
      isMaterialCostModal,
      isDirectCostModal,

      handleAddCostItem,
      handleDeleteCostItem,
      handleCloneCostState,
      handleCancel,
      handleSubmit,
      isEqual,
      tabClick,
      handleConfirmSubmitModal,
      handleConfirmCloneModal
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.modal-project-costs {
  .ant-modal-footer {
    background-color: $color-grey-96;
    padding: 16px 0;
    text-align: left;
    max-height: 80vh;
    overflow-y: scroll;

    .ant-tabs-bar:first-child {
      padding: 0 24px;
    }
  }

  &__filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid $color-grey-85;
    margin-bottom: 16px;
  }

  .ant-tabs-nav {
    margin-left: 0;
  }

  .cost-tabs-wrapper {
    position: relative;
  }

  .cost-tabs-clone {
    border: 0;
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

  .cost-tabs {
    &__tab {
      padding: 16px 24px;

      &--item {
        @include flexbox(center, center);

        & + .cost-tabs__tab--item {
          margin-top: 12px;
        }

        & + .cost-tabs__tab--add-item {
          margin-top: 24px;
        }

        .cost-name {
          width: auto;
          flex-grow: 1;
        }
      }
    }
  }

  .total-cost {
    @include flexbox(flex-end, null);
    padding-top: 16px;
    border-top: 1px dashed $color-grey-85;
    padding-right: 24px;

    &__left {
      margin-right: 12px;
    }

    &__right {
      text-align: right;
    }
  }

  .cost-submit {
    @include flexbox(center, center);
    margin-top: 16px;
  }

  .btn-danger {
    border: 1px solid $color-additional-red-5;
    color: $color-additional-red-5;
    height: 24px;
    width: 44px;
    padding: 0 4px;
  }
}
</style>
