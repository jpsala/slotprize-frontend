<template>
  <div class="q-pa-md">
    <div @click="$emit('back')" style="font-size: 16px" class="q-mb-lg cursor-pointer">
      <q-icon name="keyboard_backspace" /> Back
    </div>
    <div class="q-gutter-y-md" style="max-width: 950px">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="profile" label="Profile" />
          <q-tab name="raffleHistory" label="Raffle History" />
          <q-tab name="SupportMessages" label="Support messages" />
          <q-tab name="Wallet" label="Wallet" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="profile">
            <PlayerProfile :player="player" />
          </q-tab-panel>

          <q-tab-panel name="raffleHistory">
            <PlayerRaffles :player="player" />
          </q-tab-panel>

          <q-tab-panel name="SupportMessages">
            <PlayerSupportMessages :player="player" />
          </q-tab-panel>
          <q-tab-panel name="Wallet">
            <PlayerWallet :player="player" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api'
import PlayerProfile from '../components/PlayerProfile'
import PlayerWallet from '../components/PlayerWallet'
import PlayerRaffles from '../components/PlayerRaffles'
import PlayerSupportMessages from '../components/PlayerSupportMessages'
export default {
  components: { PlayerProfile, PlayerRaffles, PlayerSupportMessages, PlayerWallet },
  props: {
    player: {
      type: Object,
      required: true
    }
  },
  setup (props, ctx) {
    const state = reactive({
      tab: 'profile'
    })
    return { ...toRefs(state) }
  }
}
</script>
<style lang="stylus" scoped>
// .my-card
//   @media (max-width: $breakpoint-xs-max)
//     width: 100%
//     max-width: 450px
//     min-width: 350px
//   @media (min-width: $breakpoint-sm-min)
//     width: 450px
//   font-size: 10px
//   .seccion-ingreso
//     background-color: $primary
//     color: white;
</style>
