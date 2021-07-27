<template>
  <div class="pie-chart">
    <div class="canvas">
      <canvas ref="myPieChartRef" />
    </div>

    <ul>
      <li><span class="doted"></span>xanh</li>
      <li><span class="doted"></span>do</li>
      <li><span class="doted"></span>tim</li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import Chart from 'chart.js/auto'

window.pieChartRanking = null

export default defineComponent({
  name: 'PieChart',

  props: {
    rankingData: Array
  },

  components: {},

  setup (props) {
    const myPieChartRef = ref()
    const dataPieChart = computed(() => {
      return props.rankingData?.map(item => parseInt(item.revenue))
    })

    const data = ref({ datasets: [] })

    const options = {
      responsive: true,
      maintainAspectRatio: true,

      plugins: {
        legend: {
          display: false
        },

        tooltip: {
          backgroundColor: 'red',
          titleColor: '#262626'
        }
      }
    }

    const createChart = () => {
      return new Chart(myPieChartRef.value, {
        type: 'pie',
        data: data.value,
        options
      })
    }

    watch(dataPieChart, (value) => {
      data.value.datasets = []

      let xxx = null

      if (value.length < 7) {
        xxx = value
      } else {
        xxx = [10, 20, 30, 40, 50]
      }

      // set datasets
      data.value.datasets.push({
        data: xxx,
        backgroundColor: [
          '#FA8C16',
          '#2F54EB',
          '#13C2C2',
          '#52C41A',
          '#722ED1',
          '#8C8C8C'
        ],
        hoverBackgroundColor: [
          '#FFD591',
          '#ADC6FF',
          '#87E8DE',
          '#B7EB8F',
          '#D3ADF7',
          '#BFBFBF'
        ],
        borderColor: '#FFFFFF',
        hoverBorderWidth: 0
      })

      // update pie chart
      window.pieChartRanking.update()
    })

    onMounted(() => {
      window.pieChartRanking = createChart()
    })

    return {
      myPieChartRef
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';

.pie-chart {
  display: flex;
  margin-left: 105px;
  margin-top: 24px;

  .canvas {
    width: 256px;
  }

  ul {
    list-style: none;

    li {
      color: $color-grey-55;

      .doted {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: red;
        margin-right: 16px;
      }
    }
  }
}
</style>
