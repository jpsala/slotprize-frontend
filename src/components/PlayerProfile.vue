<template>
  <div>
    <!-- <div class="text-h6">Player Profile</div> -->
    <q-list
      bordered
      separator
    >
      <q-item
        v-for="(value, index) in playerEntries"
        :key="index"
      >
        <q-item-section style="max-width: 120px">
          {{ value[0] }}:
        </q-item-section>
        <q-item-section>
          {{ value[1] }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import camelcaseKeys from 'camelcase-keys'
import {
  onMounted,
  reactive,
  toRefs
} from '@vue/composition-api'
import { format } from 'date-fns/esm'

export default {
  props: {
    player: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      playerEntries: undefined
    })
    onMounted(() => {
      console.log('player', props.player)
      console.log('player', props.player.value)
      console.dir(props.player)
      if (!props.player) return
      delete props.player.modified_at
      delete props.player.password
      state.playerEntries = Object.entries(camelcaseKeys(props.player, {
        pascalCase: true
      }))
      console.log('states.player', state.playerEntries)
      state.playerEntries.createdAt = format(new Date(props.player.created_at), 'yyyy-MM-dd')
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style>

</style>
