<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">
      Tickets Settings
    </h3>
    <div class="row">
      <q-input
        class="q-mx-lg"
        autofocus
        v-model="ticketValue"
        label="Value in coins"
      />
      <q-btn
        color="primary"
        @click="submit"
      >
        Submit
      </q-btn>
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
      ticketValue: undefined
    })
    const submit = async () => {
      await axios.post(
        '/slot/tickets_settings_for_crud',
        { ticketValue: state.ticketValue }
      )
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/tickets_settings_for_crud',
        method: 'get'
      })
      state.ticketValue = response.data
      console.log('response', response)
    }, { immediate: true })
    return { ...toRefs(state), submit }
  }
}
</script>

<style>

</style>
