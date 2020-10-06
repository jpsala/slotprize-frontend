<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Events</h3>
    <div class="row">
      <Event ref='eventsRef' @change="submit" @remove="removeEvent" :skins="skins" @cancel="cancel"
             :event="event" v-for="(event, index) in events" :key="index" @editing="editing"
             :disabled="editingEvent && editingEvent.id !== event.id"/>
      <Event ref="eventRefNew" v-if="newEvent" @cancel="cancel" @change="submit" @remove="removeEvent"
             :skins="skins" :event="newEvent" :new="true"/>
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
  watch,
  ref
} from '@vue/composition-api'
import Event from 'src/components/Event'
import useSession from '../services/useSession'
import axios from '../services/axios'
import clone from 'rfdc'
import { alerta } from 'src/helpers'
export default {
  components: {
    Event
  },
  name: 'Events',
  setup (_, { root }) {
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
    const eventsRef = ref(undefined)
    const eventRefNew = ref(undefined)

    const submit = async (event) => {
      const formData = new FormData()
      for (var key in event) {
        const value = key === 'duration' ? event[key] * 60 : event[key]
        formData.append(key, value)
      }

      const axiosAnt = axios.defaults.headers.post['Content-Type']
      axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
      try {
        const response = await axios({
          method: 'post',
          url: 'slot/event',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const eventRef = response.data.isNew ? eventRefNew.value : eventsRef.value.find(ref => ref.event.id === event.id)
        eventRef.setDataAfterSave(response.data)
        if (response.popupFile) event.popupTextureUrl = response.popupFile
        if (response.notificationFile) event.notificationUrl = response.notificationFile
        console.log('eventRef', eventRef, eventRefNew)
        if (response.data.isNew) {
          eventRef.close()
          state.newEvent = undefined
          state.events.push(event)
        } else eventRef.close()
        state.editingEvent = undefined
      } catch (err) {
        await alerta(err ?? 'no message', 'ehhhhh')
      } finally {
        axios.defaults.headers.post['Content-Type'] = axiosAnt
      }
    }

    const getEvents = async () => {
      if (!loggedIn.value) return
      const respEvents = await axios.get('slot/events')
      const respSkins = await axios.get('slot/skins')
      for (const event of respEvents.data.events) {
        event.duration = Math.abs(event.duration / 60)
      }
      state.events = respEvents.data.events
      state.skins = respSkins.data
      state.newEventOriginal = respEvents.data.newEvent
    }

    const editing = (event) => {
      state.editingEvent = event
    }

    const removeEvent = async (event) => {
      const resp = await axios.delete(`/slot/event?id=${event.id}`)
      console.log('resp delete event', resp.data)
      if (resp.data) {
        const eventIdx = state.events.findIndex(_event => _event.id === event.id)
        console.log('eventIdx', eventIdx, state.events)
        if (eventIdx > -1) state.events.splice(eventIdx, 1)
        await alerta('Event has been deleted')
      }
      state.editingEvent = undefined
    }
    const addEvent = () => {
      state.newEvent = clone()(state.newEventOriginal)
      state.editingEvent = state.newEvent
    }
    const cancel = () => {
      state.newEvent = undefined
      state.editingEvent = undefined
    }
    watch(() => loggedIn.value, getEvents, {
      immediate: true
    })
    return {
      ...toRefs(state),
      submit,
      removeEvent,
      addEvent,
      cancel,
      editing,
      eventsRef,
      eventRefNew
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
