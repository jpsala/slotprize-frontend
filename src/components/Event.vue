<template>
  <q-card
    v-if="eventClone"
    :class="{'disabled': disabled, 'editing': editMode}"
    class="bg-grey-1 event"
  >
    <q-btn
      :disable="editMode || disabled"
      class="dot-menu"
      color="grey-7"
      round
      flat
      icon="more_vert"
    >
      <q-menu
        cover
        auto-close
      >
        <q-list>
          <q-item
            clickable
            :disable="editMode || disabled"
          >
            <q-item-section @click="()=> $emit('remove', event)">
              Remove Event
            </q-item-section>
          </q-item>
          <q-item
            clickable
            :disable="editMode || disabled"
          >
            <q-item-section @click="edit(eventClone)">
              Edit Event
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-card-section>
      <div class="row items-center no-wrap">
        <q-form
          class="col"
          enctype="multipart/form-data"
        >
          <div class="text-h6">
            <q-input
              autofocus
              class="col"
              :disable="!editMode"
              v-model="eventClone.name"
              label="Name"
            />

            <q-input
              :disable="!editMode"
              v-model="eventClone.description"
              label="Producer Notes"
            />
            <div class="row">
              <q-input
                :borderless="!editMode"
                class="col"
                :disable="!editMode"
                label="Multiplier"
                v-model.number="eventClone.multiplier"
                type="number"
              />
              <q-input
                :borderless="!editMode"
                class="col"
                :disable="!editMode"
                label="Duration in minutes"
                v-model.number="eventClone.duration"
              />
            </div>

            <div class="row justify-between">
              <q-select
                class="col-6"
                @input="selectChange"
                :borderless="!editMode"
                :disable="!editMode"
                label="Skin"
                stack-label
                :value="eventClone.skin"
                :options="skins"
                option-value="id"
                option-label="name"
                :key="key"
              />
              <q-checkbox
                class="col-2 q-ml-sm justify-end"
                size="sm"
                color=""
                :disable="!editMode"
                v-model="eventClone.devOnly"
                :true-value="1"
                :false-value="0"
                label="DevOnly"
              />
              <q-checkbox
                class="col-2 q-ml-sm justify-end"
                size="sm"
                color=""
                :disable="!editMode"
                v-model="eventClone.active"
                :true-value="1"
                :false-value="0"
                label="Active"
              />
            </div>

            <q-separator v-if="!editMode" />
            <div style="font-size: small; color: gray">
              Popup
            </div>
            <q-input
              :borderless="!editMode"
              :disable="!editMode"
              class="q-pl-md"
              label="Message"
              v-model.number="eventClone.popupMessage"
            />
            <q-file
              :borderless="!editMode"
              :disable="!editMode"
              class="q-pl-md"
              label="Texture URL"
              v-model="eventClone.popupFile"
            >
              <template #before>
                <q-avatar>
                  <img
                    v-if="eventClone.popupTextureUrl"
                    :src="eventClone.popupTextureUrl"
                  >
                  <q-icon
                    v-else
                    name="attach_file"
                  />
                </q-avatar>
              </template>
            </q-file>
            <q-separator v-if="!editMode" />
            <div style="font-size: small; color: gray">
              Notification
            </div>
            <q-input
              :borderless="!editMode"
              :disable="!editMode"
              class="q-pl-md"
              label="Message"
              v-model.number="eventClone.notificationMessage"
            />
            <q-file
              :borderless="!editMode"
              :disable="!editMode"
              class="col q-pl-md"
              label="Texture URL"
              v-model="eventClone.notificationFile"
            >
              <template #before>
                <q-avatar>
                  <img
                    :key="key"
                    v-if="eventClone.notificationTextureUrl"
                    :src="eventClone.notificationTextureUrl"
                  >
                  <q-icon
                    v-else
                    name="attach_file"
                  />
                </q-avatar>
              </template>
            </q-file>
            <!-- <q-input :borderless="!editMode" :disable='!editMode' label='Rule' v-model='eventClone.rule' /> -->
          </div>
          <!-- <div class="text-subtitle2 q-pt-sm"><q-chip icon="event">{{eventClone.type}}</q-chip></div> -->
        </q-form>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div style="font-size: small; color: gray">
        Rule
      </div>
      <Rules
        @change="ruleChanged"
        :rules="rules"
        :rule="eventClone.rule"
        :editing="editMode"
      />
    </q-card-section>
    <q-separator />

    <q-card-actions
      v-if="editMode"
      align="right"
    >
      <q-btn
        flat
        @click="cancel(eventClone)"
      >
        Cancel
      </q-btn>
      <q-btn
        flat
        @click="save(eventClone)"
      >
        Ok
      </q-btn>
    </q-card-actions>
    <q-card-actions
      v-else
      align="right"
    >
      <q-btn
        :disable="disabled"
        flat
        @click="edit(eventClone)"
      >
        Edit
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import Rules from './Rules'
import {
  reactive,
  toRefs,
  watch,
  onMounted,
  ref
} from '@vue/composition-api'
import clone from 'rfdc'

export default {
  components: { Rules },
  name: 'Event',
  props: {
    event: {
      type: Object,
      required: true
    },
    new: {
      type: Boolean,
      default: false,
      required: false
    },
    skins: {
      type: Array,
      default: () => [],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup (props, {
    emit
  }) {
    const state = reactive({
      editMode: false,
      eventClone: ref(undefined),
      eventBackup: undefined,
      key: 1,
      rules: [
        { type: 'cron', rule: '0 */1 * * * * *' },
        { type: 'unique', start: '2020-10-03 11:00:00', end: '2020-11-03 11:00:10' },
        {
          type: 'daily',
          hours: [
            { start: '08:00:00' }
          ]
        },
        {
          type: 'weekly',
          days: [
            {
              day: 2,
              hours: [
                { start: '08:00:00', duration: 60 }
              ]
            }
          ]
        }
      ]
    })
    const save = event => {
      // state.editMode = false
      state.eventClone.skinId = state.eventClone?.skin?.id
      console.log('ev', state.eventClone)
      emit('change', state.eventClone)
    }
    const edit = event => {
      state.eventBackup = clone()(event)
      state.eventClone = clone()(event)
      state.eventClone.popupFile = null
      state.eventClone.notificationFile = null
      state.editMode = true
      emit('editing', event)
    }
    const close = async () => {
      console.log('close')
      state.editMode = false
    }
    const cancel = event => {
      if (!props.new) {
        state.eventClone = clone()(state.eventBackup)
        state.eventClone.popupFile = null
        state.eventClone.notificationFile = null
        state.editMode = false
      }
      emit('cancel')
    }
    const setDataAfterSave = (data) => {
      if (data.id !== -1) state.eventClone.id = data.id
      if (data.notificationFile) {
        state.key += 1
        state.eventClone.notificationTextureUrl = `${data.notificationFile}?key=${state.key}`
      }
      if (data.popupFile) {
        state.key += 1
        state.eventClone.popupTextureUrl = `${data.popupFile}?key=${state.key}`
      }
    }
    const ruleChanged = (value) => {
      state.eventClone.rule = value
    }
    const selectChange = (value) => {
      state.eventClone.skin = value
      state.key += 1
    }
    onMounted(() => {})
    watch(
      () => props.event,
      event => {
        state.eventClone = clone()(event)
        state.eventClone.skin = props.skins.find(skin => skin.id === state.eventClone.skinId)
        state.eventClone.popupFile = undefined
        state.eventClone.popupFile = undefined
        state.eventClone.notificationFile = undefined
        console.log('rule', typeof state.eventClone.rule)
        try {
          state.eventClone.rule = JSON.parse(state.eventClone.rule)
        } catch (error) {
          state.eventClone.rule = { type: 'unique', start: '2020-01-02', end: '2020-02-02' }
        }
        // if (state.eventClone.popupTextureUrl) state.eventClone.popupTextureUrl += '?version=' + rand(1, 1000)
        // if (state.eventClone.notificationTextureUrl) state.eventClone.notificationTextureUrl += '?version=' + rand(1, 1000)
        state.key += 1
        if (props.new) {
          state.editMode = true
          state.eventClone.skin = null
        }
      }, {
        immediate: true
      }
    )
    return {
      ...toRefs(state),
      save,
      edit,
      cancel,
      setDataAfterSave,
      selectChange,
      close,
      ruleChanged
    }
  }
}
</script>

<style lang="stylus">
  .event *{
      // color: black !important;
      // font-size: 1rem;
  }
  .event {
    max-width: 450px;
    margin: 10px;
    min-width: 360px;

      background-color: white !important;
    &.editing {
      background-color: #ad2a2a0d !important;
      // background-color: #ad2a2a0d !important;
    }

    .dot-menu {
      position: absolute;
      top: 0;
      right: 0;
      z-index 2;
    }
  }
</style>>
