<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">
      Misc Settings
    </h3>
    <div class="row">
      <q-input
        class="q-mx-lg col-4"
        autofocus
        v-model="gameVersion"
        label="Game Version"
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
      gameVersion: undefined
    })
    const submit = async () => {
      await axios.post('/slot/misc_settings_for_crud', {
        gameVersion: state.gameVersion
      })
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/misc_settings_for_crud',
        method: 'get',
        params: {}
      })
      state.gameVersion = response.data.gameVersion
      console.log('response', response)
    }, { immediate: true })
    return { ...toRefs(state), submit }
  }
}
</script>

<style>

</style>
