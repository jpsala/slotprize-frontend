<template>
  <div class="q-pa-md q-gutter-md"  style="max-wwidth: 800px">
    <h3 class="q-ml-xl q-pl-xl" style="margin-bottom: 0; padding-bottom: 0">
      General Settings
    </h3>

    <q-separator spaced="30px"/>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Maintenace Mode</div>
    <!-- <q-checkbox :color="maintenanceMode ? 'red-8': 'green-3'"
                v-model="maintenanceMode" :label="maintenanceMode ? 'In maintenance mode' : 'Not in maintenance mode'" /> -->
     <q-radio :style="'color:' + (maintenanceMode ? 'red':'')"
              :color="maintenanceMode ? 'red-4':''"
              v-model="maintenanceMode" :val="true" label="In maintenance mode" /><br />
     <q-radio v-model="maintenanceMode" :val="false" label="Functioning normally" />

    <q-separator spaced="30px"/>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Game Version</div>
    <q-input dense v-model="gameVersion"/>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Default players wallet</div>
    <div class="row">
      <q-input  v-model="wallet.spins" label="Spins" class="col"/>
      <q-input  v-model="wallet.coins" label="Coins" class="col"/>
      <q-input  v-model="wallet.tickets" label="Tickets" class="col q-mr-sm"/>
    </div>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Ads</div>
    <q-input v-model="interstitialsRatio" label="Interstitials Ratio"/>
    <div class="text-subtitle1 text-weight-regular text-uppercase">Spin</div>
    <div class="row">
      <q-input
        class="col"

        v-model="lapseForSpinRegeneration"
        label="Regeneration Time in Minutes"
      />
      <q-input
        class="col"

        v-model="maxSpinsForSpinRegeneration"
        label="Threshold for spin regeneration"
      />
    </div>
    <div class="text-subtitle1 text-weight-regular text-uppercase">Signup</div>
    <q-input v-model="signupCount" hint="holaNumber of spin plays required to display the player profile form" label="SignUp Count"/>

    <div class="row q-mt-xl float-right">
      <q-btn color="primary" @click="submit">
        Submit
      </q-btn>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import useWindowResize from 'src/services/useWindowResize'
import { Notify } from 'quasar'
export default {
  setup () {
    const screen = useWindowResize()
    const { loggedIn } = useSession()
    const state = reactive({
      gameVersion: undefined,
      maintenanceMode: false,
      lapseForSpinRegeneration: 0,
      maxSpinsForSpinRegeneration: 0,
      interstitialsRatio: undefined,
      signupCount: undefined,
      wallet: {
        spins: undefined,
        coins: undefined,
        tickets: undefined
      }
    })
    const submit = async () => {
      await axios.post('/slot/misc_settings_for_crud', {
        gameVersion: state.gameVersion,
        maintenanceMode: state.maintenanceMode,
        signupCount: state.signupCount,
        wallet: state.wallet,
        interstitialsRatio: state.interstitialsRatio,
        lapseForSpinRegeneration: state.lapseForSpinRegeneration * 60,
        maxSpinsForSpinRegeneration: state.maxSpinsForSpinRegeneration
      })
      Notify.create({
        message: 'Settings where saved',
        icon: 'save',
        color: 'green-8'
      })
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/misc_settings_for_crud',
        method: 'get',
        params: {}
      })
      state.gameVersion = response.data.gameVersion
      state.signupCount = response.data.signupCount
      state.maintenanceMode = response.data.maintenanceMode
      state.wallet = response.data.wallet
      state.interstitialsRatio = response.data.interstitialsRatio
      state.lapseForSpinRegeneration = response.data.lapseForSpinRegeneration / 60
      state.maxSpinsForSpinRegeneration = response.data.maxSpinsForSpinRegeneration
      console.log('response', response.data)
    }, { immediate: true })
    return { ...toRefs(state), submit, screen }
  }
}
</script>

<style>

</style>
