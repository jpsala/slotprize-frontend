<template>
    <q-card class="bg-grey-1 event">
        <q-btn class="dot-menu" color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
            <q-list>
                <q-item clickable>
                <q-item-section>Remove Event</q-item-section>
                </q-item>
                <q-item clickable>
                <q-item-section @click="editMode = !editMode">Edit Event</q-item-section>
                </q-item>
            </q-list>
            </q-menu>
        </q-btn>
        <q-card-section>
        <div class="row items-center no-wrap">
            <div class="col">
            <div class="text-h6">
                <q-input v-model="event.name" label="Name" />
            </div>
            <!-- <div class="text-subtitle2 q-pt-sm"><q-chip icon="event">{{event.type}}</q-chip></div> -->
                <div class="text-h6">
                    <q-select  emit-value map-options v-model="event.type" :options="eventTypes" label="Type" />
                </div>
            </div>
        </div>
        </q-card-section>
        <component :is="event.type" :event="event" />
    </q-card>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import EventMultiplier from 'src/components/EventMultiplier'
import EventRaffle from 'src/components/EventRaffle'
import { computed, reactive, toRefs } from '@vue/composition-api'
export default {
  components: { EventMultiplier, EventRaffle },
  name: 'Event',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      editMode: false,
      eventTypes: [
        { label: 'Happy Hour', value: 'EventMultiplier' },
        { label: 'Raffle', value: 'EventRaffle' }
      ]
    })
    const component = computed(() => {
      if (props.event.type === 1) return 'EventMultiplier'
      if (props.event.type === 2) return 'EventRaffle'
    })
    return { component, ...toRefs(state) }
  }
}
</script>

<style lang="stylus">
.event{
    max-width: 250px;
    margin: 10px;
    min-width: 260px;
    .dot-menu{
        position: absolute;
        top: 0;
        right: 0;
        z-index 2;
    }
}
</style>
