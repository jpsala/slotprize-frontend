<template>
  <div class="q-pa-md">
    <div @click="goBack" style="font-size: 16px" class="q-mb-lg cursor-pointer">
      <q-icon name="keyboard_backspace" /> Back
    </div>
    <div v-if="item != undefined" class="q-gutter-y-md" style="max-width: 950px">
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
          <q-tab name="LoginInfo" label="Login Info" />
          <q-tab name="VideoAdsViewCount" label="Ads" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="profile">
            <PlayerProfile v-if="item !== undefined" :player="item" />
          </q-tab-panel>

          <q-tab-panel name="raffleHistory">
            <PlayerRaffles :player="item" />
          </q-tab-panel>

          <q-tab-panel name="SupportMessages">
            <PlayerSupportMessages :player="item" />
          </q-tab-panel>
          <q-tab-panel name="Wallet">
            <PlayerWallet :player="item" />
          </q-tab-panel>
          <q-tab-panel name="LoginInfo">
            <PlayerLoginHistory :player="item" />
          </q-tab-panel>
          <q-tab-panel name="VideoAdsViewCount">
            <VideoAdsViewCount :player="item" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, onMounted, watch } from '@vue/composition-api'
import PlayerProfile from '../components/PlayerProfile'
import PlayerWallet from '../components/PlayerWallet'
import PlayerRaffles from '../components/PlayerRaffles'
import PlayerSupportMessages from '../components/PlayerSupportMessages'
import PlayerLoginHistory from '../components/PlayerLoginHistory'
import VideoAdsViewCount from '../components/VideoAdsViewCount'
import axios from '../services/axios'
export default {
  components: { VideoAdsViewCount, PlayerProfile, PlayerRaffles, PlayerSupportMessages, PlayerWallet, PlayerLoginHistory },
  props: {
    player: {
      type: [Object, undefined],
      required: false
    }
  },
  setup (props, ctx) {
    const state = reactive({
      tab: 'profile',
      item: undefined,
      backRoute: undefined,
      goBack () {
        if (state.backRoute) ctx.root.$router.push(state.backRoute)
        else ctx.emit('back')
      }
    })
    onMounted(async () => {
      console.log('dis')
      console.dir(props.player)
      if (ctx.root.$route.query.player) {
        const resp = await axios.get('/slot/playerForFront?id=' + ctx.root.$route.query.player)
        state.item = resp.data
        state.backRoute = 'winners'
      }
      if (props.player) state.item = props.player
    })
    watch(() => props.player, (v) => {
      console.log('v', v, props.player)
      state.item = Object.assign({}, v)
    }, { inmediate: true })
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
