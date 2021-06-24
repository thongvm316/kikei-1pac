<template>
  <section>
    <CategorySearchForm @filter-changed="onFilterChange($event)" />

    <div class="box-create">
      <a-button class="btn-modal" type="primary" @click="$router.push({ name: 'category-new' })">
        <add-icon class="add-icon" />
        {{ $t('category.add_category') }}
      </a-button>
    </div>

    <a-table
      id="list-table"
      :columns="columns"
      :data-source="dataSource"
      :row-key="(record) => record.id"
      :loading="isLoading"
      :pagination="{
        ...pagination,
        showTotal: showTotal
      }"
      :custom-row="customRow"
      :row-selection="rowSelection"
      :scroll="{ y: height - 217 }"
      size="middle"
      @change="handleChange"
    >
      <template #divisionTypeName="{ text: divisionTypeName }">
        {{ divisionTypeName === 'Sales' ? $t('category.sales') : $t('category.expense') }}
      </template>

      <template #subcategoryKindName="{ text: subcategoryKindName }">
        {{
          subcategoryKindName === 'Company'
            ? $t('category.company')
            : subcategoryKindName === 'Group'
            ? $t('category.request_group')
            : subcategoryKindName === 'Text Input'
            ? $t('category.text_input')
            : $t('category.no')
        }}
      </template>

      <template #action="{ text: action, record }">
        <a @click="handleSelectNumber(record)">{{ action }}</a>
      </template>

      <template #inUse="{ text: inUse }">
        {{ inUse ? $t('category.in_use') : $t('category.prohibited') }}
      </template>
    </a-table>

    <ModalAction v-if="recordVisible.visible" @edit="handleEditRecord" @delete="openDelete = true" />

    <ModalDelete v-model:visible="openDelete" :name="recordVisible.name" @delete="handleDeleteRecord($event)" />
  </section>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import useGetCategoryListService from '@/views/Category/composables/useGetCategoryListService'
import useDeleteCategoryService from '@/views/Category/composables/useDeleteCategoryService'
import { convertPagination } from '@/helpers/convert-pagination'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'

import Table from '@/mixins/table.mixin'
import CategorySearchForm from '@/views/Category/-components/CategorySearchForm'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'
import ModalDelete from '@/components/ModalDelete'

export default defineComponent({
  name: 'Index',

  components: { ModalAction, CategorySearchForm, AddIcon, ModalDelete },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getLists } = useGetCategoryListService({ pageNumber: 1, pageSize: 30, order_by: 'name asc' })
    const { result } = await getLists()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    next()
  },

  setup(_, context) {
    const route = useRoute()
    const router = useRouter()
    const { t, locale } = useI18n()
    const store = useStore()

    const openDelete = ref(false)
    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const recordVisible = ref({})
    const params = ref({ pageNumber: 1, pageSize: 30, order_by: 'name asc' })

    const height = ref(0)

    const state = reactive({ selectedRowKeys: [] })
    let tempRow = reactive([])

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: state.selectedRowKeys,
        columnWidth: 0,
        type: 'radio'
      }
    })

    const columns = computed(() => {
      return [
        {
          title: t('category.categoryName'),
          dataIndex: 'name',
          key: 'name',
          sorter: true
        },
        {
          title: t('category.category_division'),
          dataIndex: 'divisionTypeName',
          key: 'divisionTypeName',
          slots: { customRender: 'divisionTypeName' }
        },
        {
          title: t('category.subcategory_division'),
          dataIndex: 'subcategoryKindName',
          key: 'subcategoryKindName',
          slots: { customRender: 'subcategoryKindName' }
        },
        {
          title: t('category.subcategory'),
          dataIndex: 'subcategoryNumber',
          key: 'subcategoryNumber',
          slots: { customRender: 'action' }
        },
        {
          title: t('category.status'),
          dataIndex: 'inUse',
          key: 'inUse',
          slots: { customRender: 'inUse' }
        }
      ]
    })

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

    const handleChange = async (pagination, filters, sorter) => {
      if (sorter.order === 'ascend') {
        sorter.order = 'asc'
      } else if (sorter.order === 'descend') {
        sorter.order = 'desc'
      } else {
        sorter.order = ''
      }

      params.value = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        order_by: sorter.order === '' ? 'name asc' : sorter.field + ' ' + sorter.order
      }
      await fetchList(params.value, filter.value)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      await fetchList({ pageNumber: 1, pageSize: 30 }, filter.value)
    }

    const handleDeleteRecord = async () => {
      try {
        const { deleteCategory } = useDeleteCategoryService(recordVisible.value.id)
        await deleteCategory()
      } catch (error) {
        console.log(error)
      }
      openDelete.value = false
      recordVisible.value.visible = false
      await fetchList(params.value)
      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message:
          locale.value === 'en' ? 'Deleted' + recordVisible.value.name : recordVisible.value.name + 'を削除しました'
      })
    }

    const handleEditRecord = () => {
      router.push({
        name: 'category-edit',
        params: {
          id: recordVisible.value.id
        }
      })
    }

    const handleSelectNumber = (record) => {
      console.log(record)
      // context.emit('select-number-category', record)
      // router.push({ name: 'company' })
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      try {
        const { getLists } = useGetCategoryListService({ ...params }, data)
        const { result } = await getLists()

        dataSource.value = [...result.data]
        pagination.value = convertPagination(result.meta)
        isLoading.value = false
      } catch (e) {
        isLoading.value = false
      }
    }

    const selectRow = (record) => {
      recordVisible.value = { ...record }
      if (tempRow.length && tempRow[0] === record.id) {
        state.selectedRowKeys = []
        tempRow = []
        recordVisible.value.visible = false
      } else {
        state.selectedRowKeys = [record.id]
        tempRow = [record.id]
        recordVisible.value.visible = true
      }
    }

    const customRow = (record) => {
      return {
        onClick: () => {
          selectRow(record)
        }
      }
    }

    return {
      dataSource,
      pagination,
      columns,
      isLoading,
      t,
      openDelete,
      state,
      rowSelection,
      recordVisible,
      height,
      params,
      handleDeleteRecord,
      handleEditRecord,
      customRow,
      handleChange,
      onFilterChange,
      fetchList,
      handleSelectNumber
    }
  }
})
</script>

<style scoped lang="scss">
.box-create {
  padding: 24px 32px 0;
  text-align: right;
  text-align: -webkit-right;

  .btn-modal {
    width: auto;
    border-radius: 2px;
    text-align: center;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .add-icon {
      margin-right: 10.33px;
    }
  }
}
</style>
