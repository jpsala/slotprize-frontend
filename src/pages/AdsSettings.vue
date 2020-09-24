<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Jackpot</h3>
    <div class="row">
      Hola
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
export default {
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      cycle: undefined
    })
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/ads_settings_for_crud',
        method: 'get'
      })
      console.log('response', response)
    }, { immediate: true })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
