<template>
  <div class="q-mt-md">
    <div v-if="model.type === 'cron' && isDev" class="row">
      <div class="col">
        <q-input :disable="!editing" v-model="model.rule" />
      </div>
    </div>
    <div v-if="model.type === 'unique'" class="row">
      <div class="col">
         <date-picker :disable="!editing" v-model="model.start" label="Start" />
      </div>
      <div class="col">
         <date-picker :disable="!editing" v-model="model.end" label="End" />
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
                <q-icon v-show="editing" @click="removeHour(index)" name="cancel" class="cursor-pointer">
                </q-icon>
              </template>
            </q-input>
        </template>
        <q-btn v-show="editing" class="q-ml-sm" color="primary" icon="add" @click="addHour" />
      </div>
    </div>
    <div v-if="model.type === 'weekly'" class="">
      <div v-for="(day, indexDay) of days" :key="`day-${indexDay}`"  v-show="getDay(day).hours.length > 0 || editing">
        <div class="row q-mt-md">
          <!-- <q-select class="col-4" emit-value map-options :options=days v-model="day.day" /> -->
          <span class="text-subtitle1">{{day.label}}</span>
        </div>
          <q-separator/>
        <div class="row">
          <q-btn fab-mini v-show="editing" class="q-mr-md q-mt-sm" color="primary" icon="add"
                  @click="addHourWeekly(day)" style="height: 40px;"/>
          <div class="col-3" v-if="getDay(day).hours.length === 0">
            <!-- <q-icon size="lg" name="clear" color="red-4"/> -->
              <q-field borderless outlined dense label="empty" class="q-mt-sm">
              </q-field>
          </div>
          <q-input v-for="(hour, index) of getDay(day).hours" :key="`hour-${index}-${indexDay}`"
                   :disable="!editing" dense class="col-4" outlined v-model="hour.start"
                    mask="time" :models="['time']">
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
              <q-icon v-show="editing" @click="removeWeeklyHour(day, index)" name="cancel" class="cursor-pointer">
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clone from 'rfdc'
import DatePicker from '../components/DatePicker.vue'
import useSession from '../services/useSession'
import { reactive, toRefs, watch } from '@vue/composition-api'
export default {
  components: { DatePicker },
  props: {
    rule: { type: Object },
    editing: { type: Boolean, default: false },
    viewalt: { type: Boolean, default: false }
  },
  setup (props, { emit }) {
    const { isDev } = useSession()
    const state = reactive({
      model: clone()(props.rule),
      days: [
        { value: 0, label: 'Saturday' },
        { value: 1, label: 'Sunday' },
        { value: 2, label: 'Monday' },
        { value: 3, label: 'Tuesday' },
        { value: 4, label: 'Wednesday' },
        { value: 5, label: 'Thursday' },
        { value: 6, label: 'Friday' }
      ],
      getDay (day) {
        let modelDay = state.model.days.find(_day => _day.day === day.value)
        if (!modelDay) {
          const newDay = { day: day.value, hours: [] }
          state.model.days.push(newDay)
          modelDay = newDay
        }
        return modelDay
      },
      addHour () {
        state.model.hours.push({
          start: '12:30:00'
        })
      },
      addHourWeekly (day) {
        console.log('day', day)
        const modelDay = state.model.days.find(_day => _day.day === day.value)
        // if (!day) {
        //   state.model.days.push({ day: 1, hours: [{ start: '01:01:00' }] })
        //   return
        // }
        modelDay.hours.push({
          start: '12:30:00'
        })
      },
      removeHour (index) {
        state.model.hours.splice(index, 1)
      },
      removeWeeklyHour (day, index) {
        const modelDay = state.model.days.find(_day => _day.day === day.value)
        modelDay.hours.splice(index, 1)
        console.log('di', modelDay, index)
        // state.model.hours.splice(index, 1)
      }
    })
    watch(() => props.rule, () => {
      state.model = clone()(props.rule)
    }, { deep: true })
    watch(() => state.model, () => {
      emit('change', state.model)
    }, { deep: true })
    return {
      ...toRefs(state), isDev
    }
  }
}
</script>

<style>
  .q-field--with-bottom {
    padding-bottom: unset;
  }
</style>
