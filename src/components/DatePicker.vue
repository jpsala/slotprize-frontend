<template>
  <q-input v-bind="$attrs" v-model="model">
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref='date' transition-show="scale" transition-hide="scale">
          <q-date flat :value="model" mask="YYYY/MM/DD HH:mm:ss"
                  @input="$refs.date.hide(); $emit('input', $event)">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn label="OK" color="primary" flat v-close-popup />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy ref="time" transition-show="scale" transition-hide="scale">
          <q-time :value="model" mask="YYYY/MM/DD HH:mm:ss" format24h
                  @input="$refs.time.hide(); $emit('input', $event)">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn label="OK" color="primary" flat v-close-popup />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script>
export default {
  props: {
    model: {
      default: () => ''
    }
  },
  model: {
    prop: 'model',
    event: 'input'
  }
}
</script>

<style>

</style>
