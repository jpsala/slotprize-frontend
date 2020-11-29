<template>
  <div class="q-pa-md q-gutter-md justify-center card-set">
    <h3 class="q-ml-xl q-pl-xl">Card Collections</h3>
    <q-separator spaced="30px"/>
    <div class="text-subtitle1 text-weight-regular text-uppercase">Sets</div>
    <div class="q-pa-md">
      <q-list bordered padding style="position: relative">
        <template  v-for="cardSet of cardSets" >
          <!-- <q-item :key="'item0_'+cardSet.id" class="card-item-img"> -->
            <div class="card-set-header" :key="'item0_'+cardSet.id">
              {{cardSet.localizations.length>0 ? cardSet.localizations[0].text : ''}}
            </div>
          <!-- </q-item> -->
          <q-item :key="'item1_'+cardSet.id" class="card-item-img">
            <!-- Edition buttons -->
            <div v-show="(!cardSetEditing || cardSetEditing === cardSet) && cardEditing === undefined" class="set-btns" :key="'btn_edit_'+cardSet.id" >
              <q-btn v-if="!cardSetEditing" @click="editSet(cardSet)" round icon="edit" color="primary"
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
                    <div><span class="text-caption" style="display: inline-block;width: 100px">Payment Type </span><span class="text-bold"> {{cardSet.rewardType}}</span></div>
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
                <!-- <div class="text-overline">Theme Color</div> -->
                  <q-input v-model="cardSet.themeColor" label="Theme Color" class="col"/>
                <div class="row">
                  <q-select class="col" label="Reward Type" v-model="cardSet.rewardType" :options="paymentOptions" stack-label/>
                  <q-input v-model="cardSet.rewardAmount" class="col" label="Reward Amount" stack-label/>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator :key="'separator1_'+cardSet.id"/>
          <q-item :key="'item2_'+cardSet.id">
            <q-item-section>
              <!-- Cards section -->
              <q-expansion-item
                v-if="cardSet.id > -1"
                :last="(cardSets.length === 0 || cardSet.id === cardSets[cardSets.length-1].id) ? 'true' : 'false'"
                switch-toggle-side
                :group="'group_' + cardSet.id"
                label="Cards"
                :value="cardSetEditing && cardSetEditing === cardSet"
                header-class="text-primary"
              >
              <div class="row q-mb-xl">
                <card :save="saveCard" v-for="card in cardSet.cards" :cardEditing.sync="cardEditing"
                     :key="card.id" :model="card" :editing="cardEditing"/>
              </div>
              </q-expansion-item>
            </q-item-section>
          </q-item>
          <q-separator :key="'separator_1'.concat(cardSet.id)" color="primary" class="q-mb-sm"
                        v-if="cardSets.length > 0 && cardSet.id !== cardSets[cardSets.length-1].id"/>
        </template>
      </q-list>
      <q-page-sticky position="top-left" :offset="[18, 18]" >
        <q-btn :disable="cardSetEditing !== undefined || cardEditing !== undefined" @click="addCardSet"  fab  icon="add"
              :color="cardSetEditing ? 'red-3':'red-6'"
        />
      </q-page-sticky>
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
import { alerta } from 'src/helpers'

export default {
  components: { Card },
  setup () {
    const { showSpinner, hideSpinner } = useGlobal()

    const { loggedIn } = useSession()
    const state = reactive({
      paymentOptions: ['coin', 'spin', 'ticket', 'jackpot'],
      cardSets: [],
      cardSetEditing: undefined,
      languages: [],
      newCard: undefined,
      emptyCard: undefined,
      emptyCardSet: undefined,
      newCardSet: undefined,
      cardSetBackup: undefined,
      cardEditing: undefined
    })
    const addCardSet = () => {
      state.newCardSet = clone()(state.emptyCardSet)
      // state.newCard = response.data.newCard
      state.cardSets.unshift(state.newCardSet)
      // console.log(idx)
      state.cardSetEditing = state.newCardSet
      console.log('addCardSet')
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
      console.log('response.data', response.data)
      state.cardEditing = undefined
      return response
    }
    const cancelSetEdition = (cardSet) => {
      const idx = state.cardSets.findIndex(_cardSet => _cardSet.id === cardSet.id)
      state.cardSets[idx] = clone()(state.cardSetBackup)
      state.cardSetEditing = undefined
    }
    const submit = async (cardSet) => {
      console.log('cardSet', cardSet)
      showSpinner()

      try {
        const response = await axios.post('/slot/card_sets_for_crud', cardSet)
        hideSpinner()
        console.log('response', response)
        cardSet.id = response.data.id
        state.cardSetEditing = undefined
      } catch (err) {
        hideSpinner()
        await alerta('Error saving data', err)
      }
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/card_sets_for_crud',
        method: 'get',
        params: {}
      })
      console.log('response', response)
      state.cardSets = response.data.cardSets
      for (const cardSet of state.cardSets) {
        cardSet.img = 'https://assets.slotoprizes.tagadagames.com/img/missing.png'
        if (cardSet.cards?.length > 0) cardSet.img = cardSet.cards[0].thumbUrl
      }
      state.languages = response.data.languages
      state.emptyCard = response.data.emptySet
      state.emptyCardSet = response.data.newCardSet
    }, { immediate: true })
    console.log('state', state)
    return { ...toRefs(state), addCardSet, submit, editSet, cancelSetEdition, saveCard }
  }
}
</script>

<style lang="scss">
.card-set{
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
