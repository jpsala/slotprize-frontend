<template>
<div class="self-center">
  <q-btn-group push outline :class="right ? 'float-right' : '' ">
    <q-btn push :disable="cancelDisable || disable" :size="size"  :color="cancelColor" :label="showLabels ? labelCancel : ''" icon="close" @click="$emit('cancel')"  />
    <q-btn push :disable="submitDisable || disable" :size="size"  :color="saveColor" :label="showLabels ? labelSave : ''" icon="save" @click="$emit('submit')" class="" />
  </q-btn-group>
  <span  style="clear: both">&nbsp;</span>
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
    labelSave: { default: 'Save' },
    labelCancel: { default: 'Cancel' },
    saveColor: { default: 'green-7' },
    cancelColor: { default: 'red-7' },
    size: { default: 'md' }
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
