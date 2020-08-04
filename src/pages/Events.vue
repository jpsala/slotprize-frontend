<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Events</h3>
    <div class="row">
      <Event @change="eventChange" @remove="removeEvent" :skins="skins" @cancel="cancel"
             :event="event" v-for="(event, index) in events" :key="index" @editing="editing"
             :disabled="editingEvent && editingEvent.id !== event.id"/>
      <Event v-if="newEvent" @cancel="cancel" @change="eventChange" @remove="removeEvent"
             :skins="skins" :event="newEvent" :new="true"  />
    </div>
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-btn :disable="editingEvent !== undefined" @click="addEvent"
              fab icon="add" :color="editingEvent ? 'red-3':'red-6'" />
    </q-page-sticky>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import Event from 'src/components/Event'
import useSession from '../services/useSession'
import axios from '../services/axios'
import clone from 'rfdc'
export default {
  components: {
    Event
  },
  name: 'Events',
  setup () {
    const {
      loggedIn
    } = useSession()
    const state = reactive({
      events: [],
      skins: [],
      newEvent: undefined,
      newEventOriginal: undefined,
      editingEvent: undefined
    })
    const eventChange = async (event) => {
      const eventForSave = clone()(event)
      delete eventForSave.skin
      await axios.post('slot/event', eventForSave)
      state.editingEvent = undefined

      // console.log('change', event)
    }
    const getEvents = async () => {
      if (!loggedIn.value) return
      const respEvents = await axios.get('slot/events')
      const respSkins = await axios.get('slot/skins')
      state.events = respEvents.data.events
      state.skins = respSkins.data
      state.newEventOriginal = respEvents.data.newEvent
      console.log('sq', state.newEvent)
    }
    const editing = (event) => {
      console.log('editing', event)
      state.editingEvent = event
    }
    const removeEvent = (event) => {
      console.log('remove', event)
      state.editingEvent = undefined
    }
    const addEvent = () => {
      state.newEvent = clone()(state.newEventOriginal)
      state.editingEvent = state.newEvent
    }
    const cancel = () => {
      state.newEvent = undefined
      state.editingEvent = undefined
      console.log('cancel', state)
    }
    watch(() => loggedIn.value, getEvents, {
      immediate: true
    })
    return {
      ...toRefs(state),
      eventChange,
      removeEvent,
      addEvent,
      cancel,
      editing
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
