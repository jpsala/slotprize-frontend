<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Raffles</h3>
    <div class="row">
      Raffles page
    </div>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Title</th>
          <th class="text-left">Description</th>
          <th class="text-right">Closing Day</th>
          <th class="text-right">Price</th>
          <th class="text-left">Texture URL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="raffle in raffles" :key="raffle.id">
          <td class="text-left">{{raffle.id}}</td>
          <td class="text-left">{{raffle.name}}</td>
          <td class="text-left">{{raffle.description}}</td>
          <td class="text-right">{{raffle.closingDay}}</td>
          <td class="text-right">{{raffle.price}}</td>
          <td class="text-left">{{raffle.textureURl}}</td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-btn :disable="thereIsNewItem" fab icon="add" color="red" @click="addRaffle"/>
    </q-page-sticky>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
export default {
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      thereIsNewItem: false,
      raffles: [],
      languages: []
    })
    const addRaffle = () => {
      console.log('add')
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/raffles_for_crud',
        method: 'get'
      })
      /*
      closingDay: "2020/08/07 14:47"
      description: "Vaucher"
      deviceID: "borrar2"
      email: ""
      id: 31
      itemHighlight: 0
      name: "Voucher"
      price: 16
      textureURl: "http://wopidom.homelinux.com/public/assets/raffleItems/placeholder1.png"
      winner: ", "
      */
      // console.log('response', response)
      state.raffles = response.data.raffles
      state.languages = response.data.languages
    }, { immediate: true })
    return { ...toRefs(state), addRaffle }
  }
}
</script>

<style>

</style>
