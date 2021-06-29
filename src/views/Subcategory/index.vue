<template>
  <section>
    <subcategory-search-form v-bind:filter="filter" @filter-changed="onFilterChange($event)" />
    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16 box-create">
      <div>
        <a-button class="u-mr-16 bnt-back" type="default" @click="$router.push({ name: 'category'})">
        <arrow-icon class="arrow-icon" />
        {{ $t('subcategory.back') }}
      </a-button>
      </div>
      <div>
        <a-button class="u-ml-12 btn-modal" type="primary" @click="$router.push({ name: 'subcategory-new', params: {category_id:filter.category_id, category_name: filter.category_name}})">
        <add-icon class="add-icon" />
        {{ $t('subcategory.add_subcategory') }}
      </a-button>
      </div>
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
     <template #inUse="{ text: inUse }">
        {{ inUse ? $t('subcategory.in_use') : $t('subcategory.prohibited') }}
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

export default defineComponent({
  name: 'Index',

  components: { ModalAction, SubcategorySearchForm, ArrowIcon, AddIcon, ModalDelete },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getLists } = useGetSubCategoryListService({ pageNumber: 1, pageSize: 30 ,order_by: 'name asc'}, { key_search: '', category_id: [ parseInt(to.params.id)] })
    const { result } = await getLists()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
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
    const filter = ref({ key_search: '', category_id: [ parseInt(route.params.id)], category_name: route.params.name})
    const isLoading = ref(false)
    const recordVisible = ref({})
    const params = ref({ pageNumber: 1, pageSize: 30 ,order_by: 'name asc'})
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
        const { deleteSubCategory } = useDeleteSubCategoryService(recordVisible.value.id)
        await deleteSubCategory()
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
        name: 'subcategory-edit',
        params: {
          id: recordVisible.value.id
        }
      })
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      try {
        const { getLists } = useGetSubCategoryListService({ ...params }, filter.value)
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
      filter,
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
  padding: 0px 32px 0;
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
    border: 0px;
    color: grey;
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
    border: 0px;
    color: #1890ff;
    background-color: transparent;
    .arrow-icon {
      transform: rotate(270deg);
    }
  }
}
</style>
