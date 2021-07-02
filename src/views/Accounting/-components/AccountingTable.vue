<template>
  <a-table
    ref="accountingTableRef"
    class="accounting-table -mx-32"
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="dataTable"
    :pagination="false"
    :locale="localeTable"
    :scroll="{ x: 1500, y: 200 }"
  >
    <template #month="{ record, index, text, column }">
      <router-link
        v-if="index + 1 !== dataTable.length"
        :to="{ name: 'deposit', query: { tab: groupId } }"
        :class="['accounting-table__link', moneyColor]"
        @click="handleSelectDeposit(record, column)"
      >
        {{ $filters.number_with_commas(text) }}
      </router-link>
      <p v-else :class="moneyColor">{{ $filters.number_with_commas(text) }}</p>
    </template>

    <template #expandIcon="{ expanded }">
      <ArrowDownIcon v-if="expanded" />
      <ArrowUpIcon v-else />
    </template>
  </a-table>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import { debounce } from 'lodash-es'
// import { useI18n } from 'vue-i18n'

import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'
import ArrowUpIcon from '@/assets/icons/ico_arrow_up.svg'

export default defineComponent({
  name: 'AccountingTable',

  components: {
    ArrowDownIcon,
    ArrowUpIcon
  },

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
      type: Number,
      required: true
    },
    groupId: {
      type: Number,
      required: true
    },
    dataSource: {
      type: Object,
      required: true
    },
    moneyColor: {
      type: String,
      default: ''
    }
  },

  emits: ['getPixelsScrolled'],

  setup(props, { emit }) {
    const store = useStore()
    // const { t } = useI18n()

    const accountingTableRef = ref()
    const tableBodyRef = ref()

    const localeTable = {
      emptyText: '該当するデータが見つかりませんでした。'
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
          title: monthStr,
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
        const row = {
          key: category?.categoryId,
          categoryName: category?.categoryName || '',
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
              key: item.subcategoryId,
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
      const totalRow = {
        key: 'total',
        categoryName: 'total'
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
        categoryId: record?.categoryId || [],
        subcategoryId: record?.subcategoryId || [],
        fromDate: column?.dataIndex ? moment(column.dataIndex).startOf('month').format('YYYY-MM-DD') : null,
        toDate: column?.dataIndex ? moment(column.dataIndex).endOf('month').format('YYYY-MM-DD') : null
      }
      store.commit('deposit/STORE_DEPOSIT_FILTER', { data })
    }

    function updatePixelsScrolled() {
      const el = this
      if (!el) return

      const tableIndex = el.getAttribute('accounting-table-index')
      const pixelsScrolled = el.scrollLeft

      emit('getPixelsScrolled', { tableIndex: tableIndex, pixel: pixelsScrolled })
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
}
</style>
