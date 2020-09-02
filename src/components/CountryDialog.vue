<template>
<div>
<q-dialog v-model="showDialog" persistent transition-show="scale" transition-hide="scale">
    <CountryEdit @cancel="$emit('cancel')" :country="country" :languages="languages"
                 @close="function(formData){ $emit('close', formData) }"/>
</q-dialog>
</div>
</template>

<script>
import CountryEdit from '../components/Country'

import { toRefs, reactive, computed } from '@vue/composition-api'
export default {
  components: { CountryEdit },
  props: {
    country: { type: Object },
    languages: { type: Array }
  },
  setup (props) {
    const state = reactive({
      showDialog: computed(() => props.country !== undefined)
    })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
