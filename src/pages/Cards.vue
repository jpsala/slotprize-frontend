<template>
  <div class="q-pa-md q-gutter-md justify-center card-set">
    <q-btn :disable="cardSetEditing !== undefined || cardEditing !== undefined" @click="addCardSet"  fab  icon="add"
              :color="cardSetEditing ? 'red-3':'red-6'" class="float-left"
     />
    <h3 class="q-ml-xl q-pl-xl">Card Collections</h3>
    <q-separator spaced="30px"/>
    <div class="q-pa-md">
      <q-list bordered padding style="position: relative">
        <template  v-for="cardSet of cardSets" >
          <!-- <q-item :key="'item0_'+cardSet.id" class="card-item-img"> -->
            <div :card-set-id="cardSet.id" class="card-set-header" :key="'carSet_localization_'+cardSet.id">
              {{cardSet.localizations.length>0 ? cardSet.localizations[0].text : ''}}
            </div>
          <!-- </q-item> -->
          <q-item :key="'cardSet_buttons_'+cardSet.id" class="card-item-img">
            <!-- Edition buttons -->
            <div v-show="(!cardSetEditing || cardSetEditing === cardSet) && cardEditing === undefined" class="set-btns" :key="'btn_edit_'+cardSet.id" >
              <q-btn v-if="!cardSetEditing" @click="editSet(cardSet)" round icon="edit" color="primary"
                    class="edit-set-btn" style="z-index: 1" />
              <q-btn v-if="!cardSetEditing" @click="deleteCardSet(cardSet)" round icon="cancel" color="red-6"
                    class="edit-set-btn" style="z-index: 1" />
              <q-btn v-if="cardSetEditing" @click="cancelSetEdition(cardSet)" round icon="close" color="red-6"
                     class="edit-set-btn" style="z-index: 1" />
              <q-btn v-if="cardSetEditing" @click="submit(cardSet)" round icon="check" color="primary"
                     class="edit-set-btn" style="z-index: 1"
              />
            </div>
            <!-- Image -->
            <q-item-section v-if="cardSetEditing !== cardSet">
              <!-- Card Set browsing -->
              <div class="row">
                <q-item-section thumbnail class="content-center self-center">
                  <img :src="cardSet.img" style="width:200px; height: auto" :class="cardSetEditing || cardSetEditing === cardSet ? 'self-center':''">
                </q-item-section>
                <!-- <q-item-label class="col" style="max-width:40px;place-self: center;">Title</q-item-label> -->
                <div class="col">
                  <q-markup-table dense :bordered='false' flat>
                    <tbody>
                      <tr v-for="(localization, index) of cardSet.localizations" :key="'localization' + index + 'cardSEt' + cardSet.id">
                        <td style="width: 30px">{{localization.languageCode}}</td>
                        <td style="width: 500px"><span class="text-bold">{{localization.text}}</span></td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                    <q-separator spaced="20px" />
                  <div class="">
                    <div><span class="text-caption" style="display: inline-block;width: 100px">Theme Color </span><span class="text-bold"> {{cardSet.themeColor}}</span></div>
                    <div><span class="text-caption" style="display: inline-block;width: 100px">Reward Type </span><span class="text-bold"> {{cardSet.rewardType}}</span></div>
                    <div><span class="text-caption" style="display: inline-block;width: 100px">Reward Amount </span><span class="text-bold"> {{cardSet.rewardAmount}}</span></div>
                  </div>
                </div>
              </div>
              <!-- <q-item-label>{{cardSet.localizations && cardSet.localizations[0].text || 'No tittle'}}</q-item-label> -->

            </q-item-section>
            <q-item-section v-else>
              <!-- Card Set Editing -->
              <q-item-label>
                <div class="text-overline">Title</div>
                <q-separator spaced="10px"/>
                <q-markup-table>
                  <tbody>
                    <tr v-for="(localization, index) of cardSet.localizations" :key="'localization' + index + 'cardSEt' + cardSet.id">
                      <td>{{localization.languageCode}}</td>
                      <td><q-input v-model="localization.text" /></td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <q-separator spaced="10px"/>
                <div class="text-overline">Theme Color</div>
                <div class="q-gutter-md row items-start">
                  <q-input
                    v-model="cardSet.themeColor"
                    class="my-input"
                  >
                    <template v-slot:append>
                      <q-icon name="colorize" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-color v-model="cardSet.themeColor" format-model="hex"/>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  </div>
                <div class="row">
                  <q-select class="col" label="Reward Type" v-model="cardSet.rewardType" :options="paymentOptions" stack-label/>
                  <q-input v-model="cardSet.rewardAmount" class="col" label="Reward Amount" stack-label/>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator :key="'separator1_'+cardSet.id"/>
          <q-item :key="'cardSet_cards_'+cardSet.id">
            <q-item-section>
              <!-- Cards section -->
              <q-expansion-item
                v-if="cardSet.id > -1"
                switch-toggle-side
                :group="'group_' + cardSet.id"
                label="Cards"
                :value="cardSetEditing && cardSetEditing === cardSet"
                header-class="text-primary"
              >
              <div class="row q-mb-xl cards-row">
                <q-btn :disable="cardEditing !== undefined" round fab class="card-new" color="red-6" icon="add" @click="addCard(cardSet)" />
                <template v-for="card in cardSet.cards">
                  <card :card-id="card.id" @delete-card="deleteCard" :save="saveCard" :cardEditing.sync="cardEditing"
                      :key="cardSet.id + '_' + card.id" :model="card" :editing="cardEditing" @cancel-card-add="cancelCardAdd"/>
                </template>
              </div>
              </q-expansion-item>
            </q-item-section>
          </q-item>
          <!-- <q-separator :key="'separator_1'.concat(cardSet.id)" color="primary" class="q-mb-sm"
                        v-if="cardSets.length > 0 && cardSet.id !== cardSets[cardSets.length-1].id"/> -->
        </template>
      </q-list>
    </div>
  </div>

</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import clone from 'rfdc'
import Card from '../components/Card'
import useGlobal from '../services/useGlobal'
import { alerta, notify, confirma } from 'src/helpers'

export default {
  components: { Card },
  setup (_, { emit }) {
    const { showSpinner, hideSpinner } = useGlobal()
    const { loggedIn } = useSession()
    const state = reactive({
      paymentOptions: ['coin', 'spin', 'ticket', 'jackpot'],
      cardSets: [],
      cardSetEditing: undefined,
      languages: [],
      newCardSet: undefined,
      emptyCardSet: undefined,
      newCard: undefined,
      emptyCard: undefined,
      cardSetBackup: undefined,
      cardBackup: undefined,
      cardEditing: undefined
    })
    const addCardSet = () => {
      state.newCardSet = clone()(state.emptyCardSet)
      state.cardSets.push(state.newCardSet)
      state.cardSetEditing = state.newCardSet
      setTimeout(() => {
        const cardSetEl = document.querySelectorAll('[card-set-id="-1"]')
        cardSetEl[0].scrollIntoView()
      }, 0)
    }
    const editSet = (cardSet) => {
      state.cardSetBackup = clone()(cardSet)
      state.cardSetEditing = cardSet
    }
    const saveCard = async (fields, textureFile, thumbFile) => {
      console.log(fields, textureFile)
      var fd = new FormData()
      fd.append('json', JSON.stringify(fields))
      if (textureFile && textureFile.length > 0) { fd.append('textureFile', textureFile[0]) }
      if (thumbFile && thumbFile.length > 0) { fd.append('thumbFile', thumbFile[0]) }

      const response = await axios({
        method: 'post',
        url: 'slot/card_for_crud',
        data: fd
      })
      const cardSet = state.cardSets.find(_cardSet => _cardSet.id === fields.cardSetId)
      console.log('cardSet', cardSet)
      cardSet.img = response.data.thumbUrl
      const cardIndex = cardSet.cards.findIndex(_card => _card.id === -1)
      console.log('cardINdex', cardIndex)
      cardSet.cards[cardIndex] = response.data
      console.log('response.data', response.data)
      state.cardEditing = undefined
      state.newCard = undefined
      return response
    }
    const cancelSetEdition = (cardSet) => {
      const idx = state.cardSets.findIndex(_cardSet => _cardSet.id === cardSet.id)
      if (cardSet.id !== -1) state.cardSets[idx] = clone()(state.cardSetBackup)
      else state.cardSets.splice(idx, 1)
      state.newCardSet = undefined
      state.cardSetEditing = undefined
    }
    const deleteCard = async (card) => {
      console.log('delete', card)
      showSpinner()
      try {
        const resp = await axios.delete('/slot/card_for_crud?cardId=' + card.id)
        console.log('resp', resp.data)
        hideSpinner()
        const cardSet = state.cardSets.find(_cardSet => _cardSet.id === card.cardSetId)
        const cardIdx = cardSet.cards.findIndex(_card => _card.id === card.id)
        cardSet.cards.splice(cardIdx, 1)
        notify({ message: 'Card was deleted' })
      } catch (error) {
        hideSpinner()
        await alerta('Error deleting card', error)
      }
    }
    const deleteCardSet = async (cardSet) => {
      if (!await confirma('Are you sure you want to delete this card set with all of it\'s cards')) { return }
      showSpinner()
      try {
        const resp = await axios.delete('/slot/card_set_for_crud?cardSetId=' + cardSet.id)
        console.log('resp', resp.data)
        notify({ message: 'Card Set was deleted' })
        hideSpinner()
        const cardIdx = state.cardSets.findIndex(_cardSet => _cardSet.id === cardSet.id)
        state.cardSets.splice(cardIdx, 1)
      } catch (error) {
        hideSpinner()
        await alerta('Error deleting card set', error)
      }
    }
    const addCard = (cardSet) => {
      state.newCard = clone()(state.emptyCard)
      state.newCard.cardSetId = cardSet.id
      console.log('addCard state.newCard', state.newCard)
      cardSet.cards.push(state.newCard)
      state.cardEditing = state.newCard
      state.newCard = undefined
      setTimeout(() => {
        const cardEl = document.querySelectorAll('[card-id="-1"]')
        cardEl[0].scrollIntoView()
      }, 0)
    }
    const cancelCardAdd = (card) => {
      if (card.id === -1) {
        const cardSet = state.cardSets.find(_cardSet => _cardSet.id === card.cardSetId)
        const cardIdx = cardSet.cards.findIndex(_card => _card.id === -1)
        cardSet.cards.splice(cardIdx, 1)
      }
    }
    const submit = async (cardSet) => {
      showSpinner()
      try {
        const response = await axios.post('/slot/card_sets_for_crud', cardSet)
        hideSpinner()
        console.log('response', response)
        cardSet.id = response.data.id
        state.cardSetEditing = undefined
        state.newCardSet = undefined
      } catch (err) {
        hideSpinner()
        await alerta('Error saving data', err)
      }
    }
    // watch and get data from backend
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/card_sets_for_crud',
        method: 'get',
        params: {}
      })
      state.cardSets = response.data.cardSets
      for (const cardSet of state.cardSets) {
        cardSet.img = 'https://assets.slotoprizes.tagadagames.com/img/missing.png'
        if (cardSet.cards?.length > 0) cardSet.img = cardSet.cards[0].thumbUrl
      }
      state.languages = response.data.languages
      state.emptyCard = clone()(response.data.newCard)
      state.emptyCardSet = clone()(response.data.newCardSet)
    }, { immediate: true })
    return { ...toRefs(state), addCardSet, submit, editSet, cancelSetEdition, saveCard, addCard, cancelCardAdd, deleteCard, deleteCardSet }
  }
}
</script>

<style lang="scss">
.card-set{
  .cards-row{
    align-items: end;
    position: relative;
    .card-new{
      position: absolute;
      top: -40px;
      right: 10px;
      z-index: 2;
    }
  }
  .q-list{
    padding-top: 0
  }
  .card-set-header{
    width: 100%;
    padding: 10px;
    background-color:$grey-2;
    color: black;
    font-size: 1.2em;
    border-radius: 5px;
  }
  .set-btns{
    position: absolute;
    top: 5px;
    right: 0px;
    .edit-set-btn{
      margin-right: 10px
    }
  }
}
</style>
