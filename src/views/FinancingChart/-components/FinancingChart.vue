<template>
  <section class="chart">
    <a-button class="btn-chart" @click="openChart = true">
      <template #icon><LineChartOutlined /></template>
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
          {{ item.data_name }}
        </a-checkbox>
      </div>
    </div>

    <div class="canvas">
      <canvas ref="myChartRef" @click=";(isActive = false), (openChart = false)" />

      <div ref="modalContent" :class="{ active: isActive }" class="modal-content">
        <close-icon class="icon" @click="isActive = false" />
        <ul>
          <li>
            <span>銀行名 (VND)</span>
            <span>9,999,999,999,999,999</span>
          </li>
          <li class="negative">
            <span>銀行名 (USD)</span>
            <span>-999,999,999</span>
          </li>
          <li class="negative">
            <span>銀行名 (USD)</span>
            <span>-999,999,999,999</span>
          </li>
          <li>
            <span>銀行名 (VND)</span>
            <span>9,999,999,999,999,999</span>
          </li>
          <li>
            <span>銀行名 (VND)</span>
            <span>9,999,999,999,999,999</span>
          </li>
          <hr class="dashed" />
          <li>
            <span>銀行名 (VND)</span>
            <span>9,999,999,999,999,999</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import Chart from 'chart.js/auto'
import CloseIcon from '@/assets/icons/ico_close.svg'
import { find, forEach, map, split, findIndex } from 'lodash-es'
import { LineChartOutlined } from '@ant-design/icons-vue'
import { CHART } from '@/enums/chart-line.enum'

window.myLineChart = null

export default defineComponent({
  name: 'Index',

  components: { CloseIcon, LineChartOutlined },

  props: {
    dataChart: {
      type: [Array, Object],
      required: true,
      default: () => []
    }
  },

  setup(props) {
    const myChartRef = ref()
    const element = ref()
    const modalContent = ref()
    const isActive = ref(false)
    const openChart = ref(false)
    const { dataChart } = toRefs(props)
    const data = ref({ labels: [], datasets: [] })
    const plainOptions = ref([])
    const indicated = ref([1, 2])

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.4,
      layout: {
        padding: {
          top: 55,
          left: 32
        }
      },
      scales: {
        x: {
          grid: {
            color: 'transparent',
            borderColor: '#8C8C8C',
            tickColor: '#8C8C8C'
          },
          ticks: {
            color: ({ index }) => {
              return data.value.datasets.some((val) => val.data[index] < 0) ? '#F5222D' : '#000000'
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
          reRenderPos()
          opacityLine(nativeElement)
          // const datasetIndex = element.value[0].datasetIndex
          const index = element.value[0].index
          console.log(data.value.labels[index], 'label')
          // console.log(data.datasets[datasetIndex].data[index], 'value')
          isActive.value = true
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

    watch(dataChart, (value) => {
      // reset dataset when switch tab group
      data.value.datasets = []
      plainOptions.value = []

      // indicates setting <=> all group (tab)
      if (value.length > 1) {
        plainOptions.value = map(value, (item) => {
          const chart = find(CHART, (i) => i.data_id === item.dataId)
          return { data_id: item.dataId, data_name: item.dataName, color: chart.border, checked: true }
        })
      }

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
          pointBorderWidth: 3,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3,
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
    }

    const mapChart = (data) => {
      return map(data, (e) => {
        const element = {}
        element[e.date] = e.balance
        return element
      })
    }

    const mapLabel = (data) => {
      return map(data, (i) => split(Object.keys(i)[0], ','))
    }

    const mapDataY = (data) => {
      return map(data, (i) => Object.values(i)[0])
    }

    const createChart = () => {
      return new Chart(myChartRef.value, {
        type: 'line',
        data: data.value,
        options,
        plugins: [plugins]
      })
    }

    const reRenderPos = () => {
      const left = element.value[0].element.x
      const top = element.value[0].element.y
      const width = modalContent.value.offsetWidth
      const height = modalContent.value.offsetHeight

      if (left > 1200) {
        modalContent.value.style.left = left - width - 10 + 'px'
      } else {
        modalContent.value.style.left = left + 10 + 'px'
      }

      if (top > height / 1.75) {
        modalContent.value.style.top = top - height + 'px'
      } else {
        modalContent.value.style.top = top + 'px'
      }
    }

    const opacityLine = (elm) => {
      const datasetIndex = elm[0].datasetIndex

      forEach(data.value.datasets, (item, index) => {
        if (index !== datasetIndex) {
          item.borderColor = item.borderColor.replace(/[\d.]+\)$/g, '0.2)')
          item.pointBorderColor = item.pointBorderColor.replace(/[\d.]+\)$/g, '0.2)')
          item.pointBackgroundColor = item.pointBackgroundColor.replace(/[\d.]+\)$/g, '0.2)')
        } else {
          item.borderColor = item.borderColor.replace(/[\d.]+\)$/g, '1)')
          item.pointBorderColor = item.pointBorderColor.replace(/[\d.]+\)$/g, '1)')
          item.pointBackgroundColor = item.pointBackgroundColor.replace(/[\d.]+\)$/g, '1)')
        }
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
      onToggleIndicated
    }
  }
})
</script>
