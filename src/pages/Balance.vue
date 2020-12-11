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

    <div class="shadow-1 q-pa-md">
      <div class="text-h5 q-ml-md">Ticket Packs Data</div>
      <q-separator inset spaced="10px" />
      <!-- <div v-for="ticketPrice of ticketPacksData" :key="ticketPrice.id" class="q-pa-lg q-mt-lg shadow-1 col" style="width: 900px">
        <div class="text-h6 q-ml-md col">Ticket Price Data #{{ticketPrice.id}}&nbsp;
        <q-input  class="col" v-model="ticketPrice.tickets" type="text" label="Tickets" />
        <q-input  class="col" v-model="ticketPrice.discount" type="text" label="Discount" />
      </div>
      </div> -->
      <q-markup-table flat class="">
        <thead>
          <tr>
            <th class="text-left">#ID</th>
            <th class="text-left">Tickets</th>
            <th class="text-left">Discount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticketPrice of ticketPacksData" :key="ticketPrice.id">
            <td class="text-left"><span class="text-h6">{{ticketPrice.id}}</span></td>
            <td class="text-left"><q-input flat borderless dense class="col" v-model="ticketPrice.tickets" type="text"/></td>
            <td class="text-left"><q-input flat borderless denst class="col" v-model="ticketPrice.discount" type="text"/></td>
          </tr>
        </tbody>
      </q-markup-table>
      <!-- <submit-cancel v-show="ticketPriceDataDirty" @submit="submitTicketPriceData"  label-submit="Submit"  :submit-disable="false"
                     @cancel="cancelTicketPriceData" :cancel-disable="false" class="q-mt-lg" :right="true"
      /> -->
    </div>

    <q-btn color="primary" @click="submit"> Submit </q-btn>

  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import equal from 'fast-deep-equal'
import { clone } from 'src/helpers'

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
      incomingRaffleThresholdInDays: 0,
      ticketPacksData: [],
      ticketPacksDataBackup: undefined,
      ticketPriceDataDirty: false
    })
    const submitTicketPriceData = async () => {
      state.ticketPacksData = clone(state.ticketPacksDataBackup)
    }
    const cancelTicketPriceData = async () => {
      state.ticketPacksData = clone(state.ticketPacksDataBackup)
    }
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
          nextRaffleSessionSpins: state.nextRaffleSessionSpins,
          ticketPacksData: state.ticketPacksData
        }
      )
    }
    watch(() => state.ticketPacksData, () => {
      state.ticketPriceDataDirty = !equal(state.ticketPacksData, state.ticketPacksDataBackup)
      console.log('watch')
    }, { deep: true, inmediate: true })
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
      state.ticketPacksData = response.data.ticketPacksData
      state.ticketPacksDataBackup = clone(response.data.ticketPacksData)
    }, { immediate: true })
    return { ...toRefs(state), submit, submitTicketPriceData, cancelTicketPriceData }
  }
}
</script>

<style>

</style>
