<template>
  <q-markup-table class="raffle-table">
    <thead>
      <tr>
        <th
          v-if="type==='history' || type==='live' || type==='waiting'"
          class="text-left"
        >
          Sold
        </th>
        <th class="text-left">
          Title
        </th>
        <th class="text-left">
          Description
        </th>
        <th class="text-right">
          Live Day
        </th>
        <th class="text-right">
          Closing Day
        </th>
        <th
          v-if="types(['new','live'])"
          class="text-right"
        >
          Distance
        </th>
        <th
          v-if="type==='waiting' || type==='history'"
          class="text-left"
        >
          Winner
        </th>
        <th class="text-right">
          Price
        </th>
        <th
          v-if="types(['waiting','history'])"
          class="text-right"
        >
          Status
        </th>
        <th
          v-if="types(['waiting','history'])"
          class="text-right"
        >
          Profile
        </th>
        <th class="text-left">
          Image
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="raffle in raffles"
        :key="raffle.id"
        @click="$emit('select-raffle',{raffle, event:$event})"
        class="cursor-pointer"
      >
        <td
          v-if="type==='history' || type==='live' || type==='waiting'"
          class="text-left"
        >
          {{ raffle.sold }}
        </td>
        <td class="text-left">
          {{ raffle.name }}
        </td>
        <td class="text-left">
          {{ raffle.description }}
        </td>
        <td class="text-right">
          {{ raffle.liveDate }}
        </td>
        <td class="text-right">
          {{ raffle.closingDate }}
        </td>
        <td
          v-if="types(['new','live'])"
          class="text-right"
        >
          {{ raffle.distance }}
        </td>
        <td
          v-if="(type==='waiting' || type==='history')"
          class="text-left"
        >
          <q-btn
            v-if="raffle.gameUserId"
            @click="$emit('show-player', raffle.gameUserId)"
          >
            Player
          </q-btn>
        </td>
        <td class="text-right">
          {{ raffle.price }}
        </td>
        <td
          v-if="types(['waiting','history'])"
          class="text-right"
          :class="raffle.state"
        >
          {{ raffle.state }}
        </td>
        <td
          v-if="type ==='waiting' || type ==='history'"
          :class="raffle.requireProfileData?'Missing':'Completed'"
          class="text-right"
        >
          {{ raffle.requireProfileData?'Missing':'Completed' }}
        </td>
        <td class="text-left img-td">
          <q-img :src="raffle.textureUrl" />
        </td>
        <td
          v-if="type==='new' || type==='live'"
          class="text-left"
        >
          <q-icon
            @click="$emit('remove-raffle', raffle)"
            name="remove_circle_outline"
            size="38px"
            color="red-6"
          />
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
  setup (props) {
    const state = reactive({
      cycle: undefined
    })
    const types = (type = []) => type.includes(props.type)
    // const statusClass = (raffle) => {
    //   return [raffle.status]
    // }
    return { ...toRefs(state), types }
  }
}
</script>

<style lang="sass">
.raffle-table
  zoom: 0.9
  .waiting
    background-color: #bbbbbb
  .nowinner
    background-color: $orange-3
  .closed
    background-color: $red-6
  .delivered
    background-color: $green-5
  .Missing
    background-color: $red-5
  .Completed
    background-color: $green-5
</style>
