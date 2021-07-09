<template>
  <a-table
    ref="accountingTableRef"
    class="accounting-table"
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataTable"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 1500 }"
  >
    <template #month="{ record, index, text, column }">
      <router-link
        v-if="index + 1 !== dataTable.length && !disableGoToDeposit"
        :to="{ name: 'deposit', query: { tab: groupId } }"
        :class="['accounting-table__link', moneyColor]"
        @click="handleSelectDeposit(record, column)"
      >
        {{ $filters.number_with_commas(text) }}
      </router-link>
      <p v-else :class="moneyColor">{{ $filters.number_with_commas(text) }}</p>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import { debounce, uniqueId } from 'lodash-es'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AccountingTable',

  props: {
    isLoadingTable: Boolean,
    tableIndex: {
      type: Number,
      required: true
    },
    pixelsScrolled: {
      type: Number,
      default: 0
    },
    tableIndexDisableScroll: {
      validator: (value) => ['number', 'undefined'].indexOf(typeof value) !== -1,
      required: true
    },
    groupId: {
      validator: (value) => ['number', 'undefined'].indexOf(typeof value) !== -1,
      required: true
    },
    dataSource: {
      type: Object,
      required: true
    },
    moneyColor: {
      type: String,
      default: ''
    },
    disableGoToDeposit: {
      type: Boolean,
      default: false
    }
  },

  emits: ['getPixelsScrolled'],

  setup(props, { emit }) {
    const store = useStore()
    const { t } = useI18n()

    const accountingTableRef = ref()
    const tableBodyRef = ref()

    const localeTable = {
      emptyText: t('accounting.empty_text_table')
    }

    const monthStrFormat = (val) => moment(val).format('YYYY-MM')

    const columns = computed(() => {
      const arr = [
        {
          title: '',
          width: 200,
          dataIndex: 'categoryName',
          key: 'categoryName',
          fixed: 'left',
          slots: { customRender: 'categoryName' }
        }
      ]

      const { monthFrom = '', monthTo = '' } = props.dataSource
      if (!monthFrom || !monthTo) return arr

      const startTime = moment(monthFrom)
      const endTime = moment(monthTo)
      let month = startTime.clone()

      while (month <= endTime && arr.length < 9999) {
        const monthStr = monthStrFormat(month)
        arr.push({
          title: moment(month).format('MMMM'),
          dataIndex: monthStr,
          key: monthStr,
          width: 150,
          slots: { customRender: 'month' }
        })

        month = month.clone().add(1, 'M')
      }

      return arr
    })

    const dataTable = computed(() => {
      const arr = []

      const { detail = [], total = [] } = props.dataSource
      if (detail.length === 0) return arr

      detail.map((category) => {
        const categoryName = category?.name ? t(`accounting.${category?.name}`) : category?.categoryName || ''

        const row = {
          key: uniqueId('__row__'),
          divisionType: category?.divisionType,
          categoryName,
          categoryId: [category?.categoryId],
          subcategoryId: []
        }

        // add month data
        ;(category?.data || []).map((categoryMonth) => {
          const monthStr = monthStrFormat(categoryMonth.month)
          row[monthStr] = categoryMonth.money
        })

        const subcategories = category?.subcategories || []
        if (subcategories.length > 0) {
          row.children = []

          subcategories.map((item) => {
            const childrenItem = {
              key: uniqueId('__row__'),
              divisionType: category?.divisionType,
              categoryName: item?.subcategoryName,
              categoryId: [category?.categoryId],
              subcategoryId: [item.subcategoryId]
            }

            ;(item?.data || []).map((subData) => {
              const monthStr = monthStrFormat(subData.month)
              childrenItem[monthStr] = subData.money
            })

            row.children.push(childrenItem)
          })
        }

        arr.push(row)
      })

      // add total row
      if (total.length === 0) return arr
      const totalRow = {
        key: 'total',
        categoryName: '合計'
      }
      total.map((item) => {
        const monthStr = monthStrFormat(item.month)
        totalRow[monthStr] = item.money
      })
      arr.push(totalRow)

      return arr
    })

    // update modal search deposit
    const handleSelectDeposit = (record, column) => {
      const data = {
        groupId: props.groupId,
        type: record?.divisionType ? [record.divisionType] : [],
        categoryId: record?.categoryId || [],
        subcategoryId: record?.subcategoryId || [],
        statisticsFrom: column?.dataIndex ? moment(column.dataIndex).startOf('month').format('YYYY-MM-DD') : null,
        statisticsTo: column?.dataIndex ? moment(column.dataIndex).endOf('month').format('YYYY-MM-DD') : null
      }
      store.commit('deposit/STORE_DEPOSIT_FILTER', { data })
    }

    function updatePixelsScrolled() {
      const el = this
      if (!el) return

      const tableIndex = el.getAttribute('accounting-table-index')
      const pixelsScrolled = el.scrollLeft

      emit('getPixelsScrolled', { tableIndex: parseInt(tableIndex), pixel: pixelsScrolled })
    }

    onMounted(() => {
      const el = accountingTableRef.value?.$el
      if (!el) return
      const tableBody = el.querySelector('.ant-table-body')
      if (!tableBody) return

      tableBodyRef.value = tableBody
      tableBodyRef.value.setAttribute('accounting-table-index', props.tableIndex)
      tableBodyRef.value.addEventListener('scroll', debounce(updatePixelsScrolled, 100))
    })

    onUnmounted(() => {
      if (!tableBodyRef.value) return
      tableBodyRef.value.removeEventListener('scroll', updatePixelsScrolled)
    })

    watch(
      () => props.pixelsScrolled,
      () => {
        if (props.tableIndexDisableScroll === props.tableIndex) return
        if (!tableBodyRef.value) return

        tableBodyRef.value.scrollLeft = props.pixelsScrolled
      }
    )

    return {
      accountingTableRef,
      columns,
      dataTable,
      localeTable,

      handleSelectDeposit
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.accounting-table {
  &__link {
    &:hover {
      text-decoration: underline;
      color: inherit;
    }
  }

  .text-color-red {
    color: $color-additional-red-6;
  }

  .ant-table-placeholder {
    height: 200px;
    padding-top: 48px;
  }

  .ant-table-fixed-left {
    border-top: 1px solid #bfbfbf;

    .ant-table-row-cell-break-word:first-child {
      padding-left: 32px;
    }
  }

  .ant-table-row-cell-break-word {
    position: relative;

    .ant-table-row-expand-icon {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      margin-top: auto;
      margin-bottom: auto;
      height: 24px;
      width: 24px;
      background-color: transparent;
      border: 0;

      &:hover {
        border-color: none;
      }

      &:before,
      &:after {
        content: '';
        display: block;
        width: 10px;
        height: 1px;
        background: $color-grey-0;
        position: absolute;
        top: 10px;
        transition: transform 0.5s;
      }

      &:before {
        right: 9px;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        transform: rotate(45deg);
      }

      &:after {
        right: 3px;
        transform: rotate(-45deg);
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }

    .ant-table-row-expanded {
      &:before {
        transform: rotate(-45deg);
      }

      &:after {
        transform: rotate(45deg);
      }
    }
  }

  .ant-table-empty .ant-table-body {
    overflow-x: hidden !important;
  }
}
</style>
