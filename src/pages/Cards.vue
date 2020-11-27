<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Cards</h3>
    <q-separator spaced="30px"/>
    <div class="text-subtitle1 text-weight-regular text-uppercase">Albums</div>
    <div class="row">
      <card-album
        v-if="newCardAlbum !== undefined"
        :card-album="newCardAlbum"
        :languages="languages"
        @submit="submit"
        />
      <card-album v-for="cardAlbum of cardAlbums"
        :key="cardAlbum.id"
        :card-album="cardAlbum"
        :languages="languages"
        @submit="submit"
        />
    </div>
        <q-page-sticky position="top-left" :offset="[18, 18]" >
      <q-btn :disable="editingCardAlbum !== undefined || newCardAlbum" @click="addCardAlbum"  fab  icon="add"
             :color="editingCardAlbum ? 'red-3':'red-6'"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import CardAlbum from 'src/components/CardAlbum'
import clone from 'rfdc'
export default {
  components: { CardAlbum },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      cardAlbums: [],
      languages: [],
      newCard: undefined,
      emptyCard: undefined,
      emptyCardAlbum: undefined,
      newCardAlbum: undefined,
      editingCardAlbum: undefined
    })
    const addCardAlbum = () => {
      state.newCardAlbum = clone()(state.emptyCardAlbum)
      // state.newCard = response.data.newCard
      console.log('addCardAlbum')
    }
    const submit = (cardAlbum, files) => {
      console.log('cardAlbum, files', cardAlbum, files)
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/card_albums_for_crud',
        method: 'get',
        params: {}
      })
      console.log('response', response)
      state.cardAlbums = response.data.cardAlbums
      state.languages = response.data.languages
      state.emptyCard = response.data.emptyAlbum
      state.emptyCardAlbum = response.data.newCardAlbum
    }, { immediate: true })
    console.log('state', state)
    return { ...toRefs(state), addCardAlbum, submit }
  }
}
</script>

<style>

</style>
