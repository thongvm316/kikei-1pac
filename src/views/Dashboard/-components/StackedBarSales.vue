<template>
  <div class="stacked-bar">
    <p class="stacked-bar__rate">
      目標売上 <span>{{ `(${$filters.number_with_commas(dataSource?.revenueTarget)}):` }}</span>
      達成率 (受注)
      <span>{{ `${$filters.number_with_commas(dataSource?.achievementRate)}%` }}</span>
    </p>

    <div ref="stackedBarLineRef" class="stacked-bar__chart">
      <template v-for="(accuracy, accuracyIndex) in statistics" :key="accuracy.accuracyId">
        <template v-if="accuracy.accuracyCode && accuracy.accuracyCode !== 'S'">
          <div
            class="stacked-bar__item"
            :style="{ width: `${$filters.number_with_commas(accuracy.percent, 2)}%` }"
          ></div>

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
            <div class="stacked-bar__point" :data-point-index="accuracyIndex">
              <span>{{ accuracy.accuracyCode }}</span>
            </div>
          </a-popover>
        </template>

        <template v-else>
          <a-popover
            :title="
              accuracy.accuracyCode ? `${accuracy.accuracyCode} (${accuracy.accuracyName})` : accuracy.accuracyName
            "
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
              :style="{ width: `${$filters.number_with_commas(accuracy.percent, 2)}%` }"
            ></div>
          </a-popover>

          <a-popover
            v-if="accuracy.accuracyCode"
            :title="
              accuracy.accuracyCode ? `${accuracy.accuracyCode} (${accuracy.accuracyName})` : accuracy.accuracyName
            "
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
            <div class="stacked-bar__point" :data-point-index="accuracyIndex">
              <span>{{ accuracy.accuracyCode }}</span>
            </div>
          </a-popover>
        </template>
      </template>
    </div>

    <p class="stacked-bar__target">
      <span>{{ $filters.number_with_commas(dataSource?.revenueTarget) }}</span>
    </p>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onUpdated } from 'vue'
import { findLast, parseInt } from 'lodash-es'

export default defineComponent({
  name: 'StackedBarSales',

  props: {
    dataSource: Object
  },

  setup(props) {
    const stackedBarLineRef = ref()

    const statistics = computed(() => {
      if (!props?.dataSource?.statistics) return {}

      let totalPercent = 0
      const revenueTarget = props.dataSource?.revenueTarget || 0
      const totalRevenue = props.dataSource.statistics.reduce((acc, currentVal) => acc + currentVal.revenue, 0)

      const list = props.dataSource.statistics.map((accuracy) => {
        const _total = totalRevenue > revenueTarget ? totalRevenue : revenueTarget
        const percent = _total ? (accuracy?.revenue / _total) * 100 : 0
        totalPercent += percent

        return { ...accuracy, percent }
      })

      // remaiming
      const remainingPercent = 100 - totalPercent
      const remainingTarget = revenueTarget - totalRevenue
      list.push({
        accuracyId: 'remainingTarget',
        accuracyCode: '',
        accuracyName: '残り',
        revenue: remainingTarget > 0 ? remainingTarget : 0,
        percent: remainingPercent > 0 ? remainingPercent : 0
      })

      return list
    })

    const handlePointsOverlap = (event) => {
      const pointIndex = parseInt(event?.target.getAttribute('data-point-index') || -1)
      const pointElements = stackedBarLineRef.value.querySelectorAll('.stacked-bar__point')
      const stackedBarLineWidth = stackedBarLineRef.value?.offsetWidth || 0
      const pointWidth = stackedBarLineRef.value.querySelector('.stacked-bar__point span')?.offsetWidth || 0
      const pointPercent = (pointWidth / stackedBarLineWidth) * 100
      const lineItems = stackedBarLineRef.value?.querySelectorAll('.stacked-bar__item')
      const statistics = lineItems ? [...lineItems].map((el) => parseFloat(el?.style?.width || 0)) : []

      let _groups = []
      const pointGroups = statistics.map((item, index) => {
        const obj = {
          index,
          group: []
        }

        if (
          (index < statistics.length - 1 &&
            item >= pointPercent &&
            statistics[index + 1] < pointPercent &&
            _groups.length === 0) ||
          (item < pointPercent && _groups.length === 0) ||
          (index > 0 &&
            index < statistics.length - 1 &&
            statistics[index - 1] < pointPercent &&
            item >= pointPercent &&
            statistics[index + 1] < pointPercent)
        ) {
          _groups = [index]
        } else if (item < pointPercent && _groups.length > 0) {
          _groups.push(index)
        } else {
          _groups = []
        }

        obj.group = [..._groups]
        return obj
      })

      const pointGroupFound = findLast(pointGroups, (point) => point.group.indexOf(pointIndex) !== -1)
      const groups = pointGroupFound?.group || []
      if (groups.length < 2) return

      groups.forEach((item) => {
        if (
          (item === statistics.length - 2 && statistics[statistics.length - 1] < pointPercent) ||
          !pointElements[item]?.querySelector('span')
        )
          return

        pointElements[item].querySelector('span').classList.add('move-point')

        setTimeout(() => {
          pointElements[item].querySelector('span').classList.remove('move-point')
        }, 5000)
      })
    }

    onUpdated(() => {
      if (!stackedBarLineRef.value) return
      const pointElements = stackedBarLineRef.value.querySelectorAll('.stacked-bar__point')
      if (pointElements.length <= 1) return

      pointElements.forEach((el) => {
        // reset class
        el.querySelector('span').classList.remove('move-point')

        el.addEventListener('mouseenter', handlePointsOverlap)
        el.addEventListener('touchstart', handlePointsOverlap)
      })
    })

    return {
      statistics,
      stackedBarLineRef
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
    position: relative;
    background-color: $color-grey-100;
    transition: width 400ms linear;
  }

  &__point {
    position: relative;

    span {
      @include flexbox(center, center);

      position: absolute;
      content: '';
      top: -12px;
      left: -12px;
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

    move-point {
      position: relative;
      top: 0;
      left: auto;
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
