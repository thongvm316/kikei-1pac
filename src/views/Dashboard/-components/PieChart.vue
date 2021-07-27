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
import { defineComponent, ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

export default defineComponent({
  name: 'PieChart',

  components: {},

  setup () {
    const myPieChartRef = ref()
    const labels = ['red', 'green', 'yellow']
    const data = {
      labels,
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        borderColor: '#FFFFFF',
        hoverBorderWidth: 0
      }]
    }

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
        data,
        options
      })
    }

    onMounted(() => {
      createChart()
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
  margin-left: 68px;
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
