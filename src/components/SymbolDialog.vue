<template>
  <div>
    <q-dialog
      v-model="showDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <SymbolEdit
        @cancel="$emit('cancel')"
        :symbol="symbol"
        @close="function(formData){ $emit('close', formData) }"
      />
    </q-dialog>
  </div>
</template>

<script>
import SymbolEdit from '../components/Symbol'

import { toRefs, reactive, computed } from '@vue/composition-api'
export default {
  components: { SymbolEdit },
  props: {
    symbol: {
      type: Object
    }
  },
  setup (props) {
    const state = reactive({
      showDialog: computed(() => props.symbol !== undefined)
    })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
