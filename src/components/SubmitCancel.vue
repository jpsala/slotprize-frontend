<template>
<div class="self-center">
  <q-btn-group push outline :class="right ? 'float-right' : '' ">
    <q-btn push :disable="cancelDisable || disable" :size="size"  :color="cancelColor" :label="showLabels ? labelCancel : ''" icon="close" @click="$emit('cancel')"  />
    <q-btn push :disable="submitDisable || disable" :size="size"  :color="saveColor" :label="showLabels ? labelSubmit : ''" icon="save" @click="$emit('submit')" class="" />
  </q-btn-group>
  <div style="clear: both"></div>
</div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api'
export default {
  props: {
    submitDisable: { default: false },
    cancelDisable: { default: false },
    disable: { default: false },
    right: { default: false },
    showLabels: { default: true },
    labelSubmit: { default: 'Save' },
    labelCancel: { default: 'Cancel' },
    saveColor: { default: 'green-7' },
    cancelColor: { default: 'red-7' },
    size: { default: '' }
  },
  setup (props) {
    const state = reactive({
      xxx: undefined
    })
    return { ...toRefs(state) }
  }
}
</script>
<style>
</style>
