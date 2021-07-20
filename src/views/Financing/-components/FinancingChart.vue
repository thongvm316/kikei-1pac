<template>
  <div class="canvas">
    <canvas ref="myChartRef" @click="isActive = false" />
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
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import CloseIcon from '@/assets/icons/ico_close.svg'
import useGetDataChartService from '@/views/Financing/composables/useGetDataChartService'
import store from '@/store'
import { forEach } from 'lodash-es'

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

  components: { CloseIcon },

  async beforeRouteEnter(to, from, next) {
    // Get Dashboards
    const { getData } = await useGetDataChartService()
    const { result } = await getData()
    console.log('result', result.data)

    store.commit('chart/SET_CHART', { ...result.data })

    next()
  },

  setup() {
    const myChartRef = ref()
    // const myLineChart = ref()
    const element = ref()
    const modalContent = ref()
    const isActive = ref(false)

    const labels = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18'
    ]

    const data = {
      labels: labels,
      datasets: [
        {
          ...line1,
          label: 'My first dataset 1',
          fill: false,
          pointBorderWidth: 3,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 3,
          pointRadius: 10,
          data: [120, 100, 90, 65, 59, 80, 24, 56, 55, 12, 16, 17, -20, 80, 20, -5, 34, 12, 5, 6, 7]
        },
        {
          ...line2,
          label: 'My first dataset 2',
          fill: false,
          pointBorderWidth: 3,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 3,
          pointRadius: 10,
          data: [23, 43, 12, 45, 65, 76, 87, 1, 2, -4, 5, 98, -45, -100, -120, -90, 34, 12, 5, 6, 7]
        },
        {
          ...line3,
          label: 'My first dataset 3',
          fill: false,
          pointBorderWidth: 3,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 3,
          pointRadius: 10,
          data: [43, 12, 23, 45, 65, 12, 12, 3, 4, -56, 6, 7, -32, 12, 34, -99, -102, -210, 50, 34, 12]
        }
      ]
    }

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.4,
      layout: {
        padding: {
          top: 40,
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
            }
          },
          title: {
            display: true,
            text: '2021/07',
            align: 'start'
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

    onMounted(() => {
      window.myLineChart = createChart()

      // window.addEventListener('resize', () => {
      //   if (element.value.length) {
      //     reRenderPos()
      //   }
      // })
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
      isActive
    }
  }
})
</script>

<style scoped lang="scss">
.canvas {
  position: relative;
  height: calc(100vh - 230px);
  background: #fff;

  canvas {
    position: absolute;
    background-color: #fff;
  }

  .modal-content {
    position: absolute;
    background-color: #fff;
    background-clip: padding-box;
    border: 0;
    border-radius: 2px;
    box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
    pointer-events: auto;
    width: 22vw;
    visibility: hidden;
    opacity: 0;
    transition: all 0.2s ease-in;
    z-index: 10;

    &.active {
      visibility: visible;
      opacity: 1;
    }
  }

  .icon {
    position: absolute;
    top: 11px;
    right: 16px;
    cursor: pointer;
  }

  ul {
    list-style: none;
    margin-top: 31px;
    padding: 0 16px 16px;
    margin-bottom: 0;

    hr.dashed {
      border-top: 1px dashed #000000;
    }

    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      span {
        font-size: 0.97vw;
      }

      &.negative {
        span:last-child {
          color: #f5222d;
        }
      }
    }
  }
}
</style>
