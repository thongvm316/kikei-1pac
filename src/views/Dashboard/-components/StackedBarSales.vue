<template>
  <div class="stacked-bar">
    <p class="stacked-bar__rate">
      目標売上 <span>{{ `(${$filters.number_with_commas(dataSource?.revenueTarget)}):` }}</span>
      達成率 (受注)
      <span>{{ `${$filters.number_with_commas(dataSource?.achievementRate)}%` }}</span>
    </p>

    <div class="stacked-bar__chart">
      <template v-for="accuracy in statistics" :key="accuracy.accuracyId">
        <div
          v-if="accuracy.accuracyCode && accuracy.accuracyCode !== 'S'"
          class="stacked-bar__item"
          :style="{ width: `${$filters.number_with_commas(accuracy.percentVisible, 2)}%` }"
        >
          <a-popover
            :title="
              accuracy.accuracyCode ? `${accuracy.accuracyCode} (${accuracy.accuracyName})` : accuracy.accuracyName
            "
            placement="bottom"
            :overlay-class-name="`stacked-bar__chart--popover${!accuracy.accuracyCode ? ' popover-last-child' : ''}`"
          >
            <template #content>
              <p>{{ $filters.number_with_commas(accuracy.revenue) }}</p>
              <p class="u-text-grey-55">
                達成率:<span class="u-text-grey-15">
                  {{ ` ${$filters.number_with_commas(accuracy.percent, 2)}%` }}
                </span>
              </p>
            </template>
            <span>{{ accuracy.accuracyCode }}</span>
          </a-popover>
        </div>

        <a-popover
          v-else
          :title="accuracy.accuracyCode ? `${accuracy.accuracyCode} (${accuracy.accuracyName})` : accuracy.accuracyName"
          :placement="accuracy.accuracyCode === 'S' ? 'bottomLeft' : 'bottomRight'"
          :overlay-class-name="`stacked-bar__chart--popover${!accuracy.accuracyCode ? ' popover-last-child' : ''}`"
        >
          <template #content>
            <p>{{ $filters.number_with_commas(accuracy.revenue) }}</p>
            <p class="u-text-grey-55">
              達成率:<span class="u-text-grey-15">
                {{ ` ${$filters.number_with_commas(accuracy.percent, 2)}%` }}
              </span>
            </p>
          </template>
          <div
            class="stacked-bar__item"
            :style="{ width: `${$filters.number_with_commas(accuracy.percentVisible, 2)}%` }"
          >
            <span v-if="accuracy.accuracyCode">{{ accuracy.accuracyCode }}</span>
          </div>
        </a-popover>
      </template>
    </div>

    <p class="stacked-bar__target">
      <span>{{ $filters.number_with_commas(dataSource?.revenueTarget) }}</span>
    </p>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onUpdated, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'

export default defineComponent({
  name: 'StackedBarSales',

  props: {
    dataSource: Object
  },

  setup(props) {
    const pointPercent = ref(0)

    const statistics = computed(() => {
      if (!props?.dataSource?.statistics) return {}

      let totalPercent = 0
      const revenueTarget = props.dataSource?.revenueTarget || 0
      const totalRevenue = props.dataSource.statistics.reduce((acc, currentVal) => acc + currentVal.revenue, 0)

      const list = props.dataSource.statistics.map((accuracy, accuracyIndex) => {
        const _total = totalRevenue > revenueTarget ? totalRevenue : revenueTarget
        const percent = _total ? (accuracy?.revenue / _total) * 100 : 0

        const percentVisible = accuracyIndex !== 0 && percent < pointPercent.value ? pointPercent.value * 0.7 : percent
        totalPercent += percentVisible

        return { ...accuracy, percent, percentVisible }
      })

      // remaiming point
      const remainingPercent = 100 - totalPercent > 0 ? 100 - totalPercent : 0
      const remainingTarget = revenueTarget - totalRevenue
      list.push({
        accuracyId: 'remainingTarget',
        accuracyCode: '',
        accuracyName: '残り',
        revenue: remainingTarget > 0 ? remainingTarget : 0,
        percent: remainingPercent,
        percentVisible: remainingPercent
      })
      return list
    })

    const calculatePercentagePoint = () => {
      const stackedBarEl = document.querySelector('.stacked-bar__chart')
      if (!stackedBarEl) {
        pointPercent.value = 0
        return
      }

      const stackedBarLineWidth = stackedBarEl.offsetWidth || 0
      const pointWidth = stackedBarEl.querySelector('.stacked-bar__item span')?.offsetWidth || 0
      pointPercent.value = (pointWidth / stackedBarLineWidth) * 100
    }

    onUpdated(() => {
      calculatePercentagePoint()
    })

    onMounted(() => {
      window.addEventListener('resize', debounce(calculatePercentagePoint, 500))
    })

    onUnmounted(() => {
      window.removeEventListener('resize', calculatePercentagePoint)
    })

    return {
      statistics
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.stacked-bar {
  @include flexbox(center, flex-end);
  flex-direction: column;
  margin: 32px 32px 12px;

  &__chart {
    @include flexbox(center, center);
    flex-direction: row;
    height: 12px;
    width: 100%;
    position: relative;

    &--popover {
      text-align: center;
      font-size: 12px;
      line-height: 18px;

      .ant-popover-title {
        font-weight: 700;
        color: $color-primary-9;
        border-bottom: 0;
        padding: 0;
      }

      .ant-popover-inner {
        padding: 8px 16px;
      }

      .ant-popover-inner-content {
        padding: 0;
      }

      .ant-popover-title {
        min-height: 18px;
      }

      p {
        margin-bottom: 0;
      }
    }
  }

  &__rate {
    color: $color-grey-55;

    span {
      color: $color-grey-15;
      font-weight: 700;
    }

    span:last-child {
      color: $color-additional-blue-6;
    }
  }

  &__target {
    color: $color-grey-15;
    font-weight: 700;
    margin-top: 6px;
  }

  &__item {
    height: 100%;
    width: 100%;
    position: relative;
    background-color: $color-grey-100;
    transition: width 400ms linear;

    span {
      @include flexbox(center, center);

      position: absolute;
      content: '';
      top: -6px;
      right: -12px;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background-color: $color-grey-85;
      z-index: 1;

      &:hover {
        background-color: $color-primary-9;
        color: $color-grey-100;
        cursor: default;
      }
    }
  }

  &__item:first-child {
    background-color: $color-additional-blue-6;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;

    &:hover {
      background-color: $color-additional-blue-4;

      span {
        background-color: $color-additional-blue-4;
      }
    }

    span {
      color: $color-grey-100;
      background-color: $color-additional-blue-6;
    }
  }

  &__item:last-child {
    background-color: $color-additional-red-6;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;

    &:hover {
      background-color: $color-additional-red-4;
    }

    .ant-popover-title {
      color: $color-additional-red-6;
    }
  }
}

.stacked-bar__chart--popover.popover-last-child {
  .ant-popover-title {
    color: $color-additional-red-6;
  }
}
</style>
