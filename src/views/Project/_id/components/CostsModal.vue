<template>
  <a-modal :visible="visible" width="656px" class="modal-project-costs" :title="title" @cancel="handleCancel">
    <template #footer>
      <div class="cost-tabs-wrapper">
        <a-button
          v-if="activeKey === PROJECT_COST_TYPES[0].key"
          :disabled="isDisableCloneCost"
          class="cost-tabs-clone"
          @click="handleCloneCost"
        >
          <template #icon>
            <span class="btn-icon"><copy-icon /></span>
          </template>
          予測の内容をコピーする
        </a-button>

        <a-tabs v-model:activeKey="activeKey" :animated="false" class="cost-tabs">
          <a-tab-pane v-for="tab in PROJECT_COST_TYPES" :key="tab.key" :tab="tab.text" class="cost-tabs__tab">
            <a-spin :spinning="isDataLoading">
              <div
                v-for="costItem in tab.key === PROJECT_COST_TYPES[0].key ? costState?.predict : costState?.actual"
                :key="costItem.id"
                class="cost-tabs__tab--item"
              >
                <!-- name -->
                <a-input v-model:value="costItem.name" placeholder="企業名">{{ costItem.name }}</a-input>

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
                  :style="{ width: '175px' }"
                />

                <!-- curency -->
                <a-select
                  v-model:value="costItem.currencyId"
                  show-arrow
                  option-label-prop="label"
                  class="u-ml-8"
                  :style="{ width: '135px' }"
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

              <a-button class="cost-tabs__tab--add-item" @click="handleAddCostItem">
                <template #icon>
                  <span class="btn-icon"><line-add-icon /></span>
                </template>
                外注を追加
              </a-button>
            </a-spin>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="total-cost">
        <div class="u-mr-12">外注費合計:</div>
        <div v-if="totalCosts.length !== 0">
          <div v-for="currencyTotal in totalCosts" :key="currencyTotal.code">
            {{ `${$filters.number_with_commas(currencyTotal.total)} (${currencyTotal.code})` }}
          </div>
        </div>
        <div v-else>0</div>
      </div>

      <div class="cost-submit">
        <a-button :disabled="isSubmitLoading" @click="handleCancel">キャンセル</a-button>
        <a-button :loading="isSubmitLoading" type="primary" class="u-ml-12" @click="handleSubmit">登録</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed, reactive, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { find, uniqueId, sumBy } from 'lodash-es'

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

export default defineComponent({
  name: 'CostsModal',

  components: {
    LineAddIcon,
    CopyIcon
  },

  props: {
    visible: Boolean,
    title: String,
    costModalType: Number
  },

  emits: ['fetchOrderCostList', 'fetchMaterialCostList', 'fetchDirectCostList', 'update:visible'],

  setup(props, { emit }) {
    const route = useRoute()

    const projectId = Number(route.params?.id)
    const defaultCostItem = {
      projectId: projectId,
      projectCostsType: null,
      name: '',
      money: null,
      currencyId: null
    }
    const UNIQUE_ID_PREFIX = '__cost__'

    const activeKey = ref('1')
    const currencyList = ref([])
    const costState = reactive({
      predict: [],
      actual: []
    })
    const isDataLoading = ref(false)
    const isSubmitLoading = ref(false)

    const isOrderCostModal = computed(() => props.costModalType === COST_MODAL_TYPES[0].id)
    const isMaterialCostModal = computed(() => props.costModalType === COST_MODAL_TYPES[1].id)
    const isDirectCostModal = computed(() => props.costModalType === COST_MODAL_TYPES[2].id)

    const isDisableCloneCost = computed(() => costState.predict.filter((item) => !!item.name).length === 0)

    const currencyIdDefault = computed(() => {
      const JPYFound = find(currencyList.value, { code: 'JPY' })
      if (!JPYFound) return null
      return JPYFound.id
    })

    const totalCosts = computed(() => {
      return currencyList.value
        .map((currency) => {
          let total = null

          const predictFiltered = costState.predict.filter(
            (cost) => cost.currencyId === currency.id && cost.money !== null
          )
          if (predictFiltered.length > 0) {
            total = total ? total + sumBy(predictFiltered, 'money') : sumBy(predictFiltered, 'money')
          }

          const actualFiltered = costState.actual.filter(
            (cost) => cost.currencyId === currency.id && cost.money !== null
          )
          if (actualFiltered.length > 0) {
            total = total ? total + sumBy(actualFiltered, 'money') : sumBy(actualFiltered, 'money')
          }

          return { total, code: currency.code }
        })
        .filter((item) => item.total !== null)
    })

    const createCostItem = (costTypeIndex) => ({
      ...defaultCostItem,
      id: uniqueId(UNIQUE_ID_PREFIX),
      projectCostsType: PROJECT_COST_TYPES[costTypeIndex].value,
      currencyId: currencyIdDefault.value
    })

    const handleAddCostItem = () => {
      if (activeKey.value === PROJECT_COST_TYPES[0].key) {
        costState.predict = [...costState.predict, createCostItem(0)]
      } else if (activeKey.value === PROJECT_COST_TYPES[1].key) {
        costState.actual = [...costState.actual, createCostItem(1)]
      }
    }

    const handleDeleteCostItem = (itemId) => {
      if (activeKey.value === PROJECT_COST_TYPES[0].key) {
        costState.predict = costState.predict.filter((item) => item.id !== itemId)
      } else if (activeKey.value === PROJECT_COST_TYPES[1].key) {
        costState.actual = costState.actual.filter((item) => item.id !== itemId)
      }
    }

    const handleCloneCost = () => {
      costState.actual = costState.predict
      activeKey.value = PROJECT_COST_TYPES[1].key
    }

    const handleCancel = () => {
      emit('update:visible', false)
    }

    const convertDataToSubmit = () => {
      let data = []
      data.push(...costState.predict)
      data.push(...costState.actual)

      return data
        .filter((item) => !!item.name)
        .map((item) => {
          if (item.id && item.id.toString().indexOf(UNIQUE_ID_PREFIX) === 0) delete item.id
          if (item.money === null) item.money = 0
          return item
        })
    }

    const handleSubmit = async () => {
      // remove id auto generate
      const dataRequest = convertDataToSubmit()

      try {
        isSubmitLoading.value = true

        if (isOrderCostModal.value) {
          await upsertOrderCost({ projectOrderCosts: dataRequest })
          emit('fetchOrderCostList')
        } else if (isMaterialCostModal.value) {
          await upsertMaterialCost({ projectMaterialCosts: dataRequest })
          emit('fetchMaterialCostList')
        } else if (isDirectCostModal.value) {
          await upsertDirectCost({ projectDirectCosts: dataRequest })
          emit('fetchDirectCostList')
        }

        // noti

        emit('update:visible', false)
      } finally {
        isSubmitLoading.value = false
      }
    }

    onBeforeMount(async () => {
      isDataLoading.value = true

      // get currency list
      const currencyReponse = await getCurrencyList()
      currencyList.value = currencyReponse?.result?.data || []

      // get direct list
      try {
        const paramsRequest = {
          projectId,
          projectCostsType: `${PROJECT_COST_TYPES[0].value},${PROJECT_COST_TYPES[1].value}`
        }
        let responseRequest = null

        if (isOrderCostModal.value) {
          responseRequest = await getOrderCostList(paramsRequest)
        } else if (isMaterialCostModal.value) {
          responseRequest = await getMaterialCostList(paramsRequest)
        } else if (isDirectCostModal.value) {
          responseRequest = await getDirectCostList(paramsRequest)
        }

        const reponseData = responseRequest?.result?.data || []
        costState.predict = reponseData.filter((item) => item.projectCostsType === PROJECT_COST_TYPES[0].value)
        costState.actual = reponseData.filter((item) => item.projectCostsType === PROJECT_COST_TYPES[1].value)
        // eslint-disable-next-line no-empty
      } catch {}

      // create default items
      if (costState.predict.length === 0 && costState.actual.length === 0) {
        costState.predict = new Array(3).fill(undefined).map(() => createCostItem(0))
        costState.actual = new Array(3).fill(undefined).map(() => createCostItem(1))
      }

      isDataLoading.value = false
    })

    return {
      PROJECT_COST_TYPES,
      activeKey,
      costState,
      currencyList,
      totalCosts,

      isDisableCloneCost,
      isSubmitLoading,
      isDataLoading,

      handleAddCostItem,
      handleDeleteCostItem,
      handleCloneCost,
      handleCancel,
      handleSubmit
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.modal-project-costs {
  .ant-modal-footer {
    padding: 16px 24px;
    text-align: left;
    max-height: 80vh;
    overflow-y: scroll;
  }

  .ant-tabs-nav {
    margin-left: 0;
  }

  .cost-tabs-wrapper {
    position: relative;
  }

  .cost-tabs-clone {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    margin-top: 6px;
    border: 0;
    color: $color-primary-6;

    &:hover:not(.ant-btn[disabled]) {
      span {
        text-decoration: underline;
      }
    }
  }

  .cost-tabs-clone.ant-btn[disabled] {
    color: $color-grey-55;
    background-color: $color-grey-100;
  }

  .cost-tabs {
    &__tab {
      padding: 16px 0;

      &--item {
        @include flexbox(null, null);

        & + .cost-tabs__tab--item {
          margin-top: 12px;
        }

        & + .cost-tabs__tab--add-item {
          margin-top: 24px;
        }
      }
    }
  }

  .total-cost {
    @include flexbox(flex-end, null);
    padding-top: 16px;
    border-top: 1px dashed $color-grey-85;
  }

  .cost-submit {
    @include flexbox(center, center);
    margin-top: 16px;
  }

  .btn-danger {
    border: 1px solid $color-additional-red-5;
    color: $color-additional-red-5;
  }
}
</style>
