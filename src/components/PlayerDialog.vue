<template>
  <q-dialog
    :value="player !== undefined"
    v-bind="$attrs"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="raffle-card">
      <q-card-section>
        <Player
          @back="$emit('close')"
          v-if="player"
          :player="player"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import Player from '../components/Player'
import useSession from 'src/services/useSession'
export default {
  components: { Player },
  props: {
    player: {
      default: undefined
    }
  },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      cycle: undefined
    })
    watch(() => loggedIn, async () => {
    }, { immediate: true })
    return { ...toRefs(state) }
  }
}
</script>

<style lang="sass">
  .raffle-card
    width: 80vw
    max-width: 900px!important
</style>
