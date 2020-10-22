<template>
  <q-dialog
    :value="show"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card
      bordered
      class="my-card"
    >
      <q-card-section
        class="bg-primary text-white"
        style="width: 400px"
      >
        <div class="text-h6">
          Daily Rewords
        </div>
      </q-card-section>

      <q-separator
        dark
        inset
      />

      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item>
            <q-item-section style="max-width: 120px">
              <q-select
                label="Rewords Type"
                stack-label
                v-model="model.type"
                :options="['spin', 'coin', 'ticket']"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section style="max-width: 120px">
              <q-input
                v-model="model.amount"
                label="Amount"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <!-- <q-btn flat>Action 1</q-btn> -->
        <q-btn
          @click="submit"
          flat
        >
          Submit
        </q-btn>
        <q-btn
          @click="cancel"
          flat
        >
          Cancel
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'

export default {
  props: {
    show: { type: Boolean, default: () => false },
    item: { type: [Object, Boolean], value: () => {} }
  },
  setup (props, { emit }) {
    const state = reactive({
      model: {}
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
