<template>
  <section>
    <Search />

    <div class="box-create">
      <a-button class="btn-modal" type="primary"><add-icon class="add-icon" /> 新規企業追加</a-button>
    </div>

    <div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :row-key="randomUniqueID"
        :pagination="{
          showTotal: showTotal
        }"
        :scroll="{ y: '100vh' }"
        size="middle"
        @change="handleChange"
      >
      </a-table>
    </div>
  </section>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useGetCompanyListService from '@/views/Company/composables/useGetCompanyListService'
import Table from '@/mixins/table.mixin'
import Search from '@/views/Company/Search'
import AddIcon from '@/assets/icons/ico_line-add.svg'

export default defineComponent({
  name: 'CompanyPage',

  components: { Search, AddIcon },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getLists } = useGetCompanyListService({ 'page-number': 1, 'page-size': 10 })
    const { data } = await getLists()
    to.meta['lists'] = data.result

    next()
  },

  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const dataSource = ref([])
    const columns = computed(() => {
      return [
        {
          title: t('123'),
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.length - b.name.length
        },
        {
          title: t('333'),
          dataIndex: 'paymentTerm',
          key: 'paymentTerm',
          sorter: (a, b) => a.paymentTerm - b.paymentTerm
        }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
    })

    const handleChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter)
    }

    return {
      dataSource,
      columns,
      handleChange
    }
  }
})
</script>

<style scoped lang="scss">
.box-create {
  padding: 24px 32px 16px;
  text-align: right;
}
.modal {
  margin-bottom: 16px;
  text-align: -webkit-right;

  .btn-modal {
    width: auto;
    height: 24px;
    border-radius: 2px;
    padding: 1px 8px;
    text-align: center;
    display: flex;
    align-items: center;

    .add-icon {
      margin-right: 10.33px;
    }
  }
}
</style>
