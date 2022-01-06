<template>
  <div class="page-404">
    <div class="page-404__content">
      <img src="@/assets/images/404.png" alt="404 image" />
      <h1 class="page-404__content--title">Page not found.</h1>
      <h2 class="page-404__content--description">申し訳ございませんが、お探しのページが見つかりません。</h2>
      <router-link to="/">
        <a-button type="primary" size="large"> ダッシュボードへ行く </a-button>
      </router-link>
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

.page-404 {
  @include flexbox(center, flex-start);
  background-color: $color-grey-96;
  height: 100vh;

  &__content {
    @include flexbox(center, center);
    flex-direction: column;
    background-color: $color-grey-100;
    width: 100%;
    max-width: 936px;
    height: 490px;
    margin-top: 40px;

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
