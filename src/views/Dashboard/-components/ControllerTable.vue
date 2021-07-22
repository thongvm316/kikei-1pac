<template lang="">
  <div class="u-flex u-justify-between u-items-center">
    <p>{{ title }}</p>
    <div class="u-flex u-justify-between u-items-center">
      <div>
        Change postion:
        <a-button>UP</a-button>
        <a-button>Down</a-button>
      </div>
      <a-button>Remove</a-button>
    </div>
  </div>

  <a-tabs
    v-model:active-key="groupActive"
    default-active-key="1"
    class="u-mx-n32"
    :animated="false"
    @change="onHandleChangeGroup"
  >
    <a-tab-pane v-for="group in groupList" :key="group.id" :tab="group.name" />
  </a-tabs>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ControllerTable',

  props: {
    title: String,
    groupList: Object
  },

  setup(props) {
    const groupActive = ref()

    console.log('groupList', props.groupList)

    const onHandleChangeGroup = () => {}

    return {
      groupActive,
      onHandleChangeGroup
    }
  }
})
</script>

<style lang=""></style>
