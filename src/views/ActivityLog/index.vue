<template>
  <section class="activity-log">
    <Search @filter-changed="onFilterChange($event)" />

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :row-key="(record) => record.id"
      :loading="isLoading"
      :scroll="{ y: height - 158 }"
      :custom-row="customRow"
      :pagination="{
        ...pagination,
        showTotal: showTotal
      }"
      size="middle"
      @change="handleChange"
    >
      <template #time="{ text: time }">
        <span>
          {{ formattedDate(time) }}
        </span>
      </template>
      <template #tags="{ text: tags }">
        <span>
          <a-tag :color="tags === 'DELETE' ? 'geekblue' : tags === 'POST' ? 'volcano' : 'green'">
            {{ tags === 'GET' ? 'Them' : tags === 'POST' ? 'Xoa' : 'Sua' }}
          </a-tag>
        </span>
      </template>
      <template #detail="{ detail }">
        {{ detail }}
        <a-button type="primary" @click="handleSelectLog">Show detail</a-button>
      </template>
    </a-table>

    <ModalActivityLogs v-model:visible="openActivityLog" :datalog="dataLog" />
  </section>
</template>

<script>
import { computed, defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import useGetLogListService from '@/views/ActivityLog/composables/useGetLogListService'
import { convertPagination } from '@/helpers/convert-pagination'

import Table from '@/mixins/table.mixin'
import Search from '@/views/ActivityLog/Search'
import ModalActivityLogs from '@/components/ModalActivityLogs'

const state = {
  from: moment().subtract(1, 'days').format(),
  to: moment().format()
}

export default defineComponent({
  name: 'Index',

  components: { ModalActivityLogs, Search },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getLists } = useGetLogListService({ pageNumber: 1, pageSize: 30 }, state)
    const { result } = await getLists()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    to.meta['dataDate'] = state
    next()
  },

  setup() {
    const route = useRoute()
    const { t } = useI18n()

    const dataSource = ref([])
    const pagination = ref({})
    const params = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const openActivityLog = ref(false)
    const height = ref(0)

    const tmpLog = ref({})
    const dataLog = ref({})

    const columns = computed(() => {
      return [
        { title: t('logs.timesTamp'), dataIndex: 'time', key: 'time', slots: { customRender: 'time' }, sorter: true },
        { title: t('logs.account'), dataIndex: 'userId', key: 'userId' },
        {
          title: t('logs.action'),
          dataIndex: 'method',
          key: 'method',
          slots: {
            customRender: 'tags'
          }
        },
        { title: t('logs.pageData'), dataIndex: 'path', key: 'path' },
        { title: t('logs.detail'), dataIndex: 'id', key: 'id', slots: { customRender: 'detail' } }
      ]
    })

    const formattedDate = (time) => {
      return moment(time).format('YYYY/MM/DD HH:mm:ss')
    }

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
      pagination.value = { ...route.meta['pagination'] }
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const handleChange = async (pagination) => {
      params.value = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize
      }
      await fetchList(params.value, filter.value)
    }

    const onFilterChange = async (evt) => {
      if (!evt.from && !evt.to) {
        filter.value = { ...state }
      } else {
        filter.value = { ...evt }
      }
      await fetchList({ pageNumber: 1, pageSize: 30 }, filter.value)
    }

    const customRow = (record) => {
      return {
        onClick: () => {
          tmpLog.value = { ...record }
        }
      }
    }

    const handleSelectLog = () => {
      setTimeout(() => {
        route.meta['log'] = { ...tmpLog.value }
        openActivityLog.value = true
        dataLog.value = route.meta['log']
      }, 0)
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true

      try {
        const { getLists } = useGetLogListService({ ...params }, data)
        const { result } = await getLists()
        dataSource.value = [...result.data]
        pagination.value = convertPagination(result.meta)
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
      height,
      openActivityLog,
      dataLog,
      formattedDate,
      handleChange,
      onFilterChange,
      fetchList,
      customRow,
      handleSelectLog
    }
  }
})
</script>
<style scoped lang="scss"></style>
