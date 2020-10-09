<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">
      Spin Settings
    </h3>
    <div class="row">
      <q-input
        class="q-mx-lg col-4"
        autofocus
        v-model="lapseForSpinRegeneration"
        label="Regeneration Time in Minutes"
      />
    </div>
    <div class="row">
      <q-input
        class="q-mx-lg col-4 q-mt-lg"
        autofocus
        v-model="maxSpinsForSpinRegeneration"
        label="Threshold for spin regeneration"
      />
    </div>
    <div class="row">
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
      lapseForSpinRegeneration: undefined,
      maxSpinsForSpinRegeneration: undefined
    })
    const submit = async () => {
      await axios.post(
        '/slot/spin_settings_for_crud',
        {
          lapseForSpinRegeneration: state.lapseForSpinRegeneration * 60,
          maxSpinsForSpinRegeneration: state.maxSpinsForSpinRegeneration
        }
      )
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/spin_settings_for_crud',
        method: 'get'
      })
      state.lapseForSpinRegeneration = response.data.lapseForSpinRegeneration / 60
      state.maxSpinsForSpinRegeneration = response.data.maxSpinsForSpinRegeneration
      console.log('response', response)
    }, { immediate: true })
    return { ...toRefs(state), submit }
  }
}
</script>

<style>

</style>
