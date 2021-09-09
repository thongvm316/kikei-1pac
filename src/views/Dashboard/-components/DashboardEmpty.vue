<template>
  <div class="dashboard-empty">
    <div class="dashboard-empty__content">
      <img src="@/assets/images/ooops.png" alt="ooops image" />
      <h1 class="dashboard-empty__content--title">データは表示されません。</h1>
      <h2 class="dashboard-empty__content--description">
        申し訳ありませんが、リクエストしたデータは表示されていません。
      </h2>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404Page'
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.dashboard-empty {
  @include flexbox(center, flex-start);
  height: 100%;
  margin-top: 40px;

  &__content {
    @include flexbox(flex-start, center);
    flex-direction: column;
    background-color: $color-grey-96;
    width: 100%;
    max-width: 936px;
    height: 100%;
    padding-top: 40px;

    &--title {
      font-size: 20px;
      font-weight: 700;
      line-height: 28px;
      color: $color-grey-15;
      margin-top: 32px;
    }

    &--description {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: $color-grey-15;
      margin-bottom: 32px;
    }
  }
}
</style>
