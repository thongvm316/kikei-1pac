<template>
  <a-table
    id="financing__table"
    :loading="isLoadingDataTable"
    :columns="columnsFinancing"
    :data-source="dataFinancing"
    :locale="emptyTextHTML"
    size="middle"
    :scroll="scrollCustom"
    :row-key="(record) => record.date"
    :pagination="false"
    @change="changeFinancingTable"
  >
    <!-- custom column date -->
    <template #customDate="{ text }">
      <span>
        {{ handleDateColumn(text) }}
      </span>
    </template>
    <!-- ./custom column date -->
    <!-- custom column middle -->
    <template v-for="col in columnsNameList" #[col]="{ text, record, column }" :key="col">
      <span v-if="text.warnings">
        <a-tooltip v-if="text.warnings.length > 0" placement="top" :title="dataToolTip(text)">
          <a
            class="ant-dropdown-link"
            :class="parseInt(text.money) < 0 ? 'text--red' : 'text--warning'"
            @click="handlePageRedirect(record, column)"
          >
            <icon-warnings class="icon-warning" />
            {{ text.money }}
          </a>
        </a-tooltip>
        <a
          v-else
          class="ant-dropdown-link"
          :class="parseInt(text.money) < 0 ? 'text--red' : ''"
          @click="handlePageRedirect(record, column)"
        >
          {{ text.money }}
        </a>
      </span>
      <span v-else>
        <a
          class="ant-dropdown-link"
          :class="parseInt(text) < 0 ? 'text--red' : ''"
          @click="handlePageRedirect(record, column)"
        >
          {{ text }}
        </a>
      </span>
    </template>
    <!-- ./custom column middle -->
    <!-- custom column total -->
    <template #totalMoney="{ text, record }">
      <span v-if="text.warnings" :class="{ 'disabled-click': isDisabledEventClick }">
        <a-tooltip v-if="text.warnings.length > 0" placement="topRight" :title="dataToolTip(text)">
          <a
            class="ant-dropdown-link"
            :class="parseInt(text.money) < 0 ? 'text--red' : 'text--warning'"
            @click="handlePageRedirectTotal(record)"
          >
            <icon-warnings class="icon-warning" />
            {{ $filters.number_with_commas(text.money) }}
          </a>
        </a-tooltip>
        <a
          v-else
          class="ant-dropdown-link"
          :class="parseInt(text.money) < 0 ? 'text--red' : ''"
          @click="handlePageRedirectTotal(record)"
        >
          {{ $filters.number_with_commas(text.money) }}
        </a>
      </span>
      <span v-else :class="{ 'disabled-click': isDisabledEventClick }">
        <a
          class="ant-dropdown-link"
          :class="parseInt(text.money) < 0 ? 'text--red' : ''"
          @click="handlePageRedirectTotal(record)"
        >
          {{ $filters.number_with_commas(text.money) }}
        </a>
      </span>
    </template>
    <!-- ./custom column total -->
  </a-table>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import humps from 'humps'
import moment from 'moment'

import Table from '@/mixins/table.mixin'
import { toOrderBy } from '@/helpers/table'
import IconWarnings from '@/assets/icons/ico_warnings.svg'

export default defineComponent({
  name: 'FinancingTable',

  components: {
    IconWarnings
  },

  mixins: [Table],

  props: {
    dataRequest: {
      type: Object,
      required: true
    },
    columnsFinancing: {
      type: Array,
      required: true
    },
    columnsNameList: {
      type: Array,
      required: true
    },
    dataFinancing: {
      type: Array,
      required: true
    },
    scrollCustom: {
      type: Object,
      required: true
    },
    isLoadingDataTable: Boolean
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore()

    const fromDate = ref()
    const toDate = ref()
    const isDisabledEventClick = ref(false)
    const dataByDate = ref(true)
    const emptyTextHTML = ref({})
    const dataFilterRequest = ref({})

    emptyTextHTML.value = {
      emptyText: (
        <div class="ant-empty ant-empty-normal ant-empty-description"> {t('financing.financing_list.emptyData')}</div>
      )
    }

    const dataToolTip = (data) => {
      let date = moment(data.warnings[0]).format('YYYY/MM/DD')
      return date + ': キャッシュアウト'
    }

    const showToolTipData = (data) => {
      if (data?.warnings) {
        return data.warnings.length > 0
      } else {
        return false
      }
    }

    const handleDateColumn = (date) => {
      let showByMonth = props.dataRequest?.data?.show_by === 0
      if (showByMonth) {
        return moment(date).format('YYYY/MM')
      }
      return date
    }

    const handleDateFilterRequest = (data) => {
      let showBy = props.dataRequest.data.show_by
      if (parseInt(showBy) === 0) {
        // show by month
        fromDate.value = data?.date ? moment(data.date).startOf('month').format('YYYY-MM-DD') : null
        toDate.value = data?.date ? moment(data.date).endOf('month').format('YYYY-MM-DD') : null
      }
      if (parseInt(showBy) === 1) {
        // show by day
        fromDate.value = data?.date ? moment(data.date).format('YYYY-MM-DD') : null
        toDate.value = data?.date ? moment(data.date).format('YYYY-MM-DD') : null
      }
    }

    const handlePageRedirect = (record, column) => {
      dataFilterRequest.value = props.dataRequest.data

      let columnId = column.key.split('_')[1]
      let bankAccountsId =
        dataFilterRequest.value.bank_account_ids.length > 0
          ? dataFilterRequest.value.bank_account_ids
          : [parseInt(columnId)]

      let groupId = parseInt(columnId)
      if (dataFilterRequest.value.group_id) {
        groupId = dataFilterRequest.value.group_id
      } else {
        bankAccountsId = []
      }

      handleDateFilterRequest(record)

      const data = {
        groupId: groupId,
        bankAccountId: bankAccountsId,
        fromDate: fromDate.value,
        toDate: toDate.value
      }
      if (dataFilterRequest.value.group_id) {
        store.commit('deposit/STORE_DEPOSIT_FILTER', { data })
        router.push({ name: 'deposit' })
      } else {
        const newFilterRequest = {
          group_id: groupId,
          period_id: dataFilterRequest.value.period_id,
          from_date: record?.date ? moment(record.date).startOf('month').format('YYYY-MM-DD') : null,
          to_date: record?.date ? moment(record.date).endOf('month').format('YYYY-MM-DD') : null,
          show_by: 1,
          bank_account_ids: [],
          currency_code: null
        }
        store.commit('financing/STORE_FINANCING_FILTER', { newFilterRequest })
        emit('on-filter', newFilterRequest)
      }
    }

    const handlePageRedirectTotal = (record) => {
      let groupId = props.dataRequest.data.group_id
      handleDateFilterRequest(record)
      const data = {
        groupId: groupId,
        fromDate: fromDate.value,
        toDate: toDate.value
      }

      if (groupId) {
        store.commit('deposit/STORE_DEPOSIT_FILTER', { data })
        router.push({ name: 'deposit' })
      }
    }

    const changeFinancingTable = (pagination, filters, sorter) => {
      const emitData = {
        orderBy: toOrderBy(sorter.order),
        field: humps.decamelize(sorter.field)
      }

      emit('on-sort', emitData)
    }

    onMounted(() => {
      handleDateColumn()
    })

    watch(
      () => props.dataRequest,
      () => {
        isDisabledEventClick.value = !props.dataRequest.data.group_id
      }
    )

    return {
      t,
      useRoute,
      dataByDate,
      emptyTextHTML,
      isDisabledEventClick,
      dataToolTip,
      showToolTipData,
      handlePageRedirect,
      handlePageRedirectTotal,
      changeFinancingTable,
      handleDateFilterRequest,
      handleDateColumn
    }
  }
})
</script>

<style scoped lang="scss"></style>
