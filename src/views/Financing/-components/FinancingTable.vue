<template>
  <a-table
    class="list-table"
    :loading="isLoadingDataTable"
    :columns="columnsFinancing"
    :data-source="dataFinancing"
    :locale="emptyTextHTML"
    size="middle"
    :scroll="{ y: height - 214 }"
    :row-key="(record) => record.date"
    @change="changeFinancingTable"
  >
    <template v-for="col in columnsNameList" #[col]="{ text, record }" :key="col">
      <span v-if="text.warnings">
        <a-tooltip placement="top" :title="dataToolTip(record)">
          <a
            class="ant-dropdown-link"
            :class="parseInt(text.money) < 0 ? 'text--red' : ''"
            @click="handlePageRedirect(text, record)"
          >
            {{ text.money }}
          </a>
        </a-tooltip>
      </span>
      <span v-else>
        <a
          class="ant-dropdown-link"
          :class="parseInt(text) < 0 ? 'text--red' : ''"
          @click="handlePageRedirect(text, record)"
        >
          {{ text }}
        </a>
      </span>
    </template>
    <template #balance="{ text, record }">
      <span v-if="text.warnings">
        <a-tooltip placement="topRight" :title="dataToolTip(record)">
          <a
            class="ant-dropdown-link"
            :class="parseInt(text) < 0 ? 'text--red' : ''"
            @click="handlePageRedirect(text, record)"
          >
            {{ $filters.number_with_commas(record.balance) }}
          </a>
        </a-tooltip>
      </span>
      <span v-else>
        <a
          class="ant-dropdown-link"
          :class="parseInt(text) < 0 ? 'text--red' : ''"
          @click="handlePageRedirect(text, record)"
        >
          {{ $filters.number_with_commas(record.balance) }}
        </a>
      </span>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, onBeforeMount, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import Table from '@/mixins/table.mixin'
import { toOrderBy } from '@/helpers/table'
import humps from 'humps'

export default defineComponent({
  name: 'FinancingTable',

  mixins: [Table],

  props: {
    currentSelectedRowKeys: Array,
    columnsFinancing: Array,
    columnsNameList: Array,
    dataFinancing: Array,
    isLoadingDataTable: Boolean
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const router = useRouter()

    const emptyTextHTML = ref({})
    const height = ref(0)

    emptyTextHTML.value = {
      emptyText: <div class="ant-empty ant-empty-normal ant-empty-description"> {t('financing.emptyData')}</div>
    }

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const dataToolTip = (record) => {
      return record.date + ': キャッシュアウト'
    }

    const handlePageRedirect = (balance, data) => {
      console.log(balance)
      console.log(data)
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
      handlePageRedirect,
      changeFinancingTable
    }
  }
})
</script>

<style scoped></style>
