
<template>
  <div class="q-pa-md row q-gutter-md" style="flex-direction: column;align-items: center;">
    <DailyReward
      ref="jackpotRef"
      :item="selected"
      :show="Boolean(selected)"
      @oncancel="cancel"
      @onsubmit="submit"
    />
    <q-card
      bordered
      class="my-card"
    >
      <q-card-section
        class="bg-primary text-white"
        style="width: 400px"
      >
        <div class="text-h6">
          Daily Rewards
        </div>
      </q-card-section>

      <q-separator
        dark
        inset
      />
      <q-card-section>
        <q-markup-table
          flat
          square
        >
          <thead>
            <tr>
              <th class="text-left">
                Type
              </th>
              <th class="text-right">
                Amount
              </th>
              <th class="text-right remove-item" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item of items"
              :key="item.id"
              :class="itemClass(item)"
              class="cursor-pointer"
              @click="select(item, $event)"
            >
              <td class="text-left">
                {{ item.type }}
              </td>
              <td class="text-right">
                {{ item.amount }}
              </td>
              <td class="text-right remove-item">
                <q-icon
                  @click="removeItem(item)"
                  size="22px"
                  name="clear"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-page-sticky
      position="top-left"
      :offset="[18, 18]"
    >
      <q-btn
        :disable="isNew !== undefined"
        @click="addNew"
        fab
        icon="add"
        color="red-6"
      />
    </q-page-sticky>

    <q-separator spaced="20px"/>

    <div class="text-h4 q-mb-sm self-start">
      Chests
    </div>
    <div class="shadow-1 q-pa-sm q-mt-sm row">

      <div v-for="chest of chests" :key="chest.id" class="shadow-2 q-ma-xs q-pa-md">

        <div class="row q-mt-md" style="width: 430px">
          <!-- <div class="col text-subtitle1 q-field self-center" style="max-width: 60px">ID #{{chest.id}}</div> -->
          <q-input  :disable="newReward !== undefined" class="col" v-model.number="chest.amount" type="text" label="Days" />
          <!-- <q-select :disable="newReward !== undefined" class="col" label="Reward Type" v-model="chest.currency" :options="paymentOptions" stack-label/> -->
          <q-select :disable="newReward !== undefined" class="col" label="Chest Type" v-model="chest.chestTypeId" map-options emit-value :options="chestTypes"  option-value="id" option-label="name" stack-label/>
          <q-input class="col" v-model.number="chest.id" type="text" label="#ID" style="max-width: 80px" readonly/>
        </div>

        <div class="row q-mt-md q-mb-md">
          <div class="text-h8 q-ml-lg" style="width: 60px; align-self: center">Rewards</div>
          <q-btn :disable="(dirtyChest && dirtyChest.id !== chest.id) || newReward !== undefined" round size='sm' color="secondary" icon="add" @click="addChestReward(chest)" class="q-ml-sm" />
        </div>

        <div v-for="(reward, index) of chest.rewards" :key="index">
          <!-- <q-separator class="q-ml-lg"/> -->
          <div class="row reward-row" :style="reward.isNew ? 'width: 436px' : 'width: 430px'">
              <q-input :disable="newReward !== undefined && !reward.isNew" class="col q-ml-lg" v-model="reward.amount" type="text" label="Price Amount" />
              <q-select :disable="newReward !== undefined && !reward.isNew" class="col" label="Reward Type" v-model="reward.type" :options="paymentOptions" stack-label/>
              <q-btn :disable="newReward !== undefined" icon="delete_outline" round size="12px"
                      class="self-center q-ml-sm q-mr-sm delete-reward" color="red-5" @click="deleteReward(chest, reward)" />
            <submit-cancel v-if="reward.isNew" @submit="saveReward(reward)" @cancel="cancelReward(chest, reward)" :show-labels='false'
                          :submit-disable=!reward.isNew :cancel-disable="!reward.isNew" size="12px"/>
          </div>

        </div>

        <submit-cancel v-if="dirtyChest && dirtyChest.id === chest.id" :disable="newReward !== undefined" @submit="saveChest(chest)"
            label-submit="Submit" @cancel="cancelChest(chest)" class="q-mt-lg q-mb-xl" :right="true"/>

        <div  style="clear: both">&nbsp;</div>
        <!-- <q-separator spaced=""/> -->
      </div>

    </div>

  </div>

</template>

<script>
import { reactive, toRefs, watch, computed } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import SubmitCancel from '../components/SubmitCancel'
import DailyReward from '../components/DailyReward'
import { alerta, confirma, clone } from 'src/helpers'
import useGlobal from '../services/useGlobal'
// import Vue from 'vue'
import equal from 'fast-deep-equal'
// import { alerta } from 'src/helpers'
export default {
  components: { DailyReward, SubmitCancel },
  setup () {
    const { showSpinner, hideSpinner } = useGlobal()
    const { loggedIn } = useSession()
    const state = reactive({
      paymentOptions: ['coin', 'spin', 'ticket', 'jackpot'],
      items: [],
      jackpotRef: undefined,
      selected: false,
      newItem: undefined,
      newReward: undefined,
      chests: [],
      chestTypes: [],
      chestsBackup: undefined,
      dirtyChest: undefined
    })
    const addNew = async () => { state.selected = { id: -1, type: '', amount: 0 } }
    const isNew = computed(() => state.items.find(_item => _item.id === -1))
    const submit = async (data) => {
      try {
        const resp = await axios({
          method: 'post',
          url: '/slot/daily_reward_for_crud',
          data
        })
        if (data.id === -1) {
          console.log('respre', resp)
          data.id = resp.data
          console.log('detalle', 1)
          state.items.push(Object.assign({}, data))
        } else {
          const idxItem = state.items.findIndex(_item => _item.id === data.id)
          state.items[idxItem] = data
        }
        state.selected = undefined
        console.log('detalle', resp.data)
      } catch (err) {
        await alerta(err)
      }
    }
    const cancel = async (data) => {
      if (data.id === -1) {
        const idxNew = state.items.findIndex(_item => _item.id === -1)
        state.items.splice(idxNew, 1)
      }
      state.selected = undefined
    }
    const itemClass = (item) => {
      console.log('items', item.state)
      return item.state
    }
    const select = async (item, event) => {
      if (event.target.tagName === 'I') return
      state.selected = item
      console.log('item', item)
    }
    const removeItem = async (item) => {
      const ok = await confirma('Are you sure?')
      if (ok) {
        const resp = await axios({
          method: 'delete',
          url: '/slot/daily_reward_for_crud',
          params: { id: item.id }
        })
        console.log('resp', resp)
        const itemForDelete = state.items.findIndex(_item => _item.id === item.id)
        state.items.splice(itemForDelete, 1)
        await alerta('Item removed')
      }
      console.log('item', item)
    }
    const addChestReward = async (chest) => {
      state.newReward = { id: -1, amount: 1, type: 'coin', isNew: true }
      chest.rewards.push(state.newReward)
    }
    const saveReward = async (reward) => {
      reward.isNew = false
      state.newReward = undefined
    }
    const cancelReward = (chest, reward) => {
      const idx = chest.rewards.findIndex(_reward => _reward.id === reward.id)
      console.log('idx', idx)
      chest.rewards.splice(idx, 1)
      delete reward.isNew
      state.newReward = undefined
    }
    const cancelChest = async (chest) => {
      console.log('chest', clone(chest))
      const backup = state.chestsBackup.find(_chest => _chest.id === chest.id)
      // chest = clone(backup)
      const idx = state.chests.findIndex(backupChest => backupChest.id === chest.id)
      Object.assign(state.chests[idx], clone(backup))
      state.dirtyChest = undefined
      console.log('chest', state.chests[idx])
      state.newReward = undefined
    }
    const deleteReward = async (chest, reward) => {
      const rewardIdx = chest.rewards.findIndex(_reward => _reward.id === reward.id)
      if (reward.isNew) {
        chest.rewards.splice(rewardIdx, 1)
        state.newReward = undefined
      } else {
        if (await confirma('Delete this reward?')) { chest.rewards.splice(rewardIdx, 1) }
      }
    }
    const saveChest = async (chest) => {
      showSpinner()
      const response = await axios({
        method: 'post',
        url: 'slot/cards_for_crud_chest',
        data: { chest }
      })
      hideSpinner()
      const backupIdx = state.chestsBackup.findIndex(backup => backup.id === chest.id)
      Object.assign(state.chestsBackup[backupIdx], clone(chest))
      state.dirtyChest = undefined
      return response
    }
    watch(() => state.chests, () => {
      state.dirtyChest = undefined
      for (const chest of state.chests) {
        const backup = state.chestsBackup.find(backup => backup.id === chest.id)
        if (!equal(chest, backup)) state.dirtyChest = chest
        if (chest.id === 3) console.log('chest', JSON.stringify(chest, null, 2), JSON.stringify(backup, null, 2))
        console.log('changed')
      }
      console.log('watch')
    }, { deep: true, inmediate: false })
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/daily_reward_for_crud',
        method: 'get',
        params: {}
      })
      state.items = response.data.rewards
      state.chests = response.data.chests
      state.chestTypes = response.data.chestTypes
      state.chestsBackup = clone(response.data.chests)
    }, { immediate: true })
    return {
      ...toRefs(state),
      submit,
      itemClass,
      select,
      isNew,
      addNew,
      cancel,
      removeItem,
      addChestReward,
      saveReward,
      cancelReward,
      cancelChest,
      saveChest,
      deleteReward
    }
  }
}
</script>

<style lang="scss">
.past{
  color: black;
  background-color: rgb(246, 243, 243);
}
.live{
  color: green;
  background-color: rgb(230, 255, 206);
}
.next{
  color: white;
  background-color: rgba(233, 136, 112, 0.358)
}
.q-table{
  height: unset !important;
}
.q-table tr{
  .remove-item {
    width: 40px!important;
    max-width: 40px!important;
    .q-icon{
      display: none;
      color: red;
    }
  }
  &:hover .q-icon{
    display: block;
    cursor: pointer;
  }
}
</style>
