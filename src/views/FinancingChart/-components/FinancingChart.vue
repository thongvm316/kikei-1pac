<template>
  <section class="chart">
    <a-button class="btn-chart" @click="openChart = true">
      <template #icon><LineChartOutlined /></template>
      {{ $t('modal.chart') }}
    </a-button>

    <div :class="{ active: openChart }" class="modal-chart">
      <close-icon class="icon" @click="openChart = false" />
      <div class="group-chart">
        <a-checkbox-group>
          <a-checkbox v-for="item in plainOptions" :key="item.id" :value="item.id">{{ item.value }}</a-checkbox>
        </a-checkbox-group>
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

import { forEach, map, split } from 'lodash-es'

import CloseIcon from '@/assets/icons/ico_close.svg'
import { LineChartOutlined } from '@ant-design/icons-vue'

window.myLineChart = null

const line1 = {
  borderColor: 'rgba(145, 213, 255, 1)',
  pointBorderColor: 'rgba(255, 255, 255, 1)',
  pointBackgroundColor: 'rgba(145, 213, 255, 1)',
  pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
  pointHoverBackgroundColor: 'rgba(9, 109, 217, 1)'
}

const line2 = {
  borderColor: 'rgba(255, 173, 210, 1)',
  pointBorderColor: 'rgba(255, 255, 255, 1)',
  pointBackgroundColor: 'rgba(255, 173, 210, 1)',
  pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
  pointHoverBackgroundColor: 'rgba(196, 29, 127, 1)'
}

const line3 = {
  borderColor: 'rgba(183, 235, 143, 1)',
  pointBorderColor: 'rgba(255, 255, 255, 1)',
  pointBackgroundColor: 'rgba(183, 235, 143, 1)',
  pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
  pointHoverBackgroundColor: 'rgba(56, 158, 13, 1)'
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
    dataId: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const myChartRef = ref()
    const element = ref()
    const modalContent = ref()

    const { dataChart } = toRefs(props)
    const { dataId } = toRefs(props)
    const results = ref(props.dataChart)
    const id = ref(props.dataId)

    const isActive = ref(false)
    const openChart = ref(false)

    const data = {
      labels: [],
      datasets: [
        {
          ...line1,
          label: 'My first dataset 1',
          fill: false,
          pointBorderWidth: 3,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3,
          pointRadius: 8,
          data: []
        },
        {
          ...line2,
          label: 'My first dataset 2',
          fill: false,
          pointBorderWidth: 3,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3,
          pointRadius: 8,
          data: []
        },
        {
          ...line3,
          label: 'My first dataset 3',
          fill: false,
          pointBorderWidth: 3,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3,
          pointRadius: 8,
          data: []
        }
      ]
    }

    const plainOptions = [
      {
        id: 0,
        label: 'Apple',
        value: 'Apple'
      },
      {
        id: 1,
        label: 'Pear',
        value: 'Pear'
      },
      {
        id: 2,
        label: 'Orange',
        value: 'Orange'
      }
    ]

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
              return data.datasets.some((val) => val.data[index] < 0) ? '#F5222D' : '#000000'
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
          console.log(data.labels[index], 'label')
          // console.log(data.datasets[datasetIndex].data[index], 'value')
          isActive.value = true
        } else {
          forEach(data.datasets, (item) => {
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

    watch(dataId, (val) => {
      id.value = val
    })

    watch(dataChart, (val) => {
      const dataShow = ref({})
      results.value = val

      for (let item in results.value) {
        dataShow.value = map(results.value[item].detail, (e) => {
          const element = {}
          element[e.date] = e.balance
          return element
        })

        const labels = map(dataShow.value, (item) => {
          return split(Object.keys(item)[0], ',')
        })

        const dataY = map(dataShow.value, (item) => {
          return Object.values(item)[0]
        })

        data.labels = labels
        data.datasets[item].data = dataY

        if (id.value === 1) {
          data.datasets[item] = { ...data.datasets[item], ...line1 }
          window.myLineChart.setDatasetVisibility(1, false)
          window.myLineChart.setDatasetVisibility(2, false)
        }
        if (id.value === 2) {
          data.datasets[item] = { ...data.datasets[item], ...line2 }
          window.myLineChart.setDatasetVisibility(1, false)
          window.myLineChart.setDatasetVisibility(2, false)
        }
        if (id.value === 3) {
          data.datasets[item] = { ...data.datasets[item], ...line3 }
          window.myLineChart.setDatasetVisibility(1, false)
          window.myLineChart.setDatasetVisibility(2, false)
        }
        if (id.value === 0) {
          if (results.value[item].dataId === 1) {
            data.datasets[item] = { ...data.datasets[item], ...line1 }
          }
          if (results.value[item].dataId === 2) {
            data.datasets[item] = { ...data.datasets[item], ...line2 }
          }
          if (results.value[item].dataId === 3) {
            data.datasets[item] = { ...data.datasets[item], ...line3 }
          }
        }
      }
      window.myLineChart.update()
    })

    onMounted(() => {
      window.myLineChart = createChart()
    })

    const createChart = () => {
      return new Chart(myChartRef.value, {
        type: 'line',
        data,
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

      forEach(data.datasets, (item, index) => {
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
      plainOptions
    }
  }
})
</script>
