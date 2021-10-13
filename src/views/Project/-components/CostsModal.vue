<template>
  <a-modal :visible="visible" width="85%" class="modal-project-costs" :title="title" @cancel="handleCancel">
    <template #footer>
      <div class="cost-tabs-wrapper">
        <a-button v-if="activeKey === COST_TYPES[0].key" class="cost-tabs-clone" @click="handleCloneCost">
          <template #icon>
            <span class="btn-icon"><copy-icon /></span>
          </template>
          予測の内容をコピーする
        </a-button>

        <a-tabs v-model:activeKey="activeKey" :animated="false" class="cost-tabs">
          <a-tab-pane v-for="tab in COST_TYPES" :key="tab.key" :tab="tab.text" class="cost-tabs__tab">
            <div
              v-for="(costItem, costItemIndex) in tab.key === COST_TYPES[0].key
                ? costState?.predict
                : costState?.actual"
              :key="costItem.id"
              :class="[
                'cost-tabs__tab--item',
                costItemIndex + 1 ===
                (tab.key === COST_TYPES[0].key ? costState?.predict.length : costState?.actual.length)
                  ? 'u-mb-24'
                  : 'u-mb-12'
              ]"
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
                  :key="currency.name"
                  :value="currency.id"
                  :label="currency.name"
                >
                  {{ currency.name }}
                </a-select-option>
              </a-select>

              <!-- button delete -->
              <a-button class="btn-danger u-ml-24" @click="handleDeleteCostItem(costItem.id)">削除</a-button>
            </div>

            <a-button @click="handleAddCostItem">
              <template #icon>
                <span class="btn-icon"><line-add-icon /></span>
              </template>
              外注を追加
            </a-button>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="total-cost">
        <div>外注費合計:</div>
        <div>
          <div>999,999,999,999,999 (JPY)</div>
          <div>999,999,999,999,999 (VND)</div>
        </div>
      </div>

      <div class="cost-submit">
        <a-button @click="handleCancel">キャンセル</a-button>
        <a-button type="primary" class="u-ml-12" @click="handleSubmit">登録</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed, reactive } from 'vue'
import { find, uniqueId } from 'lodash-es'

import { COST_MODAL_TYPES } from '@/enums/project.enum'

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

  setup(props, { emit }) {
    const activeKey = ref('1')

    const COST_TYPES = [
      {
        key: '1',
        text: '予測',
        value: 1
      },
      {
        key: '2',
        text: '実績',
        value: 2
      }
    ]

    const currencyList = [
      {
        id: 1,
        name: 'VND'
      },
      {
        id: 2,
        name: 'JPY'
      },
      {
        id: 3,
        name: 'USD'
      }
    ]

    const defaultCostItem = {
      projectId: null,
      projectCostsType: null,
      name: '',
      money: null,
      currencyId: null
    }

    const costState = reactive({
      predict: [],
      actual: []
    })

    const constTypeId = computed(() => {
      const costFound = find(COST_MODAL_TYPES, { id: props.costModalType })
      if (costFound) return costFound.id
      return null
    })

    const handleAddCostItem = () => {
      if (activeKey.value === COST_TYPES[0].key) {
        costState.predict = [
          ...costState.predict,
          { ...defaultCostItem, id: uniqueId('__cost__'), projectCostsType: COST_TYPES[0].value }
        ]
      } else if (activeKey.value === COST_TYPES[1].key) {
        costState.actual = [
          ...costState.actual,
          { ...defaultCostItem, id: uniqueId('__cost__'), projectCostsType: COST_TYPES[1].value }
        ]
      }

      console.log('new state', costState)
    }

    const handleDeleteCostItem = (itemId) => {
      if (activeKey.value === COST_TYPES[0].key) {
        costState.predict = costState.predict.filter((item) => item.id !== itemId)
      } else if (activeKey.value === COST_TYPES[1].key) {
        costState.actual = costState.actual.filter((item) => item.id !== itemId)
      }
    }

    const handleCloneCost = () => {
      costState.actual = costState.predict
      activeKey.value = COST_TYPES[1].key
    }

    const handleCancel = () => {
      emit('update:visible', false)
    }

    const handleSubmit = () => {
      console.log('costState: ', costState)

      if (constTypeId.value === COST_MODAL_TYPES[0].id) {
        console.log('submit modal 3')
      } else if (constTypeId.value === COST_MODAL_TYPES[1].id) {
        console.log('submit modal 4')
      } else if (constTypeId.value === COST_MODAL_TYPES[2].id) {
        console.log('submit modal 5')
      }

      emit('update:visible', false)
    }

    return {
      COST_TYPES,
      activeKey,
      costState,
      currencyList,

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
    color: $color-grey-55;

    &:hover {
      color: $color-grey-100;
      border-color: $color-primary-6;
    }
  }

  .cost-tabs {
    &__tab {
      padding: 16px 0;

      &--item {
        @include flexbox(null, null);
        // margin-bottom: 12px;

        // &:last-child {
        //   margin-bottom: 24px;
        // }
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
