<template>
  <q-card :class="{'disabled': disabled, 'editing': editMode}" class='bg-grey-1 event'>
    <q-btn :disable="editMode || disabled" class='dot-menu' color='grey-7' round flat icon='more_vert'>
      <q-menu cover auto-close>
        <q-list>
          <q-item clickable :disable="editMode || disabled">
            <q-item-section @click="()=> $emit('remove', event)">Remove Event</q-item-section>
          </q-item>
          <q-item clickable :disable="editMode || disabled">
            <q-item-section @click='edit(eventClone)'>Edit Event</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-card-section>
      <div v-if="eventClone" class='row items-center no-wrap'>
        <div class='col'>
          <div class='text-h6'>
            <q-input v-if='editMode' v-model='eventClone.name' label='Name' autofocus="" />
            <q-field v-else label='Name' stack-label borderless>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>
                  {{ eventClone.name }}
                </div>
              </template>
            </q-field>
            <div class="row">
              <div class="col">
                <q-input v-if='editMode' label='Multiplier' v-model.number='eventClone.multiplier' type='number' />
                <q-field v-else label='Multiplier' stack-label borderless>
                  <template v-slot:control>
                    <div class='self-center full-width no-outline' tabindex='0'>
                      {{ eventClone.multiplier }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div class="col">
                <q-input v-if='editMode' label='Bet Price' v-model.number='eventClone.betPrice' type='number' />
                <q-field v-else label='Bet Price' stack-label borderless>
                  <template v-slot:control>
                    <div class='self-center full-width no-outline' tabindex='0'>
                      {{ eventClone.betPrice }}
                    </div>
                  </template>
                </q-field>
              </div>
              <div class="col">
                <q-input v-if='editMode' label='Duration' v-model.number='eventClone.duration' />
                <q-field v-else label='Duration' stack-label borderless>
                  <template v-slot:control>
                    <div class='self-center full-width no-outline' tabindex='0'>
                      {{ eventClone.duration }}
                    </div>
                  </template>
                </q-field>
              </div>
            </div>
            <q-select label="Skin" stack-label v-if="editMode" v-model="eventClone.skin" :options="skins" option-value="id" option-label="name" />
            <q-field v-else label='Skin' stack-label borderless>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>
                  {{ eventClone.skin ? eventClone.skin.name : '' }}
                </div>
              </template>
            </q-field>
            <q-input v-if='editMode' label='Popup Message' v-model.number='eventClone.popupMessage' />
            <q-field v-else label='Popup Message' stack-label borderless>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>
                  {{ eventClone.popupMessage }}
                </div>
              </template>
            </q-field>
            <q-input v-if='editMode' label='Popup Texture URL' v-model.number='eventClone.popupTextureUrl' />
            <q-field v-else label='Popup Texture URL' stack-label borderless>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>
                  {{ eventClone.popupTextureUrl }}
                </div>
              </template>
            </q-field>
            <q-input v-if='editMode' label='Notification Message' v-model.number='eventClone.notificationMessage' />
            <q-field v-else label='Notification Message' stack-label borderless>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>
                  {{ eventClone.notificationMessage }}
                </div>
              </template>
            </q-field>
            <q-input v-if='editMode' label='Notification Texture URL' v-model.number='eventClone.notificationTextureUrl' />
            <q-field v-else label='Notification Texture URL' stack-label borderless>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>
                  {{ eventClone.notificationTextureUrl }}
                </div>
              </template>
            </q-field>
            <q-input v-if='editMode' label='Rule' v-model.number='eventClone.rule' />
            <q-field v-else label='Rule' stack-label borderless>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>
                  {{ eventClone.rule }}
                </div>
              </template>
            </q-field>
          </div>
          <!-- <div class="text-subtitle2 q-pt-sm"><q-chip icon="event">{{eventClone.type}}</q-chip></div> -->
        </div>
      </div>
    </q-card-section>
    <q-separator />

    <q-card-actions v-if='editMode' align='right'>
      <q-btn flat @click='cancel(eventClone)'>Cancel</q-btn>
      <q-btn flat @click='save(eventClone)'>Ok</q-btn>
    </q-card-actions>
    <q-card-actions v-else align='right'>
      <q-btn :disable="disabled" flat @click='edit(eventClone)'>Edit</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import {
  reactive,
  toRefs,
  watch,
  onMounted,
  ref
} from '@vue/composition-api'
import clone from 'rfdc'

export default {
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
      eventBackup: undefined
    })
    const save = event => {
      state.editMode = false
      state.eventClone.skinId = state.eventClone.skin.id
      emit('change', state.eventClone)
      console.log('save here')
    }
    const edit = event => {
      state.eventBackup = clone()(event)
      state.eventClone = clone()(event)
      state.editMode = true
      emit('editing', event)
    }
    const cancel = event => {
      state.eventClone = clone()(state.eventBackup)
      state.editMode = false
      emit('cancel')
    }
    onMounted(() => {})
    watch(
      () => props.event,
      event => {
        state.eventClone = clone()(event)
        state.eventClone.skin = props.skins.find(skin => skin.id === state.eventClone.skinId)
        console.log('state.eventClone', state.eventClone)
        if (props.new) {
          state.editMode = true
        }
      }, {
        immediate: true
      }
    )
    return {
      ...toRefs(state),
      save,
      edit,
      cancel
    }
  }
}
</script>

<style lang="stylus">
  .event {
    max-width: 250px;
    margin: 10px;
    min-width: 260px;

    &.editing {
      background-color: white !important;
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
