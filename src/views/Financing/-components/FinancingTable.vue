<template>
  <a-table
    id="financing__table"
    :loading="isLoadingDataTable"
    :columns="columnsFinancing"
    :data-source="dataFinancing"
    :locale="emptyTextHTML"
    size="middle"
    :scroll="{ y: height - 274 }"
    :row-key="(record) => record.date"
    :pagination="false"
    @change="changeFinancingTable"
  >
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
    <template #totalMoney="{ text, record }">
      <span v-if="text.warnings">
        <a-tooltip v-if="text.warnings.length > 0" placement="topRight" :title="dataToolTip(text)">
          <a
            class="ant-dropdown-link"
            :class="parseInt(text.money) < 0 ? 'text--red' : 'text--warning'"
            @click="handlePageRedirect(record)"
          >
            <icon-warnings class="icon-warning" />
            {{ $filters.number_with_commas(text.money) }}
          </a>
        </a-tooltip>
        <a
          v-else
          class="ant-dropdown-link"
          :class="parseInt(text.money) < 0 ? 'text--red' : ''"
          @click="handlePageRedirect(record)"
        >
          {{ $filters.number_with_commas(text.money) }}
        </a>
      </span>
      <span v-else>
        <a
          class="ant-dropdown-link"
          :class="parseInt(text.money) < 0 ? 'text--red' : ''"
          @click="handlePageRedirect(record)"
        >
          {{ $filters.number_with_commas(text.money) }}
        </a>
      </span>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, onBeforeMount, onUnmounted, ref } from 'vue'
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
    isLoadingDataTable: Boolean
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore()

    const emptyTextHTML = ref({})
    const height = ref(0)

    emptyTextHTML.value = {
      emptyText: (
        <div class="ant-empty ant-empty-normal ant-empty-description"> {t('financing.financing_list.emptyData')}</div>
      )
    }

    const getInnerHeight = () => {
      height.value = window.innerHeight
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
    const handlePageRedirect = (record, column) => {
      let columnBankAccountsId = column.key.split('_')[1]
      let bankAccountsId =
        props.dataRequest.data?.bank_account_ids.length > 0
          ? props.dataRequest.data.bank_account_ids
          : [parseInt(columnBankAccountsId)]

      const data = {
        groupId: props.dataRequest.data.group_id,
        bankAccountId: bankAccountsId,
        fromDate: record?.date ? moment(record.date).format('YYYY-MM-DD') : null,
        toDate: record?.date ? moment(record.date).format('YYYY-MM-DD') : null
      }

      store.commit('deposit/STORE_DEPOSIT_FILTER', { data })
      router.push({ name: 'deposit' })
    }

    const changeFinancingTable = (pagination, filters, sorter) => {
      const emitData = {
        orderBy: toOrderBy(sorter.order),
        field: humps.decamelize(sorter.field)
      }

      emit('on-sort', emitData)
    }

    onBeforeMount(() => {
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getInnerHeight)
    })

    return {
      t,
      useRoute,
      emptyTextHTML,
      height,
      dataToolTip,
      showToolTipData,
      handlePageRedirect,
      changeFinancingTable
    }
  }
})
</script>

<style scoped lang="scss"></style>
