<template>
  <div class="canvas u-mx-n32">
    <canvas ref="myBankLineChartRef" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

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
  name: 'BankLineChart',

  components: {},

  setup() {
    const myBankLineChartRef = ref()
    const labels = [
      '2021/07',
      '2021/08',
      '2021/09',
      '2021/10',
      '2021/11',
      '2021/12',
      '2022/01',
      '2022/02',
      '2022/03',
      '2022/04',
      '2022/05',
      '2022/06'
    ]
    const data = {
      labels,
      datasets: [
        {
          ...line1,
          fill: false,
          title: 'ACB',
          pointBorderWidth: 3,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 3,
          pointRadius: 10,
          data: [120, 100, 90, 65, 59, 80, 24, 56, 55, 12, 16, 120]
        },

        {
          ...line2,
          fill: false,
          title: 'TPBank',
          pointBorderWidth: 3,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 3,
          pointRadius: 10,
          data: [23, 43, 12, 45, 65, 76, 87, 1, 2, -4, 5, 50]
        },

        {
          ...line3,
          fill: false,
          title: 'Sacombank',
          pointBorderWidth: 3,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 3,
          pointRadius: 10,
          data: [43, 12, 23, 45, 65, 12, 12, 3, 4, -56, 6, 7]
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
          // title: {
          //   display: true,
          //   text: '2021/07',
          //   align: 'start'
          // }
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
          backgroundColor: 'red',
          titleColor: '#262626',
          callbacks: {
            // label: function(context) {
            //   return context.data.datasets.label
            // },
            // title: function(context) {
            //   return context.dataset.label
            // }
          }
        }
      }
    }

    const createChart = () => {
      return new Chart(myBankLineChartRef.value, {
        type: 'line',
        data,
        options,
      })
    }

    onMounted(() => {
      createChart()
    })

    return {
      myBankLineChartRef
    }
  }
})
</script>

<style lang="scss" scoped>
.canvas {
  background: #fff;

  canvas {
    padding: 0 32px;
  }
}
</style>
