<template>
  <a-modal
    v-model:visible="visible"
    class="revenue-modal"
    width="85%"
    centered
    title="受注金額（見積・請求）"
    @cancel="handleCancel"
  >
    <template #footer>
      <div class="revenue-modal__wrapper">
        <div class="u-flex u-justify-between u-items-center">
          <div class="u-relative">
            <a-tooltip color="fff" :title="checkAll ? '全て解除' : '全てを選択'">
              <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange" />
            </a-tooltip>

            <div v-if="checkedList?.length > 0" class="revenue-modal__delete-btn">
              <a-tooltip color="fff" title="削除">
                <a-button type="primary" shape="circle" @click="handleDeleteCostItem">
                  <template #icon>
                    <span class="btn-icon"><DeleteWhiteIcon /></span>
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </div>
          <a-button disabled type="primary">見積書発行</a-button>
        </div>
        <a-spin :spinning="isLoadingDataTable">
          <div class="u-mt-16">
            <a-tabs :active-key="activeKey" :animated="false" @tabClick="tabClick">
              <a-tab-pane v-for="tab in PROJECT_REVENUE_TYPES" :key="tab.key" :tab="tab.text">
                <div class="revenue-modal__filter">
                  <div>
                    <a-month-picker
                      v-if="project.value.type === PROJECT_TYPES[1].value"
                      v-model:value="filterMonth"
                      :style="{ width: '122px' }"
                      format="YYYY/MM"
                      placeholder="YYYY/MM"
                      :disabled-date="disabledDate"
                      :allow-clear="false"
                      @change="handleFilterMonth"
                    >
                      <template #suffixIcon>
                        <calendar-outlined />
                      </template>
                    </a-month-picker>
                  </div>

                  <a-space :size="32">
                    <a-button
                      v-if="activeKey === PROJECT_REVENUE_TYPES[1].key"
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
                        v-model:value="currencyExchangeSelected"
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
                  </a-space>
                </div>

                <table class="revenue-modal__table">
                  <thead>
                    <tr>
                      <th style="min-width: 203px">科目</th>
                      <th style="min-width: 186px">費目</th>
                      <th style="min-width: 232px; width: 100%">概要・備考</th>
                      <th style="min-width: 170px">単価</th>
                      <th style="min-width: 205px">数量</th>
                      <th style="min-width: 131px">小計</th>
                    </tr>
                  </thead>

                  <tbody>
                    <template v-if="costState?.adProjectRevenueItems.length > 0">
                      <tr
                        v-for="cost in costState?.adProjectRevenueItems"
                        :key="cost.id"
                        :class="cost.checked && 'isCheckedRow'"
                      >
                        <!-- item -->
                        <td>
                          <a-space>
                            <a-checkbox v-model:checked="cost.checked" />

                            <a-select
                              v-model:value="cost.itemId"
                              style="width: 154px"
                              show-arrow
                              :default-active-first-option="false"
                            >
                              <a-select-option
                                v-for="revenueItem in revenueItemList"
                                :key="revenueItem.id"
                                :value="revenueItem.id"
                                >{{ revenueItem.name }}</a-select-option
                              >
                            </a-select>
                          </a-space>
                        </td>

                        <!-- expense item -->
                        <td>
                          <a-select
                            v-model:value="cost.expenseItemId"
                            style="width: 154px"
                            show-arrow
                            :default-active-first-option="false"
                          >
                            <a-select-option
                              v-for="expenseItem in revenueExpenseItemList"
                              :key="expenseItem.id"
                              :value="expenseItem.id"
                              >{{ expenseItem.name }}</a-select-option
                            >
                          </a-select>
                        </td>

                        <!-- overview -->
                        <td>
                          <a-input v-model:value="cost.overview" placeholder="概要・備考" />
                        </td>

                        <!-- unit price -->
                        <td>
                          <a-space v-if="!cost.isEditUnitPrice">
                            <EditLargeIcon style="cursor: pointer" @click="handleClickEditUnitPrice(cost.id)" />
                            <span>{{ $filters.number_with_commas(cost.unitPrice) }}</span>
                          </a-space>

                          <a-input-number
                            v-else
                            v-model:value="cost.unitPrice"
                            :auto-focus="true"
                            placeholder="0"
                            style="width: 130px"
                            :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="0"
                            :min="0"
                            :max="999999999999"
                            @blur="handleBlurEditUnitPrice(cost.id)"
                          />
                        </td>

                        <!-- quantity -->
                        <td>
                          <a-space>
                            <a-input-number
                              v-model:value="cost.quantity"
                              style="width: 130px"
                              placeholder="0"
                              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                              :precision="0"
                              :min="0"
                              :max="999999999999"
                            />

                            <a-select
                              v-model:value="cost.quantityUnitId"
                              style="width: 154px"
                              show-arrow
                              :default-active-first-option="false"
                            >
                              <a-select-option
                                v-for="quantity in revenueQuantityUnit"
                                :key="quantity.id"
                                :value="quantity.id"
                                >{{ quantity.name }}</a-select-option
                              >
                            </a-select>
                          </a-space>
                        </td>

                        <!-- sub total -->
                        <td>
                          {{ $filters.number_with_commas(cost.unitPrice * cost.quantity) }}
                        </td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="8">該当データなし</td>
                    </tr>
                  </tbody>
                </table>
              </a-tab-pane>
            </a-tabs>

            <!-- button add row -->
            <a-button size="small" class="u-mt-24" @click="handleAddCost">
              <template #icon>
                <span class="btn-icon"><line-add-icon /></span>
              </template>
              見積項目を追加
            </a-button>

            <div class="u-text-right u-mt-28">
              <a-select v-model:value="costState.taxMethod" show-arrow class="u-ml-8">
                <a-select-option :value="TAX_TYPES.SALE">消費税: 10%</a-select-option>
                <a-select-option :value="TAX_TYPES.VAT">VAT: 10%</a-select-option>
                <a-select-option :value="TAX_TYPES.NONE">無し</a-select-option>
              </a-select>
            </div>

            <div class="revenue-modal__count">
              <table>
                <tbody>
                  <tr>
                    <td>合計:</td>
                    <td class="u-pl-12">
                      {{ $filters.number_with_commas(totalCostItems) }} ({{ selectCurrencyCode.toUpperCase() }})
                    </td>
                  </tr>

                  <tr>
                    <td>税金:</td>
                    <td class="u-pl-12">
                      {{
                        costState.taxMethod === 3
                          ? '-'
                          : `${$filters.number_with_commas(totalCostItems * 0.1)} ${selectCurrencyCode.toUpperCase()}`
                      }}
                    </td>
                  </tr>

                  <tr>
                    <td>合計（税込):</td>
                    <td v-if="costState.taxMethod === 3" class="u-pl-12">
                      {{ $filters.number_with_commas(totalCostItems) }} ({{ selectCurrencyCode.toUpperCase() }})
                    </td>

                    <td v-else class="u-pl-12">
                      {{ $filters.number_with_commas(totalCostItems + totalCostItems * 0.1) }} ({{
                        selectCurrencyCode.toUpperCase()
                      }})
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="revenue-modal__extra-info">
              <div class="revenue-modal__extra-info--left">
                <table>
                  <tbody>
                    <!-- memo -->
                    <tr>
                      <td>備考 / メモ</td>
                      <td>
                        <a-textarea
                          v-model:value="costState.memo"
                          style="width: 356px"
                          placeholder="入力してください"
                          allow-clear
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>請求元</td>

                      <td>
                        <a-select
                          v-model:value="costState.groupId"
                          style="width: 356px"
                          show-arrow
                          :default-active-first-option="false"
                        >
                          <a-select-option v-for="group in dataGroups" :key="group.id" :value="group.id">
                            {{ group.name }}
                          </a-select-option>
                        </a-select>
                      </td>
                    </tr>

                    <tr>
                      <td>請求先</td>
                      <td>
                        <a-input
                          v-model:value="costState.billingAddress"
                          style="width: 356px"
                          placeholder="会社名（デフォルトで入力済み・変更可）"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>件名</td>
                      <td>
                        <a-input
                          v-model:value="costState.projectName"
                          style="width: 356px"
                          placeholder="件名（デフォルトで入力済み・変更可）"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>見積作成日</td>
                      <td>
                        <a-month-picker
                          v-model:value="costState.dateCreateEstimate"
                          :style="{ width: '147px' }"
                          format="YYYY/MM"
                          placeholder="YYYY/MM"
                        >
                          <template #suffixIcon>
                            <calendar-outlined />
                          </template>
                        </a-month-picker>
                      </td>
                    </tr>
                    <tr>
                      <td>納品期日</td>
                      <td>
                        <a-month-picker
                          v-model:value="costState.deliveryDate"
                          :style="{ width: '147px' }"
                          format="YYYY/MM"
                          placeholder="YYYY/MM"
                        >
                          <template #suffixIcon>
                            <calendar-outlined />
                          </template>
                        </a-month-picker>
                      </td>
                    </tr>
                    <tr>
                      <td>見積書の有効期間</td>
                      <td>
                        <a-space>
                          <a-radio-group v-model:value="costState.quotationValidityPeriod">
                            <a-radio :value="1">1ヶ月</a-radio>
                            <a-radio :value="2">3ヶ月</a-radio>
                            <a-radio :value="3">6ヶ月</a-radio>
                            <a-radio :value="4">1年</a-radio>
                            <a-radio :value="5">その他</a-radio>
                          </a-radio-group>
                          <a-input
                            v-model:value="costState.quotationValidityPeriodOther"
                            :disabled="costState.quotationValidityPeriod !== 5"
                            style="width: 216px"
                            placeholder="入力してください"
                          />
                        </a-space>
                      </td>
                    </tr>

                    <tr>
                      <td>支払条件</td>
                      <td>
                        <a-radio-group v-model:value="costState.paymentTerm">
                          <a-radio :value="1">銀行振込</a-radio>
                          <a-radio :value="2">現金</a-radio>
                          <a-radio :value="3">小切手または手形</a-radio>
                          <a-radio :value="4">貴社支払規定による</a-radio>
                        </a-radio-group>
                      </td>
                    </tr>

                    <tr>
                      <td>担当者</td>
                      <td>
                        <a-select
                          v-model:value="costState.accountId"
                          style="width: 356px"
                          show-arrow
                          :default-active-first-option="false"
                        >
                          <a-select-option v-for="account in dataAccounts" :key="account.id" :value="account.id">
                            {{ account.fullname }}
                          </a-select-option>
                        </a-select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="revenue-modal__extra-info--right">
                <div class="history-download">
                  <p class="history-download__head">出力済み見積書</p>

                  <div class="history-download__body">
                    <p class="u-py-16">該当データなし</p>
                    <!-- <div class="history-download__item">
                    <strong>2021/10/01 - 07:45</strong>
                    <p>YYYYMMDD_GXX-YYYY-ZZZ.pdf</p>
                  </div>
                  <div class="history-download__item">
                    <strong>2021/10/01 - 07:45</strong>
                    <p>YYYYMMDD_GXX-YYYY-ZZZ.pdf</p>
                  </div>
                  <div class="history-download__item">
                    <strong>2021/10/01 - 07:45</strong>
                    <p>YYYYMMDD_GXX-YYYY-ZZZ.pdf</p>
                  </div> -->
                  </div>
                </div>
              </div>
            </div>

            <div class="revenue-modal__submit-buttons">
              <a-button @click="handleCancel">キャンセル</a-button>
              <a-button
                :disabled="isHaveNoChangeCostState"
                :loading="isSubmitLoading"
                type="primary"
                class="u-ml-8"
                @click="handleSubmit"
                >登録</a-button
              >
            </div>
          </div>
        </a-spin>
      </div>
    </template>
    <ConfirmSubmitModal
      v-model:visible="isVisibleModalConfirmSubmit"
      @on-confirm="handleConfirmSubmitModal"
      @on-cancel="hanleCancelConfirmSubmitModal"
    />
    <ConfirmCloneModal v-model:visible="isVisibleModalConfirmClone" @on-confirm="handleConfirmCloneModal" />
  </a-modal>
</template>

<script>
import { computed, defineComponent, onBeforeMount, onMounted, onUnmounted, reactive, ref, toRefs, watch } from 'vue'
import DeleteWhiteIcon from '@/assets/icons/ico_delete_white.svg'
import { PROJECT_REVENUE_TYPES, PROJECT_TYPES } from '@/enums/project.enum'
import CopyIcon from '@/assets/icons/ico_copy.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'
import EditLargeIcon from '@/assets/icons/ico_edit_large.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import { getRevenueProject, upsertRevenueProject, deleteRevenueItem, createRevenue } from '../../composables/useProject'
import { getRevenueItemList, getRevenueExpenseItem, getRevenueQuantityUnit } from '../../composables/useRevenue'
import { useRoute } from 'vue-router'
import { fromStringToDateTimeFormatPicker } from '@/helpers/date-time-format'
import { findIndex, uniqueId, find, cloneDeep, isEqual } from 'lodash-es'
import moment from 'moment'
import ConfirmSubmitModal from './ConfirmSubmitModal.vue'
import ConfirmCloneModal from './ConfirmCloneModal.vue'
import { TAX_TYPES } from '@/enums/project.enum'

export default defineComponent({
  name: 'RevenueModal',

  components: {
    DeleteWhiteIcon,
    CopyIcon,
    CalendarOutlined,
    EditLargeIcon,
    LineAddIcon,
    ConfirmSubmitModal,
    ConfirmCloneModal
  },

  props: {
    project: Object,
    currencyList: Array,
    currencyExchange: Object,
    dataAccounts: Array,
    dataGroups: Array
  },

  emits: ['update:visible', 'on-submit-revenue-modal'],

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
    const initialCostState = {
      id: null,
      accountId: null,
      adProjectRevenueItems: [],
      billingAddress: null,
      currencyId: null,
      dateCreateEstimate: null,
      deliveryDate: null,
      groupId: null,
      memo: null,
      month: null,
      paymentTerm: null,
      projectCostsType: null,
      projectId,
      projectName: null,
      quotationValidityPeriod: 1,
      quotationValidityPeriodOther: null,
      total: null,
      tax: 1,
      taxMethod: TAX_TYPES.SALE
    }
    const costState = ref({ ...cloneDeep(initialCostState), projectCostsType: activeKey.value })
    const isLoadingDataTable = ref()
    const UNIQUE_ID_PREFIX = '__cost__'
    const currencyExchange = computed(() => props.currencyExchange)
    const currencyExchangeSelected = ref()
    const filterMonth = ref(
      moment(new Date()).endOf('month') > moment(props.project?.value?.statisticsToMonth).endOf('month') ||
        moment(new Date()).endOf('month') < moment(props.project?.value?.statisticsFromMonth).endOf('month')
        ? moment(props.project?.value?.statisticsFromMonth)
        : fromStringToDateTimeFormatPicker(moment(new Date()).format('YYYY-MM'))
    )
    const costStateToCompare = ref({})
    const isSubmitLoading = ref()
    const isVisibleModalConfirmSubmit = ref()
    const isVisibleModalConfirmClone = ref()
    const revenueItemList = ref([])
    const revenueExpenseItemList = ref([])
    const revenueQuantityUnit = ref([])
    const totalCostItems = computed(() => {
      let count = 0

      costState.value?.adProjectRevenueItems.forEach((item) => {
        count +=
          item?.unitPrice * item?.quantity * currencyExchange.value[initialCurrencyCode.value][selectCurrencyCode.value]
      })

      return count
    })
    const initialCurrencyCode = computed(() => {
      const o = find(currencyList.value, { id: costState.value.currencyId })
      const newStr = lowerCaseFirstLetter(o?.code)
      return newStr
    })
    const selectCurrencyCode = computed(() => {
      const o = find(currencyList.value, { id: currencyExchangeSelected.value })
      const newStr = lowerCaseFirstLetter(o?.code)

      return newStr
    })
    const state = reactive({
      indeterminate: false,
      checkAll: false
    })
    const checkedList = computed(() =>
      costState.value.adProjectRevenueItems.filter((item) => item.checked).map((item) => item.id)
    )
    const isHaveNoChangeCostState = computed(() => isEqual(costState.value, costStateToCompare.value))
    const costDeleteList = ref([])
    const costStateToClone = ref([])
    const nextTab = ref()
    const purposeConfirm = ref()
    const prevMonthFilter = ref()

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

    const onCheckAllChange = (e) => {
      Object.assign(state, {
        indeterminate: false
      })

      if (e.target.checked) {
        costState.value.adProjectRevenueItems.forEach((item) => (item.checked = true))
      } else {
        costState.value.adProjectRevenueItems.forEach((item) => (item.checked = false))
      }
    }

    watch(
      () => checkedList.value,
      (val) => {
        state.indeterminate =
          !!val.length && val.length > 0 && val.length < costState.value?.adProjectRevenueItems?.length
        state.checkAll = !!val.length && val.length === costState.value?.adProjectRevenueItems?.length
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

    const handleClickEditUnitPrice = (id) => {
      const costIndex = findIndex(costState.value?.adProjectRevenueItems, { id })

      costState.value.adProjectRevenueItems[costIndex].isEditUnitPrice = true
    }

    const handleAddCost = () => {
      costState.value.adProjectRevenueItems = [
        ...costState.value.adProjectRevenueItems,
        {
          projectId,
          positionId: null,
          itemId: null,
          id: uniqueId(UNIQUE_ID_PREFIX),
          expenseItemId: null,
          overview: null,
          unitPrice: null,
          quantity: null,
          quantityUnitId: null,
          projectCostsType: Number(activeKey.value)
        }
      ]
    }

    const handleDeleteCostItem = () => {
      checkedList.value.forEach((id) => {
        if (id.toString().indexOf(UNIQUE_ID_PREFIX) === -1) {
          costDeleteList.value = [...costDeleteList.value, id]
        }

        costState.value.adProjectRevenueItems = costState.value.adProjectRevenueItems.filter((item) => item.id !== id)
      })
    }

    const cloneCostState = () => {
      costState.value.adProjectRevenueItems.forEach((cost) => {
        if (cost.id.toString().indexOf(UNIQUE_ID_PREFIX) === -1) {
          costDeleteList.value = [...costDeleteList.value, cost.id]
        }
      })

      costState.value.adProjectRevenueItems = costStateToClone.value.map((cost) => ({
        ...cost,
        id: uniqueId(UNIQUE_ID_PREFIX),
        projectCostsType: 2
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

    const fetchRevenueProject = async (type = activeKey.value, month = filterMonth.value) => {
      isLoadingDataTable.value = true

      try {
        const { result } = await getRevenueProject({
          projectId,
          month: props.project.value?.type === PROJECT_TYPES[1].value ? moment(month).format('YYYY-MM') : null,
          projectCostsType: type
        })

        if (result.data.length > 0) {
          costState.value = cloneDeep(result.data[0])
        } else {
          costState.value = { ...cloneDeep(initialCostState), projectCostsType: activeKey.value }
        }

        costState.value = {
          ...costState.value,
          dateCreateEstimate: fromStringToDateTimeFormatPicker(costState.value.dateCreateEstimate),
          deliveryDate: fromStringToDateTimeFormatPicker(costState.value.deliveryDate),
          // TODO: fix initial currency id of quantity
          currencyId: costState.value?.currencyId ? costState.value.currencyId : props.project.value?.currencyId
        }

        costState.value.adProjectRevenueItems = costState.value.adProjectRevenueItems.map((item) => ({
          ...item,
          checked: false,
          isEditUnitPrice: false
        }))

        // create default items
        if (costState.value.adProjectRevenueItems.length < 10) {
          costState.value.adProjectRevenueItems = costState.value.adProjectRevenueItems.concat(
            new Array(10 - costState.value.adProjectRevenueItems.length).fill(undefined).map(() => ({
              projectId,
              positionId: null,
              itemId: null,
              id: uniqueId(UNIQUE_ID_PREFIX),
              expenseItemId: null,
              overview: null,
              unitPrice: null,
              quantity: null,
              quantityUnitId: null,
              checked: false,
              isEditUnitPrice: false,
              projectCostsType: Number(activeKey.value)
            }))
          )
        }

        costStateToCompare.value = cloneDeep(costState.value)
        if (type === '1') costStateToClone.value = cloneDeep(costState.value.adProjectRevenueItems)

        // initial currency of filter select currency
        currencyExchangeSelected.value = costState.value?.currencyId
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const tabClick = (val) => {
      if (isHaveNoChangeCostState.value) {
        fetchRevenueProject(val, filterMonth.value)
        activeKey.value = val
      } else {
        isVisibleModalConfirmSubmit.value = true
        nextTab.value = val
        purposeConfirm.value = 'change-tab'
      }
    }

    const handleConfirmSubmitModal = () => {
      isVisibleModalConfirmSubmit.value = false

      if (purposeConfirm.value === 'change-tab') {
        fetchRevenueProject(nextTab.value, filterMonth.value)
        activeKey.value = nextTab.value
      } else if (purposeConfirm.value === 'close-modal') {
        emit('update:visible', false)
      } else if (purposeConfirm.value === 'change-month') {
        fetchRevenueProject(activeKey.value, filterMonth.value)
      }
    }

    const hanleCancelConfirmSubmitModal = () => {
      if (prevMonthFilter.value) filterMonth.value = prevMonthFilter.value
      prevMonthFilter.value = null
    }

    const handleFilterMonth = (val) => {
      if (isHaveNoChangeCostState.value) {
        fetchRevenueProject(activeKey.value, val)
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

    const handleSubmit = async () => {
      if (isHaveNoChangeCostState.value) return
      isSubmitLoading.value = true

      const dataRequest = cloneDeep(costState.value)

      if (dataRequest.quotationValidityPeriod !== 5) dataRequest.quotationValidityPeriodOther = null
      dataRequest.projectCostsType = Number(dataRequest.projectCostsType)
      dataRequest.currencyId = currencyExchangeSelected.value
      dataRequest.tax = dataRequest.taxMethod === TAX_TYPES.NONE ? 0 : 10
      dataRequest.deliveryDate = dataRequest.deliveryDate ? moment(dataRequest.deliveryDate).format('YYYY-MM-DD') : null
      dataRequest.dateCreateEstimate = dataRequest.dateCreateEstimate
        ? moment(dataRequest.dateCreateEstimate).format('YYYY-MM-DD')
        : null
      dataRequest.month =
        props.project.value?.type === PROJECT_TYPES[1].value ? moment(filterMonth.value).format('YYYY-MM-DD') : null
      delete dataRequest.total
      dataRequest.adProjectRevenueItems.forEach((item) => {
        delete item.projectCostsType
        delete item.subtotal
        delete item.projectId
        delete item.isEditUnitPrice
        delete item.checked
        delete item.projectRevenueId
        if (item.id && item.id.toString().indexOf(UNIQUE_ID_PREFIX) === 0) delete item.id
      })

      dataRequest.adProjectRevenueItems = dataRequest.adProjectRevenueItems.filter(
        (item) =>
          item.expenseItemId ||
          item.itemId ||
          item.overview ||
          item.positionId ||
          item.quantity ||
          item.quantityUnitId ||
          item.unitPrice
      )

      try {
        if (!dataRequest.id) {
          delete dataRequest.id
          await createRevenue(dataRequest)
        } else {
          if (costDeleteList.value.length > 0) {
            await deleteRevenueItem({ id: costDeleteList.value })
            costDeleteList.value = []
          }
          await upsertRevenueProject(dataRequest)
        }

        await fetchRevenueProject(activeKey.value, filterMonth.value)

        costStateToCompare.value = cloneDeep(costState.value)
        costStateToClone.value = cloneDeep(costState.value.adProjectRevenueItems)

        emit('on-submit-revenue-modal')
      } finally {
        isSubmitLoading.value = false
      }
    }

    const handleBlurEditUnitPrice = (id) => {
      const costIndex = findIndex(costState.value?.adProjectRevenueItems, { id })

      costState.value.adProjectRevenueItems[costIndex].isEditUnitPrice = false
    }

    onBeforeMount(async () => {
      // get revenue item
      const { result: revenueItemRes } = await getRevenueItemList()
      revenueItemList.value = revenueItemRes.data

      // get revenue expense item
      const {
        result: { data: revenueExpenseItemListRes }
      } = await getRevenueExpenseItem()
      revenueExpenseItemList.value = revenueExpenseItemListRes

      // get revenue quantity
      const {
        result: { data: revenueQuantityUnitRes }
      } = await getRevenueQuantityUnit()
      revenueQuantityUnit.value = revenueQuantityUnitRes

      await fetchRevenueProject()
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
      visible,
      activeKey,
      PROJECT_REVENUE_TYPES,
      PROJECT_TYPES,
      costState,
      isLoadingDataTable,
      ...toRefs(state),
      checkedList,
      selectCurrencyCode,
      initialCurrencyCode,
      currencyExchangeSelected,
      totalCostItems,
      isSubmitLoading,
      costStateToCompare,
      isVisibleModalConfirmSubmit,
      revenueItemList,
      revenueExpenseItemList,
      revenueQuantityUnit,
      isVisibleModalConfirmClone,
      costStateToClone,
      isHaveNoChangeCostState,
      disabledDate,
      TAX_TYPES,

      handleCancel,
      handleClickEditUnitPrice,
      handleAddCost,
      onCheckAllChange,
      handleDeleteCostItem,
      lowerCaseFirstLetter,
      tabClick,
      handleSubmit,
      filterMonth,
      handleBlurEditUnitPrice,
      handleConfirmSubmitModal,
      handleCloneCostState,
      handleConfirmCloneModal,
      handleFilterMonth,
      hanleCancelConfirmSubmitModal
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.revenue-modal {
  .ant-modal-footer {
    background-color: $color-grey-96;
    max-height: 80vh;
    overflow-y: scroll;
  }

  &__wrapper {
    text-align: left;
  }

  &__delete-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 40px;
  }

  &__filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
  }

  &__count {
    display: flex;
    justify-content: flex-end;
    text-align: right;
    margin: 24px 0;
    padding: 12px 0;
    border-top: 1px dashed $color-grey-85;
    border-bottom: 1px dashed $color-grey-85;
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

  &__extra-info {
    display: flex;
    gap: 52px;
    overflow-x: auto;

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: $color-grey-55;
      opacity: 0.7;
      background-clip: padding-box;
    }

    &--left {
      flex-basis: 60%;

      table {
        width: 100%;

        td {
          padding: 12px;
          white-space: nowrap;
          vertical-align: top;
        }
      }
    }

    &--right {
      flex-basis: 40%;
      min-width: 335px;
    }
  }

  &__submit-buttons {
    text-align: center;
    margin-top: 24px;
    margin-bottom: 16px;
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

  .history-download {
    margin-top: 12px;
    border: 1px solid $color-grey-85;
    height: auto;

    p {
      margin-bottom: 0;
    }

    &__head {
      background-color: $color-grey-92;
      padding: 12px 12px 12px 32px;
      font-size: 16px;
      font-weight: 700;
      color: $color-grey-15;
    }

    &__body {
      background-color: $color-grey-94;
      padding: 0 32px;
    }

    &__item {
      padding: 16px 0 16px 0;
      font-size: 12px;

      p {
        color: $color-primary-6;
      }

      & + .history-download__item {
        border-top: 1px dashed $color-grey-85;
      }
    }
  }
}
</style>
