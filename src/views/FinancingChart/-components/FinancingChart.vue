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

import { forEach, map } from 'lodash-es'

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
  borderColor: 'rgba(183, 235, 143, 1)',
  pointBorderColor: 'rgba(255, 255, 255, 1)',
  pointBackgroundColor: 'rgba(183, 235, 143, 1)',
  pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
  pointHoverBackgroundColor: 'rgba(56, 158, 13, 1)'
}

const line3 = {
  borderColor: 'rgba(255, 173, 210, 1)',
  pointBorderColor: 'rgba(255, 255, 255, 1)',
  pointBackgroundColor: 'rgba(255, 173, 210, 1)',
  pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
  pointHoverBackgroundColor: 'rgba(196, 29, 127, 1)'
}

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

    const { dataChart } = toRefs(props)
    const results = ref(props.dataChart)

    const isActive = ref(false)
    const openChart = ref(false)

    // const labels = [
    //   ['01', '2021/7'],
    //   '02',
    //   '03',
    //   '04',
    //   '05',
    //   '06',
    //   '07',
    //   '08',
    //   '09',
    //   '10',
    //   '11',
    //   '12',
    //   '13',
    //   '14',
    //   '15',
    //   '16',
    //   '17',
    //   '18',
    //   '19',
    //   '20',
    //   '21',
    //   '22',
    //   '23',
    //   '24',
    //   '25',
    //   '26',
    //   '27',
    //   '28',
    //   '29',
    //   '30',
    //   '31',
    //   ['01', '2021/8'],
    //   '02',
    //   '03',
    //   '04',
    //   '05',
    //   '06',
    //   '07',
    //   '08',
    //   '09',
    //   '10',
    //   '11',
    //   '12',
    //   '13',
    //   '14',
    //   '15',
    //   '16',
    //   '17',
    //   '18',
    //   '19',
    //   '20',
    //   '21',
    //   '22',
    //   '23',
    //   '24',
    //   '25',
    //   '26',
    //   '27',
    //   '28',
    //   '29',
    //   '30',
    //   '31'
    // ]

    const data = {
      labels: [],
      datasets: [
        {
          ...line1,
          label: 'My first dataset 1',
          fill: false,
          pointBorderWidth: 3,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 3,
          pointRadius: 10,
          data: []
        }
        // {
        //   ...line2,
        //   label: 'My first dataset 2',
        //   fill: false,
        //   pointBorderWidth: 3,
        //   pointHoverRadius: 10,
        //   pointHoverBorderWidth: 3,
        //   pointRadius: 10,
        //   data: [
        //     23, 43, 12, 45, 65, 76, 87, 1, 2, -4, 5, 98, -45, -100, -120, -90, 34, 12, 5, 6, 7, 43, 12, 23, 45, 65, 12,
        //     12, 3, 4, -56, 6, 7, -32, 12, 34, -99, -102, -210, 50, 34, 12
        //   ]
        // },
        // {
        //   ...line3,
        //   label: 'My first dataset 3',
        //   fill: false,
        //   pointBorderWidth: 3,
        //   pointHoverRadius: 10,
        //   pointHoverBorderWidth: 3,
        //   pointRadius: 10,
        //   data: [
        //     43, 12, 23, 45, 65, 12, 12, 3, 4, -56, 6, 7, -32, 12, 34, -99, -102, -210, 50, 34, 12, 23, 43, 12, 45, 65,
        //     76, 87, 1, 2, -4, 5, 98, -45, -100, -120, -90, 34, 12, 5, 6, 7, 43, 12, 23
        //   ]
        // }
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
          ticks: {
            stepSize: 50
          },
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
          // const index = element.value[0].index
          // console.log(data.labels[index], 'label')
          // console.log(data.datasets[datasetIndex].data[index], 'value')
          isActive.value = true
        } else {
          forEach(data.datasets, (item) => {
            item.borderColor = item.borderColor.replace(/[\d.]+\)$/g, '1)')
            item.pointBorderColor = item.pointBorderColor.replace(/[\d.]+\)$/g, '1)')
            item.pointBackgroundColor = item.pointBackgroundColor.replace(/[\d.]+\)$/g, '1)')
          })

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

    watch(dataChart, (val) => {
      results.value = val

      const dataShow = map(results.value[0].detail, (e) => {
        const element = {}
        element[e.date] = e.balance

        return element
      })

      const labels = map(dataShow, (item) => {
        return Object.keys(item)[0]
      })

      const dataY = map(dataShow, (item) => {
        return Object.values(item)[0]
      })

      data.labels = labels
      data.datasets[0].data = dataY

      console.log(data)

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
