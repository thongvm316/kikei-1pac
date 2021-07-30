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
        <span :class="`${parseInt(item.formattedValue) < 0 ? 'chartjs-tooltip__item--red' : ''} u-ml-8`">{{ item.formattedValue }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, toRefs, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import Filter from '@/filters'
import { COLOR_CHART } from '@/enums/chart-line.enum'

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
      value.forEach((item, index) => {
        const dataY = item.dataByMonth.map(item => item.balance)

        data.value.datasets.push(
          {
            borderColor: COLOR_CHART[index].border,
            pointBorderColor: 'rgba(255, 255, 255, 1)',
            pointBackgroundColor: COLOR_CHART[index].pointBg,
            pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
            pointHoverBackgroundColor: COLOR_CHART[index].pointHoverBg,
            fill: false,
            title: item.bankAccountName || item.groupName,
            pointBorderWidth: 4,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 4,
            pointRadius: 8,
            data: dataY
          }
        )
        console.log('object');
      })

      console.log(data.value.datasets);

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
