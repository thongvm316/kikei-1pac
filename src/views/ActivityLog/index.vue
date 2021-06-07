<template>
  <section class="activity-log">
    <Search @filter-changed="onFilterChange($event)" />

    <div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="isLoading"
        :pagination="{
          ...pagination,
          showTotal: showTotal
        }"
        size="middle"
        @change="handleChange"
      >
        <template #detail="{ detail }">
          <span>
            {{ detail }}
            <a class="ant-dropdown-link">
              Show detail
              <down-outlined />
            </a>
          </span>
        </template>
      </a-table>
    </div>
  </section>
</template>

<script>
import { computed, defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useGetLogListService from '@/views/ActivityLog/composables/useGetLogListService'
import { convertPagination } from '@/helpers/convert-pagination'

import Table from '@/mixins/table.mixin'
import Search from '@/views/ActivityLog/Search'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'

export default defineComponent({
  name: 'Index',

  components: { Search },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getLists } = useGetLogListService({ pageNumber: 1, pageSize: 30 })
    const { result } = await getLists()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    next()
  },

  setup() {
    const route = useRoute()
    const { t } = useI18n()

    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)

    const columns = computed(() => {
      return [
        { title: 'Timestamp', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
        { title: 'Account', dataIndex: 'name', key: 'name' },
        { title: 'Action', dataIndex: 'code', key: 'code' },
        { title: 'Page/Data', dataIndex: 'divisionName', key: 'divisionName' },
        { title: 'Detail', dataIndex: 'id"', key: 'id"', slots: { customRender: 'detail' } }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
      pagination.value = { ...route.meta['pagination'] }
    })

    const handleChange = async (pagination) => {
      const params = {
        pageNumber: pagination.current,
        pageSize: pagination.pagesize
      }
      await fetchList(params)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      await fetchList({ pageNumber: 1, pageSize: 30 }, filter.value)
    }

    const fetchList = async (param = {}, data) => {
      isLoading.value = true

      try {
        const { getLists } = useGetLogListService({ ...param }, data)
        const result = await getLists()

        dataSource.value = [...result.data]
        pagination.value = convertPagination(result.data)
        isLoading.value = false
      } catch (e) {
        isLoading.value = false
      }
    }
    return {
      dataSource,
      pagination,
      columns,
      isLoading,
      t,
      handleChange,
      onFilterChange,
      fetchList
    }
  }
})
</script>
<style scoped lang="scss"></style>
