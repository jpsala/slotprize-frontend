<template>
<div>{{showDialog}}
  <SymbolNew />
</div>
</template>

<script>
import SymbolNew from '../components/SymbolNew'

import { toRefs, reactive, computed } from '@vue/composition-api'
export default {
  components: { SymbolNew },
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
