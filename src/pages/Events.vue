<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">
      Events
    </h3>
    <div class="row">
      <Event
        v-for="(event, index) in events"
        ref="eventRef"
        @rule-type-change="ruleTypeChanged"
        @cancel="cancel"
        @change="submit"
        @remove="removeEvent"
        @editing="changeEventEditing"
        :key="index"
        :skins="skins"
        :event="event"
        :disabled="editingEvent && editingEvent.id !== event.id"
      />
      <Event
        ref="eventRefNew"
        @rule-type-change="ruleTypeChanged"
        @cancel="cancel"
        @change="submit"
        @remove="removeEvent"
        @editing="changeEventEditing"
        v-if="newEvent"
        :skins="skins"
        :event="newEvent"
        :new="true"
      />
    </div>
    <q-page-sticky position="top-left" :offset="[18, 18]" >
      <q-btn :disable="editingEvent !== undefined" @click="addEvent"  fab  icon="add"
             :color="editingEvent ? 'red-3':'red-6'"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { reactive, toRefs, watch, ref } from '@vue/composition-api'
import Event from 'src/components/Event'
import useSession from '../services/useSession'
import axios from '../services/axios'
import clone from 'rfdc'
import { alerta } from 'src/helpers'
export default {
  components: { Event },
  name: 'Events',
  setup (_, { root }) {
    const { loggedIn } = useSession()
    const state = reactive({
      events: [],
      skins: [],
      newEvent: undefined,
      newEventOriginal: undefined,
      editingEvent: undefined,
      savedRule: undefined
    })
    const eventRef = ref(undefined)
    const eventRefNew = ref(undefined)

    const submit = async (event) => {
      const formData = new FormData()
      for (var key in event) {
        const value = key === 'duration' ? event[key] * 60 : event[key]
        if (value && value !== 'undefined') formData.append(key, key === 'rule' ? JSON.stringify(value) : value)
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
        const _eventRef = response.data.isNew ? eventRefNew.value : eventRef.value.find(ref => ref.event.id === event.id)
        _eventRef.setDataAfterSave(response.data)
        if (response.popupFile) event.popupTextureUrl = response.popupFile
        if (response.notificationFile) event.notificationUrl = response.notificationFile
        if (response.particlesFile) event.particlesUrl = response.particlesFile
        if (response.data.isNew) {
          _eventRef.close()
          state.newEvent = undefined
          state.events.push(event)
        } else _eventRef.close()
        state.editingEvent = undefined
        window.location.reload()
      } catch (err) {
        await alerta('error', err ?? 'no message')
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
    const changeEventEditing = (event) => {
      state.savedRule = clone()(event.rule)
      console.log('about to edit: state.savedRule', state.savedRule.type)
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
      state.savedRule = clone()(event.rule)
    }
    const cancel = () => {
      // if (state.editingEvent) state.editingEvent.rule = state.savedRule
      // if (state.newEvent) state.newEvent.rule = state.savedRule
      state.newEvent = undefined
      state.editingEvent = undefined
    }
    const ruleTypeChanged = (rule) => {
      state.editingEvent.rule = rule
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
      changeEventEditing,
      eventRef,
      eventRefNew,
      ruleTypeChanged
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
