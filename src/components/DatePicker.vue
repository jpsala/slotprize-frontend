<template>
  <q-input
    v-bind="$attrs"
    v-model="model"
    @change="updateDate($event.target.value, $event)"
  >
    <template #prepend>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          ref="date"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            flat
            :value="model"
            :mask="showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
            @input="$refs.date.hide() ; updateDate($event)"
          >
            <!-- <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn label="OK" color="primary" flat v-close-popup />
            </div> -->
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template
      #append
      v-if="showTime"
    >
      <q-icon
        name="access_time"
        class="cursor-pointer"
      >
        <q-popup-proxy
          ref="time"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-time
            :value="model"
            mask="YYYY-MM-DD HH:mm:ss"
            format24h
            @input="$refs.time.hide() ; updateDate($event)"
          >
            <!-- <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn label="OK" color="primary" flat v-close-popup />
            </div> -->
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import { format } from 'date-fns'
export default {
  props: {
    value: {
      default: () => ''
    },
    showTime: {
      default: () => true
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  setup (props, { emit }) {
    const state = reactive({
      // state.model = props.showTime ? value : format(new Date(value), 'yyyy-mm-dd')
      model: props.showTime ? props.value : format(new Date(), 'yyyy-MM-dd')
    })
    watch(() => props.value, () => {
      state.model = props.value
    })
    const updateDate = (value, b) => {
      console.log('value', value)
      state.model = value
      emit('input', state.model)
    }
    return { updateDate, ...toRefs(state) }
  }
}
</script>

<style>

</style>
