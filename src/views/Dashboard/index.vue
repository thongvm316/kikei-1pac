<template>
  <div>
    <a-date-picker />
    <a-button type="primary">Button</a-button>
    <a-button type="primary" shape="circle" size="large" />

    <a-checkbox-group v-model:value="checkedList" :options="plainOptions" @change="onChange" />

     <a-pagination
      v-model:current="page"
      :total="101"
      :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
      :page-size="10"
      size="small" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Dashboard',

  setup() {
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const checkedList = ref(['Apple', 'Orange'])
    const page = ref(3)

    const onChange = () => {
      console.log('dsalkdksa')
    }

    return {
      page,
      plainOptions,
      checkedList,
      onChange
    }
  }
})
</script>
