<template>
  <div class="canvas u-mx-n32">
    <canvas ref="myPieChartRef" />
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
        hoverOffset: 4
      }]
    }

    const createChart = () => {
      return new Chart(myPieChartRef.value, {
        type: 'pie',
        data
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
.canvas {
  width: 256px;
}
</style>
