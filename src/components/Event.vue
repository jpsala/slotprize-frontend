<template>
  <q-card v-if="eventClone" :class="{ disabled: disabled, editing: editMode }" class="bg-grey-1 event">
    <q-btn :disable="editMode || disabled" class="dot-menu" color="grey-7" round flat icon="more_vert">
      <q-menu cover auto-close>
        <q-list>
          <q-item clickable :disable="editMode || disabled">
            <q-item-section @click="() => $emit('remove', event)">
              Remove Event
            </q-item-section>
          </q-item>
          <q-item clickable :disable="editMode || disabled">
            <q-item-section @click="edit(eventClone)">
              Edit Event
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-card-section>
      <div class="row items-center no-wrap">
        <q-form class="col" enctype="multipart/form-data">
          <div class="text-h6">
            <q-input autofocus class="col" :disable="!editMode" v-model="eventClone.name" label="Name" />

            <q-input :disable="!editMode" v-model="eventClone.description" label="Producer Notes" />
            <div class="row">
              <q-input :borderless="!editMode" class="col" :disable="!editMode" label="Multiplier" v-model.number="eventClone.multiplier" type="number" />
              <q-input :borderless="!editMode" class="col" :disable="!editMode" label="Duration in minutes" v-model.number="eventClone.duration" />
            </div>

            <div class="row justify-between">
              <q-select class="col-5" @input="selectChange" :borderless="!editMode" :disable="!editMode" label="Skin" stack-label :value="eventClone.skin" :options="skinsPlusEmpty" option-value="id" option-label="name" :key="key" />
              <q-checkbox class="col-2 q-ml-sm justify-end" size="sm" color="" :disable="!editMode" v-model="eventClone.devOnly" :true-value="1" :false-value="0" label="DevOnly" />
              <q-checkbox class="col-2 q-ml-sm justify-end" size="sm" color="" :disable="!editMode" v-model="eventClone.active" :true-value="1" :false-value="0" label="Active" />
            </div>

            <q-separator v-if="!editMode" />
            <div style="font-size: small; color: gray;">Popup</div>
            <q-input :borderless="!editMode" :disable="!editMode" class="q-pl-md"
                     label="Message" v-model.number="eventClone.popupMessage" />
            <div class="row">
              <q-file :borderless="!editMode" :disable="!editMode" class="q-pl-md col-10"
                      label="Texture URL" v-model="eventClone.popupFile">
              <template #before>
                <q-avatar>
                  <img v-if="eventClone.popupTextureUrl" :src="eventClone.popupTextureUrl" />
                  <q-icon v-else name="attach_file" />
                </q-avatar>
              </template>
              </q-file>
              <q-btn rounded color="red-5" style="width: 30px; height: 30px" @click="removeImage('popup')"
                     size="sm" icon="remove" class="q-mt-md col-2" :disable="!editMode"
              />
            </div>
            <q-separator v-if="!editMode" />
            <div style="font-size: small; color: gray;">Notification</div>
            <q-input :borderless="!editMode" :disable="!editMode" class="q-pl-md" label="Message"
                     v-model.number="eventClone.notificationMessage" />
            <div class="row">
              <q-file :borderless="!editMode" :disable="!editMode" class="col q-pl-md col-10"
                      label="Texture URL" v-model="eventClone.notificationFile">
                <template #before>
                  <q-avatar>
                    <img :key="key" v-if="eventClone.notificationTextureUrl" :src="eventClone.notificationTextureUrl" />
                    <q-icon v-else name="attach_file" />
                  </q-avatar>
                </template>
              </q-file>
              <q-btn
                rounded color="red-5" style="width: 30px; height: 30px" @click="removeImage('notification')"
                size="sm" icon="remove" class="q-mt-md col-2" :disable="!editMode"
              />
            </div>
            <q-separator v-if="!editMode" class="q-mt-md"/>
            <div style="font-size: small; color: gray;">Particles</div>
            <div class="row">
              <q-file :borderless="!editMode" :disable="!editMode" class="col q-pl-md col-10"
                      label="Particles Texture URL" v-model="eventClone.particlesFile">
                <template #before>
                  <q-avatar>
                    <img :key="key" v-if="eventClone.particlesTextureUrl" :src="eventClone.particlesTextureUrl" />
                    <q-icon v-else name="attach_file" />
                  </q-avatar>
                </template>
              </q-file>
              <q-btn
                rounded color="red-5" style="width: 30px; height: 30px" @click="removeImage('particles')"
                size="sm" icon="remove" class="q-mt-md col-2" :disable="!editMode"
              />
            </div>
          </div>
        </q-form>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <!-- <div style="font-size: small; color: gray;">Rule</div> -->
      <Rules ref='ruleRef' @rule-type-change="ruleTypeChanged" @change="ruleChanged" @edit="editRule" :rules="rules"
            :rule="eventClone.rule" :editing="editMode" />
    </q-card-section>
    <q-separator />

    <q-card-actions v-if="editMode" align="right">
      <q-btn flat @click="cancel(eventClone)"> Cancel </q-btn>
      <q-btn flat @click="save(eventClone)"> Ok </q-btn>
    </q-card-actions>
    <q-card-actions v-else align="right">
      <q-btn :disable="disabled" flat @click="edit(eventClone)"> Edit </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import Rules from './Rules'
import { reactive, toRefs, watch, onMounted, ref, computed } from '@vue/composition-api'
import clone from 'rfdc'
import { alerta } from 'src/helpers'
import { format } from 'date-fns'

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
  setup (props, { emit }) {
    const state = reactive({
      editMode: false,
      eventClone: ref(undefined),
      eventBackup: undefined,
      key: 1,
      rules: [
        { type: 'cron', rule: '0 */1 * * * * *' },
        {
          type: 'unique',
          start: '2020-10-03 11:00:00',
          end: '2020-11-03 11:00:10'
        },
        {
          type: 'daily',
          hours: [{ start: '08:00:00' }]
        },
        {
          type: 'weekly',
          days: [
            {
              day: 2,
              hours: [{ start: '08:00:00', duration: 60 }]
            }
          ]
        }
      ],
      ruleRef: undefined,
      editRule (v) {
        state.editMode = true
      },
      ruleTypeChanged (v) {
        emit('rule-type-change', v)
      }
    })
    const save = async (event) => {
      // state.editMode = false
      if (Number(state.eventClone.duration) === 0) {
        if (state.eventClone.rule && state.eventClone.rule.type !== 'unique') {
          await alerta('Duration can not be 0 if the rule is not unique')
          return
        }
      }
      state.eventClone.skinId = state.eventClone?.skin?.id
      console.log('type', event.rule.type)
      emit('change', state.eventClone)
    }
    const edit = (event) => {
      state.eventBackup = clone()(event)
      state.eventClone = clone()(event)
      state.eventClone.particlesFile = null
      state.eventClone.popupFile = null
      state.eventClone.notificationFile = null
      state.editMode = true
      emit('editing', event)
    }
    const close = async () => {
      console.log('close')
      state.editMode = false
    }
    const cancel = (event) => {
      if (!props.new) {
        state.ruleRef.cancelEdition(state.eventBackup.rule)
        state.eventClone = clone()(state.eventBackup)
        state.eventClone.popupFile = null
        state.eventClone.notificationFile = null
        state.eventClone.particlesFile = null
        state.editMode = false
      }
      emit('cancel', { rule: props.rule })
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
      if (data.particlesFile) {
        state.key += 1
        state.eventClone.particlesTextureUrl = `${data.particlesFile}?key=${state.key}`
      }
    }
    const ruleChanged = (value) => {
      state.eventClone.rule = value
    }
    const removeImage = (value) => {
      console.log('value', value)
      if (value === 'notification') {
        state.eventClone.notificationFile = undefined
        state.eventClone.notificationMessage = undefined
        state.eventClone.notificationTextureUrl = undefined
      }
      if (value === 'popup') {
        state.eventClone.popupFile = undefined
        state.eventClone.popupMessage = undefined
        state.eventClone.popupTextureUrl = undefined
      }
      if (value === 'particles') {
        state.eventClone.particlesFile = undefined
        state.eventClone.particlesTextureUrl = undefined
      }
    }
    const selectChange = (value) => {
      state.eventClone.skin = value
      state.key += 1
    }
    const skinsPlusEmpty = computed(() => {
      return [{ id: undefined, name: 'No Skin' }, ...props.skins]
    })
    onMounted(() => {})
    watch(() => props.event.rule, (v) => {
      console.log('rule changed', v)
      try {
        if (typeof state.eventClone.rule === 'string') state.eventClone.rule = JSON.parse(state.eventClone.rule)
      } catch (error) {
        console.error(error)
        state.eventClone.rule = {
          type: 'unique',
          start: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          end: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }
      }
    })
    watch(
      () => props.event,
      (event) => {
        console.log('Event, event change', props.event)
        state.eventClone = clone()(event)
        state.eventClone.skin = props.skins.find(
          (skin) => skin.id === state.eventClone.skinId
        )
        state.eventClone.particlesFile = undefined
        state.eventClone.popupFile = undefined
        state.eventClone.notificationFile = undefined
        console.log('rule', typeof state.eventClone.rule)
        try {
          state.eventClone.rule = JSON.parse(state.eventClone.rule)
        } catch (error) {
          state.eventClone.rule = {
            type: 'unique',
            start: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            end: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          }
        }
        // if (state.eventClone.popupTextureUrl) state.eventClone.popupTextureUrl += '?version=' + rand(1, 1000)
        // if (state.eventClone.notificationTextureUrl) state.eventClone.notificationTextureUrl += '?version=' + rand(1, 1000)
        state.key += 1
        if (props.new) {
          state.editMode = true
          state.eventClone.skin = null
        }
      },
      {
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
      ruleChanged,
      removeImage,
      skinsPlusEmpty
    }
  }
}
</script>

<style lang="stylus">
.event * {
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
      z-index: 2;
   }
}</style
>>
