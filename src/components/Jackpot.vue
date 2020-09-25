<template>
    <q-dialog v-model="show" persistent transition-show="scale" transition-hide="scale">
      <q-card bordered class="my-card">
        <q-card-section class="bg-primary text-white" style="width: 400px">
          <div class="text-h6">Jackpot Data</div>
        </q-card-section>

        <q-separator dark inset />

        <q-card-section>
          <q-list bordered separator>
          <q-item v-if="model.state === 'live' || model.state === 'past'">
            <q-item-section>
              <span class="text-subtitle1">Repeated {{model.repeated}} Times</span>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section style="max-width: 120px">
              <div class="row">
                <q-input class="col-10" readonly v-model="model.state" label="State" />
                <q-checkbox class="col-2" :disable="model.state !== 'next'" v-model="model.confirmed" :false-value="0"
                            :true-value="1" label="confirmed" />
            </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section style="max-width: 120px">
              <q-input :disable="model.state !== 'next'" v-model="model.prize" label="PRIZE" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section style="max-width: 120px">
              <q-input :disable="model.state !== 'next'" v-model="model.cycle" label="CYCLE" autofocus />
            </q-item-section>
          </q-item>
          <q-item v-if="model.state === 'live'">
            <q-item-section>
              Spin Count {{model.spinCount}}
              <q-linear-progress class="q-mt-sm q-mb-sm" size="25px" :value="progress" color="primary">
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="primary" :label="progressLabel" />
                </div>
              </q-linear-progress>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <!-- <q-btn flat>Action 1</q-btn> -->
        <q-btn @click="submit" flat>{{model.state === 'next' ? 'Submit':'Close'}}</q-btn>
        <q-btn @click="cancel" flat>Cancel</q-btn>
      </q-card-actions>
    </q-card>
    </q-dialog>
</template>

<script>
import { reactive, toRefs, computed, watch } from '@vue/composition-api'

export default {
  props: {
    cycle: undefined,
    prize: undefined,
    spinCount: undefined,
    show: { type: Boolean, default: () => false },
    item: { type: [Object, Boolean], value: () => {} }
  },
  setup (props, { emit }) {
    const state = reactive({
      model: {},
      progress: computed(() => state.model.spinCount * 1 / state.model.cycle / 1),
      progressLabel: computed(() => {
        return (state.progress * 100).toFixed(2) + '%'
      })
    })
    const submit = () => {
      emit('onsubmit', state.model)
    }
    const cancel = () => {
      emit('oncancel', state.model)
    }
    watch(() => props.item, () => {
      state.model = Object.assign({}, props.item)
    })
    return { ...toRefs(state), submit, close, cancel }
  }
}
</script>

<style>

</style>
