<template>
 <div class="q-pa-md q-gutter-md justify-center">
    <h3>Events</h3>
        <div class="row">
            <Event :event="event"  v-for="(event, index) in events" :key="index" />
        </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
import Event from 'src/components/Event'
export default {
  components: { Event },
  name: 'Events',
  setup () {
    const state = reactive({
      events: [
        { name: 'Happy Hour', type: 'EventMultiplier', amount: 2, rule: '*/5 * * * * *' },
        { name: 'Scooter Raffle', type: 'EventRaffle', date: '01/09/2020', description: 'Scooter' }
      ]
    })
    return { ...toRefs(state) }
  }
}
</script>
<style lang="stylus" scoped>

</style>
