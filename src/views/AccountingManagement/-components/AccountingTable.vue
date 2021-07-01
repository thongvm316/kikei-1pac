<template>
  <a-table ref="accountingTableRef" :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 200 }"></a-table>
</template>

<script>
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue'

const columns = [
  {
    title: '',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left'
  },
  {
    title: '7月',
    width: 100,
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '8月',
    dataIndex: 'address',
    key: '1',
    width: 150
  },
  {
    title: '9月',
    dataIndex: 'address',
    key: '2',
    width: 150
  },
  {
    title: '10月',
    dataIndex: 'address',
    key: '3',
    width: 150
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
const data = []

for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    name: `Category ${i}`,
    age: 32,
    address: `888,999,${i}00`
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
    tableIndexDisableScroll: Number
  },

  emits: ['getPixelsScrolled'],

  setup(props, { emit }) {
    const accountingTableRef = ref()

    function updatePixelsScrolled() {
      const el = this
      if (!el) return

      const tableIndex = el.getAttribute('accounting-table-index')
      const pixelsScrolled = el.scrollLeft

      emit('getPixelsScrolled', { tableIndex: tableIndex, pixel: pixelsScrolled })
    }

    onMounted(() => {
      const el = accountingTableRef.value?.$el
      const tableBody = el.querySelector('.ant-table-body')
      if (!tableBody) return

      tableBody.setAttribute('accounting-table-index', props.tableIndex)
      tableBody.addEventListener('scroll', updatePixelsScrolled)
    })

    onUnmounted(() => {
      const el = accountingTableRef.value?.$el
      if (!el) return
      const tableBody = el.querySelector('.ant-table-body')
      if (!tableBody) return

      tableBody.removeEventListener('scroll', updatePixelsScrolled)
    })

    watch(
      () => props.pixelsScrolled,
      () => {
        if (props.tableIndexDisableScroll === props.tableIndex) return

        const el = accountingTableRef.value.$el
        if (!el) return
        const tableBody = el.querySelector('.ant-table-body')
        if (!tableBody) return

        tableBody.scrollLeft = props.pixelsScrolled
      }
    )

    return {
      accountingTableRef,
      data,
      columns
    }
  }
})
</script>
