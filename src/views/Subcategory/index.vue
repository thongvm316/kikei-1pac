<template>
  <section class="subcategory">
    <subcategory-search-form :filter="filter" @filter-changed="onFilterChange($event)" />

    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16 box-create">
      <div>
        <a-button class="u-mr-16 bnt-back" type="default" @click="handleBack">
          <arrow-icon class="arrow-icon" />
          {{ $t('subcategory.back') }}
        </a-button>
      </div>
      <div>
        <a-button class="u-ml-12 btn-modal" type="primary" @click="handleCreate">
          <add-icon class="add-icon" />
          {{ $t('subcategory.add_subcategory') }}
        </a-button>
      </div>
    </div>

    <a-table
      id="list-table"
      v-click-outside="handleClickOutdideTable"
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
      :scroll="{ y: height - 218 }"
      size="middle"
      @change="handleChange"
    >
      <template #inUse="{ text: inUse }">
        {{ inUse ? $t('subcategory.in_use') : $t('subcategory.prohibited') }}
      </template>
    </a-table>

    <ModalAction
      v-if="recordVisible.visible"
      ref="modalActionRef"
      @edit="handleEditRecord"
      @delete="openDelete = true"
      @close="handleCloseRecord"
    />

    <ModalDelete
      v-model:visible="openDelete"
      class="close-modal-delete"
      :name="recordVisible.name"
      @delete="handleDeleteRecord($event)"
    />
  </section>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import useGetSubCategoryListService from '@/views/Subcategory/composables/useGetSubcategoryListService'
import useDeleteSubCategoryService from '@/views/Subcategory/composables/useDeleteSubcategoryService'
import { convertPagination } from '@/helpers/convert-pagination'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'

import Table from '@/mixins/table.mixin'
import SubcategorySearchForm from '@/views/Subcategory/-components/SubcategorySearchForm'
import ArrowIcon from '@/assets/icons/ico_arrow_up.svg'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'
import ModalDelete from '@/components/ModalDelete'
import { forEach, includes, isArray, keys, map } from 'lodash-es'

export default defineComponent({
  name: 'Index',

  components: { ModalAction, SubcategorySearchForm, ArrowIcon, AddIcon, ModalDelete },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const body = {}

    if (keys(to.query).length > 0) {
      forEach(to.query, (value, key) => {
        if (!includes(['order_by', 'page_number', 'page_size'], key)) {
          if (isArray(value)) {
            body[key] = map([...value], (i) => Number(i))
          } else {
            body[key] = value
          }
        }
      })
    }

    const query = {
      page_number: 1,
      page_size: 50,
      order_by: 'name asc',
      ...body
    }

    const { getLists } = useGetSubCategoryListService(query, body)
    const { result } = await getLists()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    to.meta['queryDelete'] = body
    next()
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, locale } = useI18n()
    const store = useStore()

    const openDelete = ref(false)
    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({ key_search: '' })
    const isLoading = ref(false)
    const recordVisible = ref({})
    const params = ref({})
    const height = ref(0)
    const modalActionRef = ref()
    const queryDelete = ref({})

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
          title: t('subcategory.subcategoryName'),
          dataIndex: 'name',
          key: 'name',
          sorter: true
        },
        {
          title: t('subcategory.status'),
          dataIndex: 'inUse',
          key: 'inUse',
          slots: { customRender: 'inUse' }
        }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
      pagination.value = { ...route.meta['pagination'] }
      queryDelete.value = { ...route.meta['queryDelete'] }

      // Back Form
      tempRow = [parseInt(await route.params.id)]
      if (tempRow[0] === parseInt(await route.params.id)) {
        state.selectedRowKeys = [parseInt(await route.params.id)]
        tempRow = [parseInt(await route.params.id)]
        recordVisible.value.id = route.params.id
        recordVisible.value.visible = true
      }

      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const handleChange = async (pagination, filters, sorter) => {
      recordVisible.value.visible = false

      if (sorter.order === 'ascend') {
        sorter.order = 'asc'
      } else if (sorter.order === 'descend') {
        sorter.order = 'desc'
      } else {
        sorter.order = ''
      }

      params.value = {
        page_number: pagination.current,
        page_size: pagination.pageSize,
        order_by: sorter.order === '' ? 'name asc' : sorter.field + ' ' + sorter.order
      }

      if (keys(route.query).length > 0) {
        forEach(route.query, (value, key) => {
          if (!includes(['order_by', 'page_number', 'page_size'], key)) {
            if (isArray(value)) {
              filter.value[key] = map([...value], (i) => Number(i))
            } else {
              filter.value[key] = value
            }
          }
        })
      }

      await router.push({
        name: 'subcategory',
        query: {
          ...params.value,
          ...filter.value
        }
      })

      await fetchList(params.value, filter.value)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }
      await fetchList({ page_number: 1, page_size: 50 }, filter.value)
    }

    const handleBack = () => {
      let queryBack = {
        ...route.query
      }
      delete queryBack.category_id
      delete queryBack.name
      delete queryBack.category_name
      delete queryBack.key_search
      delete queryBack.id
      router.push({
        name: 'category',
        params: queryDelete.value,
        query: queryBack
      })
    }

    const handleCreate = () => {
      router.push({
        name: 'subcategory-new',
        params: route.params,
        query: route.query
      })
    }

    const handleDeleteRecord = async () => {
      try {
        const { deleteSubCategory } = useDeleteSubCategoryService(recordVisible.value.id)
        await deleteSubCategory()
      } catch (error) {
        console.log(error)
      }
      openDelete.value = false
      recordVisible.value.visible = false
      await fetchList(params.value, queryDelete.value)
      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message:
          locale.value === 'en' ? 'Deleted' + recordVisible.value.name : recordVisible.value.name + 'を削除しました'
      })
    }

    // Close ActionBar
    const handleCloseRecord = () => {
      recordVisible.value.visible = false
      state.selectedRowKeys = []
      tempRow = []
    }

    // Click outside close ActionBar
    const handleClickOutdideTable = (event) => {
      const elModalDelete = document.querySelector('.close-modal-delete')
      const elNotOutsideList = [modalActionRef.value?.$el, elModalDelete].filter(Boolean)
      if (elNotOutsideList.length === 0) return
      const isElOutside = elNotOutsideList.every((el) => !(el === event.target || el.contains(event.target)))
      if (isElOutside) {
        recordVisible.value.visible = false
        state.selectedRowKeys = []
        tempRow = []
      }
    }

    const handleEditRecord = () => {
      router.push({
        name: 'subcategory-edit',
        params: {
          id: recordVisible.value.id,
          category_id: route.params.category_id,
          name: route.params.name
        },
        query: { ...route.query, ...params.value, ...filter.value }
      })
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      tempRow = []
      try {
        const { getLists } = useGetSubCategoryListService({ ...params }, data)
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
      openDelete,
      state,
      rowSelection,
      recordVisible,
      height,
      params,
      filter,
      modalActionRef,
      handleCreate,
      handleBack,
      handleCloseRecord,
      handleClickOutdideTable,
      handleDeleteRecord,
      handleEditRecord,
      customRow,
      handleChange,
      onFilterChange,
      fetchList
    }
  }
})
</script>

<style scoped lang="scss">
.box-create {
  padding: 0 32px;
  text-align: right;
  text-align: -webkit-right;

  .btn-modal {
    width: auto;
    border-radius: 2px;
    text-align: center;
    display: flex;
    align-items: center;

    .add-icon {
      margin-right: 10.33px;
    }
  }

  .bnt-back {
    width: auto;
    border-radius: 2px;
    text-align: center;
    display: flex;
    align-items: center;
    border: 0;
    color: #808080;
    background-color: transparent;

    .arrow-icon {
      transform: rotate(270deg);
    }
  }

  .bnt-back:hover {
    width: auto;
    border-radius: 2px;
    text-align: center;
    display: flex;
    align-items: center;
    border: 0;
    color: #1890ff;
    background-color: transparent;

    .arrow-icon {
      transform: rotate(270deg);
    }
  }
}
</style>
