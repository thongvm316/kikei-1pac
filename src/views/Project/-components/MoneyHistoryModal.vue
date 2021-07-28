<template>
  <div v-show="visible" class="money-history">
    <div class="money-history__head">
      <p>金額変更詳細</p>
      <closeIcon class="u-cursor-pointer" @click="handleCancel" />
    </div>

    <div class="money-history__body">
      <div class="money-history__body--scroll">
        <div v-for="item in project.value?.adProjectMoneyHistories" :key="item.id" class="money-history__item">
          <p>{{ item.createdAt }}</p>
          <p>{{ item.money }} ({{ item.adCurrency.code }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import CloseIcon from '@/assets/icons/ico_close.svg'

export default defineComponent({
  name: 'MoneyHistoryModal',

  components: {
    CloseIcon
  },

  props: {
    project: Object,
    visible: Boolean
  },

  setup(props, { emit }) {
    const visible = computed(() => props.visible)

    const handleCancel = () => {
      emit('update:visible', false)
    }

    return {
      visible,
      handleCancel
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.money-history {
  @include y-centered();
  z-index: 200;
  left: calc(100% + 97px);
  width: 390px;
  box-shadow: 0px 8px 16px 0px #3232470f;
  box-shadow: 0px 8px 8px 0px #32324714;
  border-radius: 5px;

  &__head {
    @include flexbox(space-between, center);
    padding: 12px 24px;
    background-color: $color-grey-94;
    border-radius: 5px;

    p {
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      color: $color-primary-9;
    }
  }

  &__body {
    background-color: $color-grey-100;
    border-end-end-radius: 5px;
    border-end-start-radius: 5px;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: $color-grey-15;
    padding: 16px 0 10px 24px;

    &--scroll {
      max-height: 153px;
      overflow-y: auto;
      padding-right: 24px;
    }
  }

  &__item {
    @include flexbox(space-between, center);
    font-size: 12px;
    line-height: 18px;
    color: $color-grey-15;
    border-bottom: 1px solid $color-grey-85;
    padding-bottom: 6px;

    &:not(:first-child) {
      padding-top: 6px;
    }
  }

  p {
    margin-bottom: 0;
  }
}
</style>
