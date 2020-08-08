<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Symbol</h3>
    <div class="row">
      {{symbolCopy}}
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
// eslint-disable-next-line no-unused-vars
import axios from '../services/axios'
export default {
  props: {
    symbol: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { loggedIn } = useSession()
    const state = reactive({
      symbolCopy: {
        textureUrl: '',
        paymentType: ''
      }
    })
    watch(() => loggedIn, async () => {
      // const response = await axios({
      //   url: '/slot/endpoint',
      //   method: 'get',
      //   params: {}
      // })
      // console.log('response', response)
    }, { immediate: true })
    watch(() => props.symbol, () => {
      console.log(props.symbol)
      state.symbolCopy = Object.assign({}, props.symbol)
    }, { inmediate: true })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
