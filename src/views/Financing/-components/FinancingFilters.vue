<template></template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { remove } from 'lodash-es'
import { SHOW_BY } from '@/enums/financing.enum'

export default defineComponent({
  name: 'FinancingFilters',

  props: {
    period_id: Array,
    columnsFinancing: Array,
    dataFinancing: Array,
    isLoadingDataTable: Boolean,
    pagination: Object
  },

  setup(props, context) {
    const route = useRoute()
    const { t } = useI18n()

    const loading = ref(false)
    const groupList = ref([])
    const isDisabledStages = ref(true)
    const isDisabledDate = ref(true)
    let periodList = ref([])

    const initialStateFilter = {
      group_id: null,
      period_id: null,
      date_from_to: [],
      show_by: 0
    }

    const filter = reactive({ ...initialStateFilter })

    onMounted(async () => {
      groupList.value = [...route.meta['lists']]
    })

    // const visible = computed({
    //   get: () => store.state.search.currentRoute === route.name,
    //   set: (val) => {
    //     store.commit('search/STORE_SEARCH_CURRENT_ROUTE', val)
    //   }
    // })

    // const handleClear = () => {
    //   isNeedSubmit.value = !isEqual(filter, initialStateFilter)
    //   Object.assign(filter, initialStateFilter)
    // }

    // const handleChangeGroups = async (event) => {
    //   if (event) {
    //     const { getPeriods } = useGetPeriodListService(event)
    //     const { result } = await getPeriods()
    //
    //     periodList.value = result.data
    //     isDisabledStages.value = false
    //     isDisabledDate.value = false
    //   }
    // }

    const handleChangePeriod = async (event) => {
      if (event) {
        remove(filter.date_from_to)
      }
      isDisabledDate.value = !(typeof event === 'undefined' || event === 'null')
    }

    const onChangeDate = async (value, dateString) => {
      filter.date_from_to = dateString
    }

    const onSearch = () => {
      const data = {
        group_id: filter.group_id,
        period_id: filter.period_id,
        date_from_to: filter.date_from_to,
        show_by: filter.show_by
      }

      context.emit('filter-changed', data)
    }

    return {
      loading,
      t,
      groupList,
      periodList,
      filter,
      SHOW_BY,
      isDisabledStages,
      isDisabledDate,
      handleChangePeriod,
      onChangeDate,
      onSearch
    }
  }
})
</script>

<style scoped></style>
