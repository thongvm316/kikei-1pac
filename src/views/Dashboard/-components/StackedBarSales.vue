<template>
  <div class="stacked-bar">
    <p class="stacked-bar__rate">
      目標売上 <span>{{ `(${$filters.number_with_commas(dataSource?.revenueTarget)}):` }}</span>
      達成率 (受注)
      <span>{{ `${$filters.number_with_commas(dataSource?.achievementRate)}%` }}</span>
    </p>

    <div class="stacked-bar__chart">
      <a-popover
        v-for="accuracy in statistics"
        :key="accuracy.accuracyId"
        :title="accuracy.accuracyCode ? `${accuracy.accuracyCode} (${accuracy.accuracyName})` : accuracy.accuracyName"
        placement="bottom"
        overlay-class-name="stacked-bar__chart--popover"
      >
        <template #content>
          <p>{{ $filters.number_with_commas(accuracy.revenue) }}</p>
          <p v-if="accuracy.accuracyCode">{{ `達成率: ${accuracy.percent}%` }}</p>
        </template>
        <div class="stacked-bar__item" :style="{ width: `${accuracy.percent}%` }">
          <span>{{ accuracy.accuracyCode }}</span>
        </div>
      </a-popover>
    </div>

    <p class="stacked-bar__target">
      <span>{{ $filters.number_with_commas(dataSource?.revenueTarget) }}</span>
    </p>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'StackedBarSales',

  props: {
    dataSource: Object
  },

  setup(props) {
    const statistics = computed(() => {
      if (!props?.dataSource?.statistics) return {}

      let totalPercent = 0
      const revenueTarget = props.dataSource?.revenueTarget || 0
      const totalRevenue = props.dataSource.statistics.reduce((acc, currentVal) => acc + currentVal.revenue, 0)

      const list = props.dataSource.statistics.map((accuracy) => {
        const _total = totalRevenue > revenueTarget ? totalRevenue : revenueTarget
        const percent = (accuracy?.revenue / _total) * 100
        // const percent = 15
        totalPercent += percent

        return { ...accuracy, percent }
      })

      const remainingPercent = 100 - totalPercent
      list.push({
        accuracyId: 'remainingTarget',
        accuracyCode: '',
        accuracyName: '残り',
        revenue: revenueTarget,
        percent: remainingPercent > 0 ? remainingPercent : 0
      })

      console.log('list', list)

      return list
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
  margin: 12px 32px;

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
    // width: 100%;
    position: relative;
    background-color: $color-grey-100;

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

    span {
      display: none;
    }
  }
}
</style>
