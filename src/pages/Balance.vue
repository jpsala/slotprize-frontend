<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">
      Balance
    </h3>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Ads</div>
    <q-input v-model="interstitialsRatio" label="Interstitials Ratio"/>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Spin</div>
    <div class="row">
      <q-input class="col" v-model="lapseForSpinRegeneration" label="Regeneration Time in Minutes"/>
      <q-input class="col" v-model="maxSpinsForSpinRegeneration" label="Threshold for spin regeneration"/>
    </div>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Default players wallet</div>
    <div class="row">
      <q-input  v-model="wallet.spins" label="Spins" class="col"/>
      <q-input  v-model="wallet.coins" label="Coins" class="col"/>
      <q-input  v-model="wallet.tickets" label="Tickets" class="col q-mr-sm"/>
    </div>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Tickets</div>
    <div class="row">
      <q-input class="col" v-model="ticketPrice" label="Value in coins"/>
    </div>

    <div class="text-subtitle1 text-weight-regular text-uppercase">Raffles</div>
    <div class="row">
      <q-input class="col" v-model="nextRaffleSessionSpins" label="Next raffle session spins"/>
      <q-input class="col" v-model="incomingRaffleThresholdInDays" label="Incoming raffle threshold in days"/>
    </div>

    <q-btn color="primary" @click="submit"> Submit </q-btn>

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
      ticketPrice: undefined,
      wallet: {
        spins: undefined,
        coins: undefined,
        tickets: undefined
      },
      interstitialsRatio: undefined,
      lapseForSpinRegeneration: 0,
      maxSpinsForSpinRegeneration: 0,
      nextRaffleSessionSpins: 0,
      incomingRaffleThresholdInDays: 0
    })
    const submit = async () => {
      await axios.post(
        '/slot/tickets_settings_for_crud',
        {
          wallet: state.wallet,
          interstitialsRatio: state.interstitialsRatio,
          lapseForSpinRegeneration: state.lapseForSpinRegeneration * 60,
          maxSpinsForSpinRegeneration: state.maxSpinsForSpinRegeneration,
          ticketPrice: state.ticketPrice,
          incomingRaffleThresholdInDays: state.incomingRaffleThresholdInDays,
          nextRaffleSessionSpins: state.nextRaffleSessionSpins
        }
      )
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/tickets_settings_for_crud',
        method: 'get'
      })
      console.log('response', response.data)
      state.ticketPrice = response.data.ticketPrice
      state.wallet = response.data.wallet
      state.interstitialsRatio = response.data.interstitialsRatio
      state.lapseForSpinRegeneration = response.data.lapseForSpinRegeneration / 60
      state.maxSpinsForSpinRegeneration = response.data.maxSpinsForSpinRegeneration
      state.incomingRaffleThresholdInDays = response.data.incomingRaffleThresholdInDays
      state.nextRaffleSessionSpins = response.data.nextRaffleSessionSpins
    }, { immediate: true })
    return { ...toRefs(state), submit }
  }
}
</script>

<style>

</style>
