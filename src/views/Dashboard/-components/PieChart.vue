<template>
  <div class="pie-chart">
    <div class="canvas">
      <canvas ref="myPieChartRef" />
    </div>

    <ul>
      <li v-for="(item, index) in explainChartText" :key="item.id">
        <span :class="`doted doted--${index + 1} ${item.isOther && 'other'}`"></span>{{ item.companyName }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import Chart from 'chart.js/auto'
import { uniqueId } from 'lodash-es'

window.pieChartRanking = null

export default defineComponent({
  name: 'PieChart',

  components: {},

  props: {
    rankingData: Array
  },

  setup(props) {
    const myPieChartRef = ref()
    const chartVal = ref()

    const dataPieChart = computed(() => {
      return props.rankingData?.map((item) => parseFloat(parseFloat(item.revenue).toFixed(0)))
    })

    const explainChartText = computed(() => {
      let explainChartText = props.rankingData?.filter((_, index) => index < chartVal.value.length - 1)
      explainChartText?.push({ icompanyId: uniqueId('__ranking_chart__'), companyName: 'その他', isOther: true })

      return explainChartText
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
          backgroundColor: '#ffffff',
          titleColor: '#262626',
          titleFont: { weight: 'normal', lighheight: '18px' },
          padding: { left: 16, top: 8, right: 16, bottom: 0 },
          position: 'average',
          caretSize: 0,

          callbacks: {
            title: function (context) {
              const [chartData] = context
              const sumData = dataPieChart.value.reduce((prep, next) => prep + next, 0)
              const percentData = parseFloat(parseFloat((chartData.raw * 100) / sumData).toFixed(0))

              return `¥ ${chartData.formattedValue} - ${percentData}%`
            },

            label: () => ''
          }
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

    const createOtherValueChart = (data) => {
      const count = data.reduce((prep, next) => prep + next, 0)
      const [top1, top2, ...others] = data
      let newChartVal = [top1, top2]
      let countOtherValue = 0

      others.forEach((item) => {
        if (item / count > 0.05) {
          newChartVal.push(item)
        } else {
          countOtherValue += item
        }
      })
      newChartVal.push(countOtherValue)
      chartVal.value = newChartVal

      return newChartVal
    }

    const handleValuePieChart = (data = []) => {
      if (data.length < 7) {
        return createOtherValueChart(data)
      } else {
        let valueFromTop6 = null
        let valuePieChart = []
        data.forEach((item, index) => {
          if (index < 5) {
            valuePieChart.push(item)
          } else {
            valueFromTop6 += item
          }
        })
        valuePieChart.push(valueFromTop6)

        return createOtherValueChart(valuePieChart)
      }
    }

    const handleColorChart = (length) => {
      const colorList = ['#FA8C16', '#2F54EB', '#13C2C2', '#52C41A', '#722ED1', '#8C8C8C']
      const colorOther = '#8C8C8C'
      const hoverBackgroundColor = ['#FFD591', '#ADC6FF', '#87E8DE', '#B7EB8F', '#D3ADF7', '#BFBFBF']
      const hoverColorOther = '#BFBFBF'

      if (length <= 3) {
        return {
          bachGround: ['#FA8C16', '#2F54EB', '#8C8C8C'],
          hoverBackground: ['#FFD591', '#ADC6FF', '#BFBFBF']
        }
      } else {
        colorList.splice(length - 1, colorList.length - (length - 1), colorOther)
        hoverBackgroundColor.splice(length - 1, hoverBackgroundColor.length - (length - 1), hoverColorOther)

        return {
          bachGround: colorList,
          hoverBackground: hoverBackgroundColor
        }
      }
    }

    watch(dataPieChart, (value) => {
      data.value.datasets = []
      const ValuePieChart = handleValuePieChart(value)
      const colorList = handleColorChart(ValuePieChart.length)

      // set datasets
      data.value.datasets.push({
        data: ValuePieChart,
        backgroundColor: colorList.bachGround,
        hoverBackgroundColor: colorList.hoverBackground,
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
      explainChartText,
      myPieChartRef,
      chartVal
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';

$doted-colors: (
  '1': #fa8c16,
  '2': $color-additional-blue-6,
  '3': #13c2c2,
  '4': #52c41a,
  '5': #722ed1,
  '6': $color-grey-55
);

.pie-chart {
  margin-left: 105px;
  margin-top: 24px;

  .canvas {
    width: 256px;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 16px;
    width: 256px;

    li {
      color: $color-grey-55;

      & + li {
        margin-top: 16px;
      }

      .doted {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 16px;

        @each $key, $val in $doted-colors {
          &--#{$key} {
            background-color: $val;
          }
        }

        &.other {
          background-color: $color-grey-55;
        }
      }
    }
  }
}
</style>
