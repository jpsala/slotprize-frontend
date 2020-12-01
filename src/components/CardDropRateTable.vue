<template>
    <div class="card-drop-rate-table">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">Stars</th>
            <th class="text-right">Probability</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of items" :key="item.id">
            <td class="text-left">
              <q-rating :readonly="true" style="cursor: arrow" v-model="item.stars" size="2em" color="yellow-7" icon="star" />
            </td>
            <td class="text-right"><q-input v-model="item.probability" type="text" dense class="probability-input" input-class="text-right" /></td>
          </tr>
          <tr :class="dataValid?'':'probability-error'">
            <th class="text-left">Total <span v-if="!dataValid"> ERROR!</span></th>
            <th class="text-right">{{totalProbability}}</th>
          </tr>
        </tbody>
      </q-markup-table>
      <div class="text-right q-gutter-sm q-mt-sm" v-if="dataDirty">
        <q-btn color="red-6" :disable="!dataDirty" icon="cancel" label="Cancel" @click="cancel" />
        <q-btn color="primary" :disable="!dataValid" icon="check" label="Submit" @click="submit" />
      </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import clone from 'rfdc'

// import XXX from '../components/XXX'
export default {
// components: {},
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      items: [],
      itemsOriginal: [],
      dataValid: false
    })
    const submit = async () => {
      const response = await axios.post(
        '/slot/card_drop_rate_table',
        state.items
      )
      console.log('response', response)
    }
    const cancel = () => {
      state.items = clone()(state.itemsOriginal)
    }
    const totalProbability = computed(() => {
      let total = 0
      for (const item of state.items) {
        total += Number(item.probability)
      }
      return total
    })
    const dataDirty = computed(() => {
      let dirty = false
      for (const item of state.items) {
        console.log('detalle', item, state.itemsOriginal[item.id].probability)
        if (item.probability !== state.itemsOriginal[item.id].probability) dirty = true
      }
      return dirty
    }, { deep: true })
    const dataValid = computed(() => {
      return (totalProbability.value === 100)
    })
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/card_drop_rate_table',
        method: 'get',
        params: {}
      })
      console.log('response', response)
      state.itemsOriginal = clone()(response.data)
      state.items = response.data
    }, { immediate: true })
    return { ...toRefs(state), totalProbability, submit, dataDirty, dataValid, cancel }
  }
}
</script>

<style lang="scss">
.card-drop-rate-table{
  width: 300px;
  .q-rating * {cursor: default !important}
  .probability-input{
    width: 50px;
  }
  .probability-error{
    background-color: $red-6;
    color: white;
  }
}
</style>
