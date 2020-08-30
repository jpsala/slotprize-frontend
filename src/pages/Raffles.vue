<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <q-page-sticky  position="top-left" :offset="[18, 18]">
      <q-btn :disable="thereIsNewItem" fab icon="add" color="red" @click="addRaffle"/>
    </q-page-sticky>
    <h3 class="q-ml-xl q-pl-xl">Raffles</h3>
    <q-tabs v-model="tab" class="text-grey" active-color="primary" align="justify"
            indicator-color="primary">
      <q-tab name="ready" label="Ready" />
      <q-tab name="live" label="Live" />
      <q-tab name="waiting" label="Waiting" />
      <q-tab name="history" label="History" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="ready">
        <raffles-table :raffles="readyRaffles" @select-raffle="selectRaffle" @removeRaffle="removeRaffle"  type="ready"/>
      </q-tab-panel>
      <q-tab-panel name="live">
        <raffles-table :raffles="liveRaffles" @select-raffle="selectRaffle" type="live"/>
      </q-tab-panel>
      <q-tab-panel name="waiting">
        <raffles-table @show-player="showPlayer" :raffles="waitingRaffles" @select-raffle="selectRaffle" type="waiting"/>
      </q-tab-panel>
      <q-tab-panel name="history">
        <raffles-table @show-player="showPlayer" :raffles="pastRaffles" @select-raffle="selectRaffle" @remove-raffle="removeRaffle"  type="history"/>
      </q-tab-panel>
    </q-tab-panels>
    <raffle :raffle="selected" @close="closeRaffleDlg"/>
    <player-dialog persistent :player='playerForShowing' @close='playerForShowing = undefined'/>
  </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import raffle from '../components/Raffle'
import playerDialog from '../components/PlayerDialog'
import rafflesTable from '../components/RafflesTable'
import { alerta, confirma } from 'src/helpers'

export default {
  components: { raffle, rafflesTable, playerDialog },
  setup () {
    const { loggedIn } = useSession()
    let newRaffle
    const state = reactive({
      thereIsNewItem: false,
      raffles: [],
      selected: undefined,
      languages: [],
      tab: 'ready',
      playerForShowing: undefined
    })
    const closeRaffleDlg = async (data) => {
      try {
        if (data) {
          console.log('close', raffle)
          const formData = new FormData()
          for (var key in data.raffle) { createFormData(formData, key, data.raffle[key]) }
          formData.append('image', data.files[0])
          axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
          const response = await axios({
            method: 'post',
            url: 'slot/raffle',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          console.log('response', response)
          if (!response?.data?.id) {
            await alerta('Error submiting the data')
            return
          }
          console.log('response.data', response.data)
          if (state.selected.isNew) state.raffles.push(response.data)
          else { Object.assign(state.selected, response.data) }
        }
        state.selected = undefined
      } catch (error) {
        console.dir(error.response.data.message)
        await alerta('Error submiting the data', error.response.data.message)
      }
      function createFormData (formData, key, data) {
        if (data === Object(data) || Array.isArray(data)) {
          createFormData(formData, key, JSON.stringify(data))
        } else {
          formData.append(key, data)
        }
      }
    }
    const selectRaffle = async (data) => {
      console.log('data.event.target.tagName', data.event.target.tagName)
      if (data.event.target.tagName === 'I' || data.event.target.tagName === 'SPAN') return
      state.selected = data.raffle
    }
    const removeRaffle = async (raffle) => {
      const del = await confirma('Do you want to delete this raffle')
      if (!del) return
      const response = await axios({
        url: '/slot/raffle',
        method: 'delete',
        params: { id: raffle.id }
      })
      const deleted = response.data
      if (deleted) {
        await alerta('Raffle was deleted')
        const idx = state.raffles.findIndex(_raffle => _raffle.id === raffle.id)
        if (idx) state.raffles.splice(idx, 1)
      } else alerta('Could not delete raffle')
    }
    const showPlayer = async (player) => {
      const response = await axios({ url: '/slot/playerForFront', method: 'get', params: { id: player } })
      console.log('resp', response)
      state.playerForShowing = response.data
    }
    const addRaffle = () => {
      state.selected = newRaffle
      console.log('add')
    }
    const readyRaffles = computed(() => state.raffles.filter((raffle) => raffle.state === 'ready' && !raffle.isLive))
    const liveRaffles = computed(() => state.raffles.filter((raffle) => raffle.state === 'ready' && raffle.isLive))
    const waitingRaffles = computed(() => state.raffles.filter((raffle) => {
      return ['waiting', 'delivered', 'nopurchase'].includes(raffle.state) ||
             (raffle.isPast && raffle.sold === 0)
    }))
    const pastRaffles = computed(() => state.raffles.filter((raffle) => {
      if (!readyRaffles.value.includes(raffle) && !liveRaffles.value.includes(raffle) && !waitingRaffles.value.includes(raffle)) { return raffle }
    }))

    watch(() => loggedIn, async () => {
      const response = await axios({ url: '/slot/raffles_for_crud', method: 'get' })
      state.raffles = response.data.raffles
      state.languages = response.data.languages
      newRaffle = response.data.newRaffle
    }, { immediate: true })
    return { ...toRefs(state), showPlayer, addRaffle, closeRaffleDlg, readyRaffles, pastRaffles, removeRaffle, selectRaffle, waitingRaffles, liveRaffles }
  }
}
</script>

<style>
.img-td{
  width: 150px
}
</style>
