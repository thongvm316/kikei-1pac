<template>
  <div class="page-403">
    <div class="page-403__content">
      <img src="@/assets/images/403.png" alt="403 image" />
      <h1 class="page-403__content--title">Forbidden</h1>
      <h2 class="page-403__content--description">申し訳ありません。このページへのアクセスを許可していません。</h2>
      <router-link to="/">
        <a-button type="primary" size="large"> ダッシュボードへ行く </a-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error403Page'
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.page-403 {
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
