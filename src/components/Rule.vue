<template>
  <div class="q-mt-md">
    <div v-if="rule.type === 'cron'" class="row">
      <div class="col">{{rule.rule}}</div>
    </div>
    <div v-if="rule.type === 'unique'" class="row">
      <div class="col">{{rule.start}}</div>
      <div class="col">{{rule.end}}</div>
    </div>
    <div v-if="rule.type === 'daily'">
      <div class="row" v-for="(hour, index) of rule.hours" :key="index">
        <!-- <q-input outlined dense class="col-3" v-model="hour.start" :disable="!editing" /> -->
        <q-input class="col-3" dense outlined v-model="hour.start" mask="time" :rules="['time']">
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="hour.start" format24h >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
         <q-btn
          round
          color="primary"
          size="100px"
          icon="add"
        />
      </div>
    </div>
    <div v-if="rule.type === 'weekly'" class="row">
      <div class="col">{{rule.rule}}</div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
export default {
  props: {
    rule: {
      type: Object
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const state = reactive({
      model: props.rule
    })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
