<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :row-key="(record) => record.periodName"
    :pagination="false"
    :scroll="{ y: 340 }"
    size="middle"
    table-layout="fixed"
  >
    <template #fiscalDateAndName="{ text: fiscalDateAndName }">
      <p style="margin-bottom: 0">
        {{ rowTablePeriod(fiscalDateAndName).startDate[0] }}<span>年</span
        >{{ rowTablePeriod(fiscalDateAndName).startDate[1] }}<span>月</span
        >{{ rowTablePeriod(fiscalDateAndName).startDate[2] }}<span>日</span>～{{
          rowTablePeriod(fiscalDateAndName).finishDate[0]
        }}<span>年</span>{{ rowTablePeriod(fiscalDateAndName).finishDate[1] }}<span>月</span
        >{{ rowTablePeriod(fiscalDateAndName).finishDate[2] }}<span>日</span>（<span>第</span
        >{{ rowTablePeriod(fiscalDateAndName).periodName }}<span>期</span>）
      </p>
    </template>
    <template #deposit="{ text: deposit }">
      {{ deposit.toLocaleString() }}
    </template>
    <template #targetMoney="{ text: targetMoney }">
      {{ targetMoney.toLocaleString() }}
    </template>
    <template #achievementRate="{ text: achievementRate }">
      <div class="columns-number">
        <p class="text-number" :style="{ color: tagsAction(achievementRate).backgroundColor }">
          {{ achievementRate }}%
        </p>
      </div>
    </template>
  </a-table>
</template>

<script>
import { computed, defineComponent, toRefs, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { split } from 'lodash-es'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'CompanyTableInfomation',

  props: {
    getDataTable: {
      type: [Array, Object],
      required: true,
      default: () => []
    }
  },

  setup(props) {
    const { t } = useI18n()
    const store = useStore()

    const { getDataTable } = toRefs(props)

    const dataSource = ref([])

    watch(getDataTable, (value) => {
      dataSource.value = value
    })

    const columns = computed(() => {
      return [
        {
          title: t('company_infomation.year_period'),
          dataIndex: 'fiscalDateAndName',
          width: 291,
          key: 'fiscalDateAndName',
          slots: { customRender: 'fiscalDateAndName' }
        },
        {
          title: t('company_infomation.target_money'),
          dataIndex: 'targetMoney',
          width: 160,
          key: 'targetMoney',
          slots: { customRender: 'targetMoney' }
        },
        {
          title: t('company_infomation.earnings'),
          dataIndex: 'deposit',
          width: 160,
          key: 'deposit',
          slots: { customRender: 'deposit' }
        },
        {
          title: t('company_infomation.achievement_rate'),
          dataIndex: 'achievementRate',
          width: 69,
          key: 'achievementRate',
          slots: { customRender: 'achievementRate' }
        }
      ]
    })

    const tagsAction = (number) => {
      if (number > 100) {
        return { backgroundColor: '#52C41A' }
      } else if (number < 100) {
        return { backgroundColor: '#F5222D' }
      } else {
        return { backgroundColor: '#262626' }
      }
    }

    const rowTablePeriod = (fiscalDateAndName) => {
      return {
        startDate: split(fiscalDateAndName[0], '-'),
        finishDate: split(fiscalDateAndName[1], '-'),
        periodName: fiscalDateAndName[2]
      }
    }

    watch(
      () => store.state.company.isCreate,
      () => {
        if (!store.state.company.isCreate) dataSource.value = []
      }
    )

    return {
      dataSource,
      columns,
      rowTablePeriod,
      tagsAction
    }
  }
})
</script>

<style scoped lang="scss">
.text-number {
  margin-bottom: 0;
}
</style>
