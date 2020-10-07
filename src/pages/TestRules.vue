<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">
      Jackpot
    </h3>
    <Rules :rules="rules" />
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
import Rules from '../components/Rules'
// import useSession from 'src/services/useSession'

export default {
  props: {
    rules: {
      type: [],
      default: []
    }
  },
  components: { Rules },
  setup (props) {
    const state = reactive({
      model: props.rules
    })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
