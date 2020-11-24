<template>
  <div>
    <q-list
      bordered
      separator
    >
      <q-item>
        <q-item-section style="max-width: 120px">
          Tickets
        </q-item-section>
        <q-item-section>
          {{ tickets }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section style="max-width: 120px">
          Coins
        </q-item-section>
        <q-item-section>
          {{ coins }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section style="max-width: 120px">
          Spins
        </q-item-section>
        <q-item-section>
          {{ spins }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs
} from '@vue/composition-api'
import axios from '../services/axios'
export default {
  props: {
    player: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      coins: undefined,
      tickets: undefined,
      spins: undefined
    })
    onMounted(async () => {
      const resp = await axios.get(`/slot/wallet_for_crud?deviceId=${props.player.device_id}`)
      state.coins = resp.data.coins
      state.tickets = resp.data.tickets
      state.spins = resp.data.spins
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style>

</style>
