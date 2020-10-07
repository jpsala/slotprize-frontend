<template>
  <div class="q-mt-md">
    <div v-if="model.type === 'cron'" class="row">
      <div class="col">
        {{ model.model }}
      </div>
    </div>
    <div v-if="model.type === 'unique'" class="row">
      <div class="col">
        {{ model.start }}
      </div>
      <div class="col">
        {{ model.end }}
      </div>
    </div>
    <div v-if="model.type === 'daily'">
      <div class="row">
        <template v-for="(hour, index) of model.hours">
            <q-input :disable="!editing" dense class="col-4" outlined v-model="hour.start" mask="time" :models="['time']" :key="index">
              <template #append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="hour.start" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
                <q-icon @click="removeHour(index)" name="cancel" class="cursor-pointer">
                </q-icon>
              </template>
            </q-input>
        </template>
        <q-btn :disable="!editing" class="q-ml-sm" color="primary" icon="add" @click="addHour" />
      </div>
    </div>
    <div v-if="model.type === 'weekly'" class="row">
      <div class="col">
        {{ model }}
      </div>
    </div>
  </div>
</template>

<script>
import clone from 'rfdc'
import { reactive, toRefs, watch } from '@vue/composition-api'
export default {
  props: {
    rule: { type: Object },
    editing: { type: Boolean, default: false }
  },
  setup (props, { emit }) {
    const state = reactive({
      model: clone()(props.rule),
      addHour () {
        state.model.hours.push({
          start: '12:30:00'
        })
      },
      removeHour (index) {
        state.model.hours.splice(index, 1)
      }
    })
    watch(() => state.model, () => {
      emit('change', state.model)
    }, { deep: true })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style>
  .q-field--with-bottom {
    padding-bottom: unset;
  }
</style>
