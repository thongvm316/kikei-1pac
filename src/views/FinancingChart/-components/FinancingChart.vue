<template>
  <section ref="chart" class="chart">
    <template v-if="isVisible ? isVisible : (openChart = false)">
      <a-button class="btn-chart" @click="openChart = true">
        <template #icon>
          <LineChartOutlined />
        </template>
        {{ $t('modal.chart') }}
      </a-button>

      <div :class="{ active: openChart }" class="modal-chart">
        <close-icon class="icon" @click="openChart = false" />
        <div class="group-chart">
          <a-checkbox
            v-for="item in plainOptions"
            :key="item.data_id"
            v-model:checked="item.checked"
            :value="item.data_id"
            @change="onToggleIndicated"
          >
            <span :class="!item.checked ? 'line-through' : ''">{{ item.data_name }}</span>
            <div :style="{ background: item.color }" class="modal-color"></div>
          </a-checkbox>
        </div>
      </div>
    </template>

    <div ref="canvas" class="canvas">
      <canvas ref="myChartRef" @click=";(isActive = false), (openChart = false)" />

      <template v-if="isActive">
        <div ref="modalContent" class="modal-content">
          <close-icon class="icon" @click="handleClose" />
          <ul>
            <li v-for="item in detailChart.data" :key="item">
              <div v-if="dataChart.length < 2">
                <router-link :to="{ name: 'deposit' }" @click="handlePageRedirect(item, fullDate)">
                  <span class="left-detail">
                    {{
                      item.label === 'Withdrawal'
                        ? $t('modal.chart_label_Withdrawal')
                        : item.label === 'Deposit'
                        ? $t('modal.chart_label_Deposit')
                        : item.label
                    }}
                  </span>
                </router-link>
              </div>
              <div v-else>
                <span class="left-detail_chart-all">{{ $t('modal.balance_chart') }}</span>
              </div>

              <span class="money-detail right-detail">
                <div v-if="dataChart.length < 2" :style="item.money < 0 ? 'color: red' : 'color: black'">
                  <router-link v-if="groupId" :to="{ name: 'deposit' }" @click="handlePageRedirect(item, fullDate)">
                    <span class="start-color" :style="item.money < 0 ? 'color: red' : 'color: black'">
                      <p v-if="item.warnings.length > 0 && item.money > 0">*</p>
                      {{ item.money.toLocaleString() }}
                    </span>
                    <template v-if="item.warnings.length">
                      <span class="note-money">{{ $filters.moment_l(item.warnings[0]) }}</span>
                    </template>
                  </router-link>

                  <router-link v-else :to="{ name: 'financing' }" @click="handlePageRedirect(item, fullDate)">
                    <span class="start-color" :style="item.money < 0 ? 'color: red' : 'color: black'">
                      <p v-if="item.warnings.length > 0 && item.money > 0">*</p>
                      {{ item.money.toLocaleString() }}
                    </span>
                    <template v-if="item.warnings.length">
                      <span class="note-money">{{ $filters.moment_l(item.warnings[0]) }}</span>
                    </template>
                  </router-link>
                </div>
                <div v-else>
                  <router-link
                    v-if="dataChart.length < 2"
                    :to="{ name: 'deposit' }"
                    @click="handlePageRedirect(item, fullDate)"
                  >
                    <span class="start-color" :style="item.money < 0 ? 'color: red' : 'color: black'">
                      {{ item.money.toLocaleString() }}</span
                    >
                    <template v-if="item.warnings.length">
                      <span class="note-money__chart-all">
                        {{ $filters.moment_l(item.warnings[0]) }} {{ $t('modal.cash_out') }}
                      </span>
                    </template>
                  </router-link>
                  <router-link v-else :to="{ name: 'financing-chart' }" @click="handlePageRedirect(item, fullDate)">
                    <span class="start-color__chart-all"> {{ item.money.toLocaleString() }}</span>
                    <template v-if="item.warnings.length">
                      <span class="note-money__chart-all">
                        {{ $filters.moment_l(item.warnings[0]) }} {{ $t('modal.cash_out') }}
                      </span>
                    </template>
                  </router-link>
                </div>
              </span>
            </li>
            <div v-if="dataChart.length < 2">
              <hr class="dashed" />
              <li>
                <span class="left-detail_chart-all">{{ $t('modal.total_balance') }}</span>
                <router-link :to="{ name: 'deposit' }" @click="handleRowTotalRedirect(item, fullDate)">
                  <span class="right-detail_chart-all" :style="totalMoney < 0 ? 'color: red' : 'color: black'">{{
                    totalMoney
                  }}</span>
                </router-link>
              </li>
            </div>
          </ul>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import { defineComponent, onMounted, ref, toRefs, watch, nextTick, onBeforeMount } from 'vue'
import Chart from 'chart.js/auto'
import CloseIcon from '@/assets/icons/ico_close.svg'
import { find, forEach, map, split, findIndex, includes, cloneDeep } from 'lodash-es'
import { LineChartOutlined } from '@ant-design/icons-vue'
import { CHART } from '@/enums/chart-line.enum'
import { useStore } from 'vuex'
import useGetDetailChartService from '@/views/FinancingChart/composables/useGetDetailChartService'
import moment from 'moment'

window.myLineChart = null

const layout = {
  padding: {
    top: 50,
    bottom: 15,
    left: 15,
    right: 15
  }
}

export default defineComponent({
  name: 'Index',

  components: { CloseIcon, LineChartOutlined },

  props: {
    dataChart: {
      type: [Array, Object],
      required: true,
      default: () => []
    },
    isVisible: {
      type: Boolean,
      required: true
    }
  },

  emits: ['on-tab-change'],

  setup(props, { emit }) {
    const store = useStore()
    const myChartRef = ref()
    const element = ref()
    const modalContent = ref()
    const checkDate = ref([])
    const dataPoint = ref({})
    const isActive = ref(false)
    const openChart = ref(false)
    const { dataChart } = toRefs(props)
    const data = ref({ labels: [], datasets: [] })
    const plainOptions = ref([])
    const indicated = ref([1, 2])
    const widthLabel = ref(60)
    const canvas = ref()
    const chart = ref()

    const detailChart = ref({})
    const detailLabels = ref([])
    const detailMoney = ref([])
    const totalMoney = ref()
    const fullDate = ref()
    // data filter deposit
    const groupId = ref()
    const fromDate = ref()
    const toDate = ref()
    const typeDeposit = ref()
    const moneyType = ref()
    const bankAccountsId = ref()
    const dataFilters = ref({})

    const requestDataFilter = ref({
      data: {}
    })

    const backgrounds = ref([])
    const hoverBackgrounds = ref([])

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout,
      scales: {
        x: {
          grid: {
            color: 'transparent',
            borderColor: '#8C8C8C',
            tickColor: '#8C8C8C'
          },
          ticks: {
            color: ({ index }) => {
              return data.value.datasets.some((val) => includes([undefined, false], val.hidden) && val.data[index] < 0)
                ? '#F5222D'
                : '#000000'
            },
            beginAtZero: true,
            autoSkip: false,
            maxRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: (context) => {
              return !context.tick.value ? '#595959' : '#D9D9D9'
            }
          },
          ticks: {
            padding: 20
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      onClick: (evt, nativeElement) => {
        element.value = window.myLineChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true)
        // set position modal
        if (element.value.length) {
          opacityLine(nativeElement)

          handleClickPoint(nativeElement).then(async (result) => {
            detailChart.value = { ...result.data }
            totalMoney.value = detailChart.value?.totalMoney?.toLocaleString()

            if (totalMoney.value) isActive.value = true

            await reRenderPos()
            await activePoint(nativeElement)

            window.myLineChart.update()
          })
        } else {
          handleClose()
          window.myLineChart.update()
        }
      }
    }

    const plugins = {
      afterDatasetsDraw: (chart) => {
        if (chart && chart.tooltip && chart.tooltip._active && chart.tooltip._active.length) {
          const activePoint = chart.tooltip._active[0],
            ctx = chart.ctx,
            y_axis = chart.scales['y'],
            x = activePoint.element.x,
            topY = activePoint.element.y + 6,
            bottomY = y_axis.bottom
          // draw line
          if (topY <= bottomY) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x, topY)
            ctx.lineTo(x, bottomY)
            ctx.lineWidth = 1
            ctx.strokeStyle = '#D9D9D9'
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    watch(dataChart, (value) => {
      // reset dataset when switch tab group
      data.value.datasets = []
      plainOptions.value = []
      isActive.value = false

      // indicates setting <=> all group (tab)
      if (value.length > 1) {
        plainOptions.value = map(value, (item) => {
          const chart = find(CHART, (i) => i.data_id === item.dataId)
          return { data_id: item.dataId, data_name: item.dataName, color: chart.border, checked: true }
        })
      }

      // template array
      checkDate.value = [...value]

      forEach(value, (item) => {
        const result = mapChart(item.detail)
        const labels = mapLabel(result)
        const dataY = mapDataY(result)
        const chart = find(CHART, (i) => i.data_id === item.dataId)
        backgrounds.value = map(dataY, () => chart.pointBg)
        hoverBackgrounds.value = map(dataY, () => chart.pointHoverBg)

        // set label
        data.value.labels = labels
        // set datasets
        data.value.datasets.push({
          label: chart.label,
          pointBorderWidth: 4,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 4,
          pointRadius: 8,
          borderColor: chart.border,
          pointBorderColor: 'rgba(255, 255, 255, 1)',
          pointBackgroundColor: backgrounds.value.slice(),
          pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
          pointHoverBackgroundColor: hoverBackgrounds.value.slice(),
          data: [...dataY]
        })
      })

      // re render chart
      window.myLineChart.update()

      // reset scroll
      nextTick(() => {
        chart.value.scrollLeft = 0

        const aside = 232
        const delta = data.value.labels.length * widthLabel.value

        canvas.value.style.width =
          groupId.value !== 0 && delta >= window.innerWidth - aside
            ? data.value.labels.length * widthLabel.value + 'px'
            : 100 + '%'
      })
    })

    watch(
      () => store.state.financing.filters.data,
      () => {
        dataFilters.value = store.state.financing?.filters?.data ? cloneDeep(store.state.financing.filters.data) : {}
        groupId.value = dataFilters.value.group_id
      }
    )

    onBeforeMount(() => {
      dataFilters.value = store.state.financing?.filters?.data ? cloneDeep(store.state.financing.filters.data) : {}
      groupId.value = dataFilters.value.group_id
    })

    onMounted(() => {
      window.myLineChart = createChart()
    })

    const activePoint = (nativeElement) => {
      const datasetIndex = nativeElement[0].datasetIndex
      const index = nativeElement[0].index

      forEach(checkDate.value, (item, key) => {
        if (datasetIndex === key) {
          // find line exactly
          const chart = find(CHART, (i) => i.data_id === item.dataId)
          forEach(data.value.datasets[datasetIndex].data, (value, o) => {
            // set default background color
            data.value.datasets[datasetIndex].pointBackgroundColor[o] = chart.pointBg
            if (o === index) {
              // active point when clicked
              data.value.datasets[datasetIndex].pointBackgroundColor[index] = chart.pointHoverBg
            }
          })
        }
      })
    }

    const onToggleIndicated = (e) => {
      const chart = find(CHART, (item) => item.data_id === e.target.value)
      if (chart) {
        forEach(data.value.datasets, (item) => {
          if (item.label === chart.label) {
            item.hidden = !e.target.checked
            window.myLineChart.update()
          }
        })
      }
      if (e) handleClose()
    }

    const mapChart = (data) => {
      return map(data, (e) => {
        const element = {}
        element[e.date] = e.balance
        return element
      })
    }

    const mapLabel = (data) => {
      return map(data, (i) => {
        const arr = split(Object.keys(i)[0], ',')
        let index = null

        if (arr.length > 1) index = 1
        if (arr.length === 1 && arr[0].includes('-')) index = 0

        arr[index] = moment(arr[index]).format('YYYY/MM')

        return arr
      })
    }

    const mapDataY = (data) => {
      return map(data, (i) => Object.values(i)[0])
    }

    const handleClickPoint = (nativeElement) => {
      let dataId = null
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        if (nativeElement.length) {
          forEach(checkDate.value, (item, i) => {
            if (nativeElement[0].datasetIndex === i) {
              fullDate.value = item.detail[nativeElement[0].index].fulldate
              dataId = item.dataId
            }
          })
        }

        const filters = store.state.financing?.filters

        dataPoint.value = {
          ...filters.data,
          from_date: fullDate.value,
          to_date: fullDate.value,
          data_id: dataId
        }

        // eslint-disable-next-line no-useless-catch
        try {
          const { getDetailChart } = useGetDetailChartService(dataPoint.value, filters.params)
          const { result } = await getDetailChart()
          resolve(result)
          if (result.data === null) {
            store.commit('flash/STORE_FLASH_MESSAGE', {
              variant: 'error',
              message: 'errors.data_chart_null'
            })
          }
        } catch (e) {
          reject(e)
        }
      })
    }

    const createChart = () => {
      return new Chart(myChartRef.value, {
        type: 'line',
        data: data.value,
        options,
        plugins: [plugins]
      })
    }

    const handleClose = () => {
      isActive.value = false

      forEach(data.value.datasets, (item, datasetIndex) => {
        item.borderColor = item.borderColor.replace(/[\d.]+\)$/g, '1)')
        item.pointBorderColor = item.pointBorderColor.replace(/[\d.]+\)$/g, '1)')

        forEach(checkDate.value, (val, i) => {
          if (datasetIndex === i) {
            const chart = find(CHART, (i) => i.data_id === val.dataId)
            forEach(item.data, (obj, index) => {
              item.pointBackgroundColor[index] = chart.pointBg
            })
          }
        })
      })

      window.myLineChart.update()
    }

    const reRenderPos = () => {
      nextTick(() => {
        const left = element.value[0].element.x
        const top = element.value[0].element.y

        const width = modalContent.value.offsetWidth
        const height = modalContent.value.offsetHeight

        const canvasW = myChartRef.value.clientWidth
        const canvasH = myChartRef.value.clientHeight

        modalContent.value.style.left = left + width >= canvasW ? `${left - width - 8}px` : `${left + 8}px`
        modalContent.value.style.top = top + height >= canvasH ? `${top - height - 8}px` : `${top + 8}px`
      })
    }

    const opacityLine = (elm) => {
      const datasetIndex = elm[0].datasetIndex
      let opacity = null

      forEach(data.value.datasets, (item, index) => {
        opacity = index !== datasetIndex ? 0.2 : 1

        item.borderColor = item.borderColor.replace(/[\d.]+\)$/g, `${opacity})`)
        item.pointBorderColor = item.pointBorderColor.replace(/[\d.]+\)$/g, `${opacity})`)

        forEach(item.data, (obj, index) => {
          item.pointBackgroundColor[index] = item.pointBackgroundColor[index].replace(/[\d.]+\)$/g, `${opacity})`)
        })
      })

      window.myLineChart.update()
    }

    const handleBankIdRequest = (id) => {
      bankAccountsId.value = null
      let bankId = dataFilters.value?.bank_account_ids || null
      let groupId = dataFilters.value?.group_id || null

      if (bankId.length > 0) {
        bankAccountsId.value = bankId[0]
      } else {
        if (id) {
          bankAccountsId.value = parseInt(id)
        } else {
          bankAccountsId.value = null
        }
      }

      if (!groupId) {
        bankAccountsId.value = null
      }
    }

    const handleDateRequest = (fullDate) => {
      let showBy = dataFilters.value.show_by
      if (parseInt(showBy) === 0) {
        // show by month
        fromDate.value = fullDate ? moment(fullDate).startOf('month').format('YYYY-MM-DD') : null
        toDate.value = fullDate ? moment(fullDate).endOf('month').format('YYYY-MM-DD') : null
      }
      if (parseInt(showBy) === 1) {
        // show by day
        fromDate.value = fullDate ? moment(fullDate).format('YYYY-MM-DD') : null
        toDate.value = fullDate ? moment(fullDate).format('YYYY-MM-DD') : null
      }
    }

    const handleTypeDepositRequest = (id) => {
      let columnId = parseInt(id)

      if (dataFilters.value.bank_account_ids.length !== 0) {
        typeDeposit.value = null
        moneyType.value = columnId
      } else {
        typeDeposit.value = null
        moneyType.value = null
      }
    }

    const handlePageRedirect = (item, fullDate) => {
      let columnId = item?.id ?? null
      handleBankIdRequest(columnId)
      handleDateRequest(fullDate)
      handleTypeDepositRequest(columnId)

      if (dataFilters.value.group_id) {
        requestDataFilter.value.data = {
          groupId: dataFilters.value.group_id,
          bankAccountId: bankAccountsId.value,
          fromDate: fromDate.value,
          toDate: toDate.value,
          type: typeDeposit.value,
          moneyType: moneyType.value
        }
        store.commit('deposit/STORE_DEPOSIT_FILTER', requestDataFilter.value)
      } else {
        requestDataFilter.value.data = {
          group_id: columnId,
          period_id: null,
          from_date: fromDate.value,
          to_date: toDate.value,
          show_by: 1,
          bank_account_ids: [],
          currency_code: null
        }

        emit('on-tab-change', requestDataFilter.value.data)
      }
    }

    const handleRowTotalRedirect = (item, fullDate) => {
      let columnId = item?.id ?? null

      handleBankIdRequest(columnId)
      handleDateRequest(fullDate)
      handleTypeDepositRequest(columnId)

      requestDataFilter.value.data = {
        groupId: dataFilters.value.group_id,
        bankAccountId: bankAccountsId.value,
        fromDate: fromDate.value,
        toDate: toDate.value,
        type: dataFilters.value.typeDeposit,
        moneyType: dataFilters.value.moneyType
      }
      store.commit('deposit/STORE_DEPOSIT_FILTER', requestDataFilter.value)
    }

    return {
      myChartRef,
      modalContent,
      canvas,
      chart,
      isActive,
      openChart,
      plainOptions,
      indicated,
      detailChart,
      detailLabels,
      detailMoney,
      totalMoney,
      fullDate,
      groupId,
      data,
      widthLabel,
      onToggleIndicated,
      handleClose,
      handleBankIdRequest,
      handleDateRequest,
      handlePageRedirect,
      handleRowTotalRedirect
    }
  }
})
</script>
