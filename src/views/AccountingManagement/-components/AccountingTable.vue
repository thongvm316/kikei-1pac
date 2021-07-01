<template>
  <a-table
    ref="accountingTableRef"
    class="accounting-table -mx-32"
    :loading="isLoadingTable"
    :columns="columns"
    :data-source="data"
    :pagination="false"
    :scroll="{ x: 1500 }"
  >
    <template #july="{ record }">
      <router-link :to="{ name: 'deposit', query: { tab: groupId } }" @click="handleSelectDeposit(record)">
        {{ record.july }}
      </router-link>
    </template>

    <template #august="{ record }">
      <router-link :to="{ name: 'deposit', query: { tab: groupId } }" @click="handleSelectDeposit(record)">
        {{ record.address }}
      </router-link>
    </template>
  </a-table>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
// import { useI18n } from 'vue-i18n'

const data = []
for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    category: `Category ${i}`,
    july: `777,777,${i}00`,
    address: `888,999,${i}00`,
    children: [
      {
        key: i,
        category: `sub-Category ${i}`,
        july: `777,777,${i}00`,
        address: `234,322,${i}00`
      },
      {
        key: i,
        category: `sub-Category ${i}`,
        july: `777,777,${i}00`,
        address: `234,322,${i}00`
      },
      {
        key: i,
        category: `sub-Category ${i}`,
        july: `777,777,${i}00`,
        address: `234,322,${i}00`
      }
    ]
  })
}

export default defineComponent({
  name: 'AccountingTable',

  props: {
    tableIndex: Number,
    pixelsScrolled: {
      type: Number,
      default: 0
    },
    tableIndexDisableScroll: Number,
    isLoadingTable: Boolean,
    groupId: Number
  },

  emits: ['getPixelsScrolled'],

  setup(props, { emit }) {
    const store = useStore()
    // const { t } = useI18n()

    const accountingTableRef = ref()
    const tableBodyRef = ref()

    // init columns
    const columns = [
      {
        title: '',
        width: 200,
        dataIndex: 'category',
        key: 'category',
        fixed: 'left',
        slots: { customRender: 'category' }
      },
      {
        title: '7月',
        dataIndex: 'july',
        key: 'july',
        width: 150,
        slots: { customRender: 'july' }
      },
      {
        title: '8月',
        dataIndex: 'address',
        key: '1',
        width: 150,
        slots: { customRender: 'august' }
      },
      {
        title: '9月',
        dataIndex: 'address',
        key: '2',
        width: 150,
        slots: { customRender: 'september' }
      },
      {
        title: '10月',
        dataIndex: 'address',
        key: '3',
        width: 150,
        slots: { customRender: 'october' }
      },
      {
        title: '11月',
        dataIndex: 'address',
        key: '4',
        width: 150
      },
      {
        title: '12月',
        dataIndex: 'address',
        key: '5',
        width: 150
      },
      {
        title: '1月',
        dataIndex: 'address',
        key: '6',
        width: 150
      },
      {
        title: '2月',
        dataIndex: 'address',
        key: '7',
        width: 150
      },
      {
        title: '3月',
        dataIndex: 'address',
        key: '8',
        width: 150
      },
      {
        title: '4月',
        dataIndex: 'address',
        key: '9',
        width: 150
      },
      {
        title: '5月',
        dataIndex: 'address',
        key: '10',
        width: 150
      },
      {
        title: '6月',
        dataIndex: 'address',
        key: '11',
        width: 150
      }
    ]

    // update modal search deposit
    const handleSelectDeposit = (record) => {
      console.log('record:::', record)

      const data = {
        groupId: props.groupId,
        categoryId: [1],
        subcategoryId: [],
        fromDate: null,
        toDate: null
      }
      store.commit('deposit/STORE_DEPOSIT_FILTER', { data })
    }

    function updatePixelsScrolled() {
      const el = this
      if (!el) return

      const tableIndex = el.getAttribute('accounting-table-index')
      const pixelsScrolled = el.scrollLeft

      emit('getPixelsScrolled', { tableIndex: tableIndex, pixel: pixelsScrolled })
    }

    onMounted(() => {
      const el = accountingTableRef.value?.$el
      if (!el) return
      const tableBody = el.querySelector('.ant-table-body')
      if (!tableBody) return

      tableBodyRef.value = tableBody
      tableBodyRef.value.setAttribute('accounting-table-index', props.tableIndex)
      tableBodyRef.value.addEventListener('scroll', updatePixelsScrolled)
    })

    onUnmounted(() => {
      if (!tableBodyRef.value) return
      tableBodyRef.value.removeEventListener('scroll', updatePixelsScrolled)
    })

    watch(
      () => props.pixelsScrolled,
      () => {
        if (props.tableIndexDisableScroll === props.tableIndex) return
        if (!tableBodyRef.value) return

        tableBodyRef.value.scrollLeft = props.pixelsScrolled
      }
    )

    return {
      accountingTableRef,
      data,
      columns,

      handleSelectDeposit
    }
  }
})
</script>
