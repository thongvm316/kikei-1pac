<template>
  <div class="canvas u-relative">
    <canvas ref="myBankLineChartRef" />
    <div class="chartjs-tooltip">
      <p
        v-for="item in contentTooltip"
        :key="item.index"
        class="chartjs-tooltip__item"
      >
        <span class="u-text-weight-700">{{ item.dataset.title }}</span>
        <span :class="`${item.formattedValue < 0 ? 'chartjs-tooltip__item--red' : ''} u-ml-8`">{{ item.formattedValue }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, toRefs, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import Filter from '@/filters'

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
window.bankLineChart = null

export default defineComponent({
  name: 'BankLineChart',

  props: {
    bankBalance: Array
  },

  setup(props) {
    const myBankLineChartRef = ref()
    const { bankBalance } = toRefs(props)
    const contentTooltip = ref()

    const data = ref({
      labels: [],
      datasets: []
    })

    // label


    // data
    // const data = {
    //   labels,
    //   datasets: [
    //     {
    //       ...line1,
    //       fill: false,
    //       title: 'ACB',
    //       pointBorderWidth: 3,
    //       pointHoverRadius: 10,
    //       pointHoverBorderWidth: 3,
    //       pointRadius: 10,
    //       data: [12, 100, 90, 65, 59, 80, 24, 56, 55, 12, 16, 120]
    //     },

    //     {
    //       ...line2,
    //       fill: false,
    //       title: 'TPBank',
    //       pointBorderWidth: 3,
    //       pointHoverRadius: 10,
    //       pointHoverBorderWidth: 3,
    //       pointRadius: 10,
    //       data: [23, 43, 12, 45, 65, 76, 87, 1, 2, -4, 5, 50]
    //     },

    //     {
    //       ...line3,
    //       fill: false,
    //       title: 'Sacombank',
    //       pointBorderWidth: 3,
    //       pointHoverRadius: 10,
    //       pointHoverBorderWidth: 3,
    //       pointRadius: 10,
    //       data: [43, 12, 23, 45, 65, 12, 12, 3, 4, -56, 6, 7]
    //     }
    //   ]
    // }

    // options
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.4,
      layout: {
        padding: {
          top: 40,
          left: 32,
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
            }
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
          enabled: false,
          external: function(context) {
            nextTick(() => {
              // Tooltip Element
              const tooltipEl = document.querySelector('.chartjs-tooltip')
              const { tooltip: tooltipModel } = context

              // Hide if no tooltip
              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0
                return
              }

              // Set content
              const { dataPoints } = tooltipModel
              contentTooltip.value = dataPoints

              // Display, position
              const leftTooltip = tooltipModel.x
              const topTooltip = tooltipModel.y
              const widthTooltip = tooltipEl.offsetWidth
              const heightTooltip = tooltipEl.offsetHeight
              const canvasW = myBankLineChartRef.value.clientWidth

              tooltipEl.classList.add('active')
              tooltipEl.style.opacity = 1;
              tooltipEl.style.left = leftTooltip + widthTooltip >= canvasW ? `${leftTooltip - widthTooltip}px` : `${leftTooltip}px`
              tooltipEl.style.top = `${topTooltip - heightTooltip}px`
            })
          }
        }
      }
    }

    // init chart
    const createChart = () => {
      return new Chart(myBankLineChartRef.value, {
        type: 'line',
        data: data.value,
        options
      })
    }

    watch(bankBalance, (value) => {
      data.value.datasets = []

      // set datasets
      value.forEach(item => {
        const dataY = item.dataByMonth.map(item => item.balance) // số này quá lớn

        data.value.datasets.push(
          {
            borderColor: 'rgba(255, 173, 210, 1)',
            pointBorderColor: 'rgba(255, 255, 255, 1)',
            pointBackgroundColor: 'rgba(255, 173, 210, 1)',
            pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
            pointHoverBackgroundColor: 'rgba(196, 29, 127, 1)',
            fill: false,
            title: item.bankAccountName,
            pointBorderWidth: 3,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 3,
            pointRadius: 10,
            data: [43, 12, 23, 45, 65, 12, 12, 3, 4, -56, 6, 7] // số này qúa lớn sẽ crash
          }
        )
      })

      // set labels
      data.value.labels = value[0].dataByMonth.map(item => Filter.moment_yyyy_mm(item.month))

      // update chart
      window.bankLineChart.update()
    })

    onMounted(() => {
      window.bankLineChart = createChart()
    })

    return {
      myBankLineChartRef,
      contentTooltip
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';

.canvas {
  background-color: $color-grey-100;

  canvas {
    // padding-left: 32px;
    padding-right: 32px;
  }

  .chartjs-tooltip {
    background-color: $color-grey-100;
    padding: 8px 16px;
    border-radius: 2px;
    box-shadow: 0px 8px 16px 0px #3232470F, 0px 8px 8px 0px #32324714;
    position: absolute;
    background-clip: padding-box;
    border: 0;
    visibility: hidden;
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
    z-index: 10;

    &__item {
      margin-bottom: 4px;

      &--red {
        color: $color-additional-red-6;
      }
    }

    &__item:last-child {
      margin-bottom: 0;
    }

    &.active {
      visibility: visible;
      transition: all 0.2s ease-in;
      opacity: 1;
    }
  }
}
</style>
