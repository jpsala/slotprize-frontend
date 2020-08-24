<template>
  <q-markup-table>
    <thead>
      <tr>
        <th class="text-left">Title</th>
        <th class="text-left">Description</th>
        <th class="text-right">Closing Day</th>
        <th v-if="type==='ready'"  class="text-right">Distance</th>
        <th v-if="type==='waiting' || type==='past'" class="text-left">Winner</th>
        <th class="text-right">Price</th>
        <th class="text-left">Image</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="raffle in raffles" :key="raffle.id" @click="$emit('select-raffle',{raffle, event:$event})" class="cursor-pointer">
        <td class="text-left">{{raffle.name}}</td>
        <td class="text-left">{{raffle.description}}</td>
        <td class="text-right">{{raffle.closingDate}}</td>
        <td v-if="type==='ready'"  class="text-right">{{raffle.distance}}</td>
        <td v-if="type==='waiting' || type==='past'" class="text-left">{{raffle.winner}}</td>
        <td class="text-right">{{raffle.price}}</td>
        <td class="text-left img-td"><q-img :src="raffle.textureUrl"/></td>
        <td v-if="type==='ready'"  class="text-left">
          <q-icon @click="$emit('remove-raffle', raffle)" name="remove_circle_outline" size="38px" color="red-6"/>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
export default {
  props: {
    raffles: {
      default: () => []
    },
    type: {
      default: () => ''
    }
  },
  setup () {
    const state = reactive({
      cycle: undefined
    })
    return { ...toRefs(state) }
  }
}
</script>

<style>

</style>
