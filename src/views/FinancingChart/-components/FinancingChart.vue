<template>
  <section class="chart">
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

    <div class="canvas">
      <canvas ref="myChartRef" @click=";(isActive = false), (openChart = false)" />

      <div ref="modalContent" :class="{ active: isActive }" class="modal-content">
        <close-icon class="icon" @click="handleClose" />
        <ul>
          <li v-for="item in detailChart.data" :key="item">
            <router-link :to="{ name: 'deposit' }" class="left-detail">{{
              item.label === 'Withdrawal'
                ? $t('modal.chart_label_Withdrawal')
                : item.label === 'Deposit'
                ? $t('modal.chart_label_Deposit')
                : item.label
            }}</router-link>
            <span :style="item.money < 0 ? 'color: red' : 'color: black'" class="money-detail right-detail">
              <span class="start-color"
                ><p v-if="item.warnings.length > 0 && item.money > 0">*</p>
                {{ item.money.toLocaleString() }}</span
              >
              <div v-if="idTab">
                <template v-if="item.warnings.length">
                  <span class="note-money">{{ $filters.moment_l(item.warnings[0]) }}</span>
                </template>
              </div>
              <div v-else>
                <template v-if="item.warnings.length">
                  <span class="note-money__chart-all"
                    >{{ $filters.moment_l(item.warnings[0]) }} {{ $t('modal.cash_out') }}</span
                  >
                </template>
              </div>
            </span>
          </li>
          <div v-if="idTab">
            <hr class="dashed" />
            <li>
              <span class="left-detail">残高合計</span>
              <span class="right-detail">{{ totalMoney }}</span>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, onMounted, ref, toRefs, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import CloseIcon from '@/assets/icons/ico_close.svg'
import { find, forEach, map, split, findIndex, includes } from 'lodash-es'
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
    },
    isTabGroup: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const myChartRef = ref()
    const element = ref()
    const modalContent = ref()
    const checkDate = ref([])
    const dataPoint = ref({})
    const isActive = ref(false)
    const openChart = ref(false)
    const { dataChart, isTabGroup } = toRefs(props)
    const data = ref({ labels: [], datasets: [] })
    const plainOptions = ref([])
    const indicated = ref([1, 2])
    const idTab = ref(props.isTabGroup)

    const detailChart = ref({})
    const detailLabels = ref([])
    const detailMoney = ref([])
    const totalMoney = ref()

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
            autoSkip: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: (context) => {
              return !context.tick.value ? '#595959' : '#D9D9D9'
            }
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
            totalMoney.value = detailChart.value.totalMoney.toLocaleString()

            await reRenderPos()

            isActive.value = true
          })
        } else {
          forEach(data.value.datasets, (item) => {
            item.borderColor = item.borderColor.replace(/[\d.]+\)$/g, '1)')
            item.pointBorderColor = item.pointBorderColor.replace(/[\d.]+\)$/g, '1)')
            item.pointBackgroundColor = item.pointBackgroundColor.replace(/[\d.]+\)$/g, '1)')
          })
        }

        window.myLineChart.update()
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

    watch(
      isTabGroup,
      (value) => {
        idTab.value = value
        isActive.value = false
      },
      { immediate: true }
    )

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
          pointBackgroundColor: chart.pointBg,
          pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
          pointHoverBackgroundColor: chart.pointHoverBg,
          data: [...dataY]
        })
      })

      // re render chart
      window.myLineChart.update()
    })

    onMounted(() => {
      window.myLineChart = createChart()
    })

    const onToggleIndicated = (e) => {
      const index = findIndex(CHART, (item) => item.data_id === e.target.value)
      if (index > -1) {
        data.value.datasets[index].hidden = !e.target.checked
        window.myLineChart.update()
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
      let fullDate = null
      let dataId = null
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        if (nativeElement.length) {
          forEach(checkDate.value, (item, i) => {
            if (nativeElement[0].datasetIndex === i) {
              fullDate = item.detail[nativeElement[0].index].fulldate
              dataId = item.dataId
            }
          })
        }

        const filters = store.state.financing?.filters

        dataPoint.value = {
          ...filters.data,
          from_date: fullDate,
          to_date: fullDate,
          data_id: dataId
        }

        // eslint-disable-next-line no-useless-catch
        try {
          const { getDetailChart } = useGetDetailChartService(dataPoint.value, filters.params)
          const { result } = await getDetailChart()
          resolve(result)
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
      forEach(data.value.datasets, (item) => {
        item.borderColor = item.borderColor.replace(/[\d.]+\)$/g, '1)')
        item.pointBorderColor = item.pointBorderColor.replace(/[\d.]+\)$/g, '1)')
        item.pointBackgroundColor = item.pointBackgroundColor.replace(/[\d.]+\)$/g, '1)')
      })
      window.myLineChart.update()
    }

    const reRenderPos = () => {
      const left = element.value[0].element.x
      const top = element.value[0].element.y

      nextTick(() => {
        const width = modalContent.value.offsetWidth
        const height = modalContent.value.offsetHeight

        const canvasW = myChartRef.value.clientWidth
        // const canvasH = myChartRef.value.clientHeight

        modalContent.value.style.left = left + width >= canvasW ? `${left - width - 8}px` : `${left + 8}px`
        modalContent.value.style.top = `${top - height - 8}px`
      })
    }

    const opacityLine = (elm) => {
      const datasetIndex = elm[0].datasetIndex
      let opacity = null

      forEach(data.value.datasets, (item, index) => {
        opacity = index !== datasetIndex ? 0.4 : 1

        item.borderColor = item.borderColor.replace(/[\d.]+\)$/g, `${opacity})`)
        item.pointBorderColor = item.pointBorderColor.replace(/[\d.]+\)$/g, `${opacity})`)
        item.pointBackgroundColor = item.pointBackgroundColor.replace(/[\d.]+\)$/g, `${opacity})`)
      })

      window.myLineChart.update()
    }

    return {
      myChartRef,
      modalContent,
      isActive,
      openChart,
      plainOptions,
      indicated,
      detailChart,
      detailLabels,
      detailMoney,
      totalMoney,
      idTab,
      handleClose,
      onToggleIndicated
    }
  }
})
</script>
