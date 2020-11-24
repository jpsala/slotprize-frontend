<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row q-mt-xl float-right">
      <q-btn color="primary" @click="submit">
        Submit
      </q-btn>
    </div>
    <h3 class="q-ml-xl q-pl-xl" style="margin-bottom: 0; padding-bottom: 0">
      General Settings
    </h3>

    <q-separator spaced="30px"/>
    <div class="text-subtitle1 text-weight-regular text-uppercase">Spin Time Threshold</div>
    <q-input v-model="spinTimeThreshold" label="How much time passed sincel last spin"/>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Maintenace Mode</div>
    <!-- <q-checkbox :color="maintenanceMode ? 'red-8': 'green-3'"
                v-model="maintenanceMode" :label="maintenanceMode ? 'In maintenance mode' : 'Not in maintenance mode'" /> -->
     <div class="row">
       <div class="row col-xs-12 col-sm-12 col-md-12 col-lg-2 self-start">
          <q-radio class="col-12" :style="'color:' + (maintenanceMode ? 'red':'')"
                   :color="maintenanceMode ? 'red-4':''"
                   v-model="maintenanceMode" :val="true" label="In maintenance mode" /><br />
          <q-radio v-model="maintenanceMode" :val="false" label="Functioning normally" />
       </div>
      <Localization class="col-xs-12 col-sm-12 col-md-12 col-lg-10 self-start" item='maintenanceMode' />
    </div>

    <q-separator spaced="30px"/>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Current Game Version</div>
    <q-input dense v-model="currentGameVersion"/>
    <div class="text-subtitle1 text-weight-regular text-uppercase">Latest Mandatory Game Version</div>
    <q-input dense v-model="latestMandatoryVersion"/>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Signup</div>
    <q-input v-model="signupCount" hint="Number of spin plays required to display the player profile form" label="SignUp Count"/>

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
import Localization from 'components/Localization'
import { Notify } from 'quasar'
import { alerta } from 'src/helpers'
import useGlobal from 'src/services/useGlobal'
export default {
  components: { Localization },
  setup () {
    const { isDevEnv } = useGlobal()
    const screen = useWindowResize()
    const { loggedIn } = useSession()
    const state = reactive({
      spinTimeThreshold: undefined,
      currentGameVersion: undefined,
      latestMandatoryVersion: undefined,
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
      try {
        await axios.post('/slot/misc_settings_for_crud', {
          currentGameVersion: state.currentGameVersion,
          latestMandatoryVersion: state.latestMandatoryVersion,
          maintenanceMode: state.maintenanceMode,
          signupCount: state.signupCount,
          wallet: state.wallet,
          interstitialsRatio: state.interstitialsRatio,
          lapseForSpinRegeneration: state.lapseForSpinRegeneration * 60,
          maxSpinsForSpinRegeneration: state.maxSpinsForSpinRegeneration,
          spinTimeThreshold: state.spinTimeThreshold
        })
      } catch (err) {
        await alerta('Error', err)
        return
      }
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
      state.currentGameVersion = response.data.currentGameVersion
      state.latestMandatoryVersion = response.data.latestMandatoryVersion
      state.spinTimeThreshold = response.data.spinTimeThreshold
      state.signupCount = response.data.signupCount
      state.maintenanceMode = response.data.maintenanceMode
      state.wallet = response.data.wallet
      state.interstitialsRatio = response.data.interstitialsRatio
      state.lapseForSpinRegeneration = response.data.lapseForSpinRegeneration / 60
      state.maxSpinsForSpinRegeneration = response.data.maxSpinsForSpinRegeneration
      console.log('response', response.data)
    }, { immediate: true })
    return { ...toRefs(state), submit, screen, isDevEnv }
  }
}
</script>

<style>

</style>
