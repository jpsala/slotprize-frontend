<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <div class="text-h3 q-ml-xl">Cards</div>
    <q-separator/>

    <!-- CHEST -->
    <div  v-if="chestPremium">
      <div class="text-h5 q-ml-md">Chest configuration</div>
      <q-separator inset spaced="10px" />
      <div class="q-pa-lg q-mt-lg shadow-1">
        <div class="text-h6 q-ml-md">Premium&nbsp;
        </div>
        <div class="row" style="width: 400px">
          <q-input :disable="newReward !== undefined" class="col" v-model="chestPremium.priceAmount" type="text" label="Price Amount" />
          <q-select :disable="newReward !== undefined" class="col" label="Reward Type" v-model="chestPremium.priceCurrency" :options="paymentOptions" stack-label/>
        </div>
        <div class="row q-mt-md q-mb-md">
          <div class="text-h8 q-ml-lg" style="width: 60px; align-self: center">Rewards</div>
          <q-btn :disable="newReward !== undefined" round size='sm' color="secondary" icon="add" @click="addPremiumReward(chestPremium)" class="q-ml-sm" />
        </div>
        <div v-for="(reward, index) of chestPremium.rewards" :key="index" >
          <q-separator class="q-ml-lg" style="width:375px"/>
          <div class="row reward-row" :style="reward.isNew ? 'width: 506px' : 'width: 400px'">
              <q-input :disable="newReward !== undefined && !reward.isNew" class="col q-ml-lg" v-model="reward.amount" type="text" label="Price Amount" />
              <q-select :disable="newReward !== undefined && !reward.isNew" class="col" label="Reward Type" v-model="reward.type" :options="paymentOptions" stack-label/>
              <q-btn :disable="newReward !== undefined" icon="delete_outline" round size="12px"
                      class="self-center q-ml-sm q-mr-sm delete-reward" color="red-5" @click="deletePremiumReward(index)"/>
            <submit-cancel v-show="reward.isNew" @submit="savePremiumReward(index)" @cancel="cancelPremiumReward(chestRegular)" :show-labels='false'
                          :submit-disable=!reward.isNew :cancel-disable="!reward.isNew" size="sm"/>
          </div>
        </div>
        <submit-cancel :disable="newReward !== undefined" @submit="saveChest('chestPremiumRewards')" label-submit="Submit"
                        @cancel="cancelChestPremium" :submit-disable="!chestPremiumIsDirty"
                        :cancel-disable="!chestPremiumIsDirty"  class="q-mt-lg" :right="true"/>
      </div>
    </div>
    <div  v-if="chestRegular">
      <div class="q-pa-lg q-mt-lg shadow-1">
        <div class="text-h6 q-ml-md">Regular&nbsp;
        </div>
        <div class="row" style="width: 400px">
          <q-input :disable="newReward !== undefined" class="col" v-model="chestRegular.priceAmount" type="text" label="Price Amount" />
          <q-select :disable="newReward !== undefined" class="col" label="Reward Type" v-model="chestRegular.priceCurrency" :options="paymentOptions" stack-label/>
        </div>
        <div class="row q-mt-md q-mb-md">
          <div class="text-h8 q-ml-lg" style="width: 60px; align-self: center">Rewards</div>
          <q-btn :disable="newReward !== undefined" round size='sm' color="secondary" icon="add" @click="addRegularReward(chestRegular)" class="q-ml-sm" />
        </div>
        <div v-for="(reward, index) of chestRegular.rewards" :key="index" >
          <q-separator class="q-ml-lg" style="width:375px"/>
          <div class="row reward-row" :style="reward.isNew ? 'width: 506px' : 'width: 400px'">
              <q-input :disable="newReward !== undefined && !reward.isNew" class="col q-ml-lg" v-model="reward.amount" type="text" label="Price Amount" />
              <q-select :disable="newReward !== undefined && !reward.isNew" class="col" label="Reward Type" v-model="reward.type" :options="paymentOptions" stack-label/>
              <q-btn :disable="newReward !== undefined" icon="delete_outline" round size="12px"
                      class="self-center q-ml-sm q-mr-sm delete-reward" color="red-5" @click="deleteRegularReward(index)" />
            <submit-cancel v-show="reward.isNew" @submit="saveRegularReward(index)" @cancel="cancelRegularReward(chestRegular)" :show-labels='false'
                          :submit-disable=!reward.isNew :cancel-disable="!reward.isNew" size:sm/>
          </div>
        </div>
        <submit-cancel :disable="newReward !== undefined" @submit="saveChest('chestRegularRewards')"  label-submit="Submit"
                        @cancel="cancelChestRegular" :submit-disable="!chestRegularIsDirty"
                        :cancel-disable="!chestRegularIsDirty"  class="q-mt-lg" :right="true"/>
      </div>
    </div>

    <!-- DROP RATE TABLE -->
    <div class="text-h5 q-ml-md">Drop Rate Table</div>
    <card-drop-rate-table />
    <q-separator spaced="30px"/>

    <!-- CARD SETS -->
    <div class="row justify-between">
      <div class="text-h5">Card Sets</div>
      <div class="row">
        <i class="earch-ico" />
      <q-btn @click="generateAtlas('card_sets')"  fab icon="icon-earth" color="blue-6" round class="q-mr-md btn-earth">
        <q-tooltip :content-style="{ fontSize: '14px' }">Generate Atlas for card set thumbnails</q-tooltip>
      </q-btn>
      <q-btn :disable="cardSetEditing !== undefined || cardEditing !== undefined" @click="addCardSet"  fab  icon="add"
                :color="cardSetEditing ? 'red-3':'red-6'"/>
      </div>
    </div>
    <q-separator spaced="30px"/>
    <div class="q-pa-md  card-set">
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
              <q-btn v-if="!cardSetEditing" @click="deleteCardSet(cardSet)" round icon="delete" color="red-6"
                    class="edit-set-btn" style="z-index: 1" />
              <q-btn v-if="cardSetEditing" @click="cancelSetEdition(cardSet)" round icon="close" color="red-6"
                     class="edit-set-btn" style="z-index: 1" />
              <q-btn @click="generateAtlas(`card_set_${cardSet.id}`)" round icon="icon-earth" color="blue-6"
                     class="edit-set-btn btn-earth" style="z-index: 1">
                <q-tooltip :content-style="{ fontSize: '14px' }">Generate Atlas</q-tooltip>
              </q-btn>
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
                    <div><span class="text-caption" style="display: inline-block;width: 100px">Front card ID </span><span class="text-bold"> {{cardSet.frontCardId}}</span></div>
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
                <div class="row">
                  <q-select class="col" label="Reward Type" v-model="cardSet.rewardType" :options="paymentOptions" stack-label/>
                  <q-input v-model="cardSet.frontCardId" class="col" label="Front card id" stack-label/>
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
import CardDropRateTable from '../components/CardDropRateTable'
import SubmitCancel from '../components/SubmitCancel'
import useGlobal from '../services/useGlobal'
import { alerta, notify, confirma, generateAtlas } from 'src/helpers'
import equal from 'fast-deep-equal'

export default {
  components: { Card, CardDropRateTable, SubmitCancel },
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
      cardEditing: undefined,
      chestRegular: undefined,
      chestRegularIsDirty: false,
      chestPremium: undefined,
      chestPremiumIsDirty: false,
      newReward: undefined,
      chestPremiumBackup: undefined,
      chestRegularBackup: undefined,
      newRewardBackup: undefined
    })
    watch(() => state.chestRegular, () => {
      state.chestRegularIsDirty = !equal(state.chestRegular, state.chestRegularBackup)
      console.log('watch')
    }, { deep: true, inmediate: true })
    watch(() => state.chestPremium, () => {
      state.chestPremiumIsDirty = !equal(state.chestPremium, state.chestPremiumBackup)
      console.log('watch')
    }, { deep: true, inmediate: true })
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
      const fd = new FormData()
      fd.append('json', JSON.stringify(fields))
      if (textureFile && textureFile.length > 0) { fd.append('textureFile', textureFile[0]) }
      if (thumbFile && thumbFile.length > 0) { fd.append('thumbFile', thumbFile[0]) }
      showSpinner()
      const response = await axios({
        method: 'post',
        url: 'slot/card_for_crud',
        data: fd
      })
      hideSpinner()
      const cardSet = state.cardSets.find(_cardSet => _cardSet.id === fields.cardSetId)
      console.log('cardSet', cardSet)
      cardSet.img = response.data.textureUrl
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
      if (!(await confirma('Are you sure you want to delete this card set with all of it\'s cards'))) { return }
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
        cardSet.img = response.data.img
        state.cardSetEditing = undefined
        state.newCardSet = undefined
      } catch (err) {
        hideSpinner()
        await alerta('Error saving data', err)
      }
    }
    const saveChest = async (chestName) => {
      const chest = chestName === 'chestPremiumRewards' ? state.chestPremium : state.chestRegular
      console.log(chestName, chest)
      showSpinner()
      const response = await axios({
        method: 'post',
        url: 'slot/cards_for_crud_chest',
        data: { name: chestName, chest }
      })
      hideSpinner()
      if (chestName === 'chestPremiumRewards') {
        state.chestPremiumBackup = clone()(state.chestPremium)
        state.chestPremiumIsDirty = false
      } else {
        state.chestRegularBackup = clone()(state.chestRegular)
        state.chestRegularIsDirty = false
      }
      return response
    }
    const addPremiumReward = async () => {
      state.newReward = { amount: 1, type: 'coin', isNew: true }
      state.chestPremium.rewards.push(state.newReward)
    }
    const cancelPremiumReward = (rewardIdx) => {
      const idx = state.chestPremium.rewards.findIndex(reward => reward.isNew)
      state.chestPremium.rewards.splice(idx, 1)
      state.newReward = undefined
    }
    const deletePremiumReward = async (index) => {
      if (state.chestPremium.rewards[index].isNew) {
        state.chestPremium.rewards.splice(index, 1)
        state.newReward = undefined
      } else {
        if (await confirma('Delete this reward?')) { state.chestPremium.rewards.splice(index, 1) }
      }
    }
    const deleteRegularReward = async (index) => {
      if (state.chestRegular.rewards[index].isNew) {
        state.chestRegular.rewards.splice(index, 1)
        state.newReward = undefined
      } else {
        if (await confirma('Delete this reward?')) { state.chestRegular.rewards.splice(index, 1) }
      }
    }
    const savePremiumReward = async (rewardIdx) => {
      state.chestPremium.rewards[rewardIdx].isNew = false
      state.newReward = undefined
    }
    const addRegularReward = async () => {
      state.newReward = { amount: 1, type: 'coin', isNew: true }
      state.chestRegular.rewards.push(state.newReward)
    }
    const cancelRegularReward = (rewardIdx) => {
      const idx = state.chestRegular.rewards.findIndex(reward => reward.isNew)
      state.chestRegular.rewards.splice(idx, 1)
      state.newReward = undefined
    }
    const cancelChestPremium = async () => {
      state.chestPremium = clone()(state.chestPremiumBackup)
      state.newReward = undefined
    }
    const cancelChestRegular = async () => {
      state.chestRegular = clone()(state.chestRegularBackup)
      state.newReward = undefined
    }
    const saveRegularReward = async (rewardIdx) => {
      state.chestRegular.rewards[rewardIdx].isNew = false
      state.newReward = undefined
    }
    watch(() => state.chestPremium, (a, b) => {
      if (!a || !b) return
      console.log('watch', a, b)
      console.log('state.chestPremiumBackup === state.chestPremium', state.chestPremiumBackup === state.chestPremium)
      console.log('state.chestPremiumBackup === state.chestPremium', state.chestPremiumBackup, state.chestPremium)
      state.chestPremiumDirty = (state.chestPremiumBackup !== state.chestPremium)
    }, { deep: true })
    // watch and get data from backend
    watch(() => loggedIn, async () => {
      showSpinner()
      const response = await axios({
        url: '/slot/card_sets_for_crud',
        method: 'get',
        params: {}
      })
      hideSpinner()
      state.cardSets = response.data.cardSets
      for (const cardSet of state.cardSets) {
        if (!cardSet.img) cardSet.img = 'https://assets.slotoprizes.tagadagames.com/img/missing.png'
        // if (cardSet.cards?.length > 0) cardSet.img = cardSet.cards[0].thumbUrl
      }
      state.languages = response.data.languages
      state.emptyCard = clone()(response.data.newCard)
      state.emptyCardSet = clone()(response.data.newCardSet)
      state.chestRegular = response.data.chestRegular
      state.chestRegular.dirty = false
      state.chestRegularBackup = clone()(response.data.chestRegular)
      state.chestPremium = response.data.chestPremium
      state.chestPremiumBackup = clone()(response.data.chestPremium)
    }, { immediate: true })
    return {
      ...toRefs(state),
      addCardSet,
      submit,
      editSet,
      cancelSetEdition,
      saveCard,
      addCard,
      cancelCardAdd,
      deleteCard,
      deleteCardSet,
      addPremiumReward,
      savePremiumReward,
      cancelPremiumReward,
      addRegularReward,
      saveRegularReward,
      cancelRegularReward,
      saveChest,
      cancelChestPremium,
      cancelChestRegular,
      deletePremiumReward,
      deleteRegularReward,
      generateAtlas
    }
  }
}
</script>

<style lang="scss">
.btn-earth{
  .q-btn__wrapper {
    padding: 0 !important;
  background-color: rgb(71, 143, 167);
  }
.q-icon {
    color: rgb(123, 226, 114);
    font-size: 42px !important;
    padding: 0;
}
}
.reward-row{
  position: relative;
  .delete-reward{
    display: none;
    position: absolute;
    right: -42px;
  }
  &:hover .delete-reward{
    display: unset;
  }
}
.card-set{
  .card{
    box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgb(219 8 8 / 30%), 0 3px 1px -2px rgb(194 35 35 / 34%);
    border-radius: 4px;
    vertical-align: top;
    background: #e20f0f05;
  }
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
