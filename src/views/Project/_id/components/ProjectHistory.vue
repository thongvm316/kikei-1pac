<template>
  <div :class="['project-history', isCollapse && 'isCollapse']">
    <div class="project-history__header">
      <div class="u-flex u-items-center">
        <history-icon style="height: 20px" />
        <span class="project-history__heading">変更履歴</span>
      </div>
      <div>
        <DownOutlined
          :class="['project-history__arrow-icon', isCollapse && 'isCollapse']"
          @click="isCollapse = !isCollapse"
        />
      </div>
    </div>

    <a-collapse :active-key="isCollapse ? [] : [1]" :bordered="false" class="project-history__collapse">
      <a-collapse-panel key="1">
        <div class="project-history__body">
          <template v-if="projectHistory && projectHistory.length > 0">
            <div v-for="item in projectHistory" :key="item.index" class="project-history__item">
              <p class="u-text-weight-700">{{ moment(item.createdAt).format('YYYY-MM-DD - HH:mm') }}</p>
              <p>{{ item.username }}</p>
              <p class="u-flex">
                <span class="u-whitespace-nowrap">変更箇所：</span
                ><span>{{ $t(`project.project_history.${item.fieldName}`) }}</span>
              </p>
              <p class="u-flex">
                <span class="u-whitespace-nowrap">変更前：</span><span>{{ item.oldValue }}</span>
              </p>
              <p class="u-flex">
                <span class="u-whitespace-nowrap">変更後：</span><span>{{ item.newValue }}</span>
              </p>
            </div>
          </template>

          <div v-else class="project-history__empty-state">No history</div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import HistoryIcon from '@/assets/icons/ico_history.svg'
import { DownOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref } from 'vue'
import moment from 'moment'

export default defineComponent({
  name: 'ProjectHistory',

  components: {
    HistoryIcon,
    DownOutlined
  },

  props: {
    projectHistory: {
      type: Array,
      default: undefined
    }
  },

  setup() {
    const isCollapse = ref()

    return {
      isCollapse,
      moment
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.project-history {
  border: 1px solid $color-grey-75;

  &.isCollapse {
    border-bottom: none;
  }

  &__header {
    border-bottom: 1px solid $color-grey-75;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px 16px 32px;
    background-color: $color-grey-92;
  }

  &__heading {
    font-size: 16px;
    margin-left: 8px;
    line-height: 24px;
  }

  &__arrow-icon {
    color: $color-grey-55;
    transition: transform 0.2s;

    &.isCollapse {
      transform: rotate(90deg);
      transition: transform 0.2s;
    }
  }

  &__body {
    background-color: $color-grey-94;
    padding: 0 64px 0 32px;

    p {
      margin-bottom: 4px;
    }
  }

  &__item {
    padding: 16px 0;
    font-size: 12px;

    & + .project-history__item {
      border-top: 1px dashed $color-grey-85;
    }
  }

  &__empty-state {
    padding: 16px 0;
  }

  &__collapse {
    .ant-collapse-header {
      display: none;
    }

    .ant-collapse-content-box {
      padding: 0 !important;
    }

    .ant-collapse-item {
      border-bottom: 0;
    }
  }
}
</style>
