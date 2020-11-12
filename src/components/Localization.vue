<template>
      <q-card bordered class="">
      <q-card-section v-if="showTitle">
        <div class="text-subtitle1">Localization</div>
      </q-card-section>

      <q-separator inset  v-if="showTitle"/>

      <q-card-section>
        <q-markup-table :bordered='false' flat>
          <q-spinner v-show="loading" color="primary" size="3em"/>
          <q-inner-loading :showing="posting" size="4em">
            <h5 class="bg-green text-white" style="opacity: 100; z-index: 10">Posting language data</h5>
          </q-inner-loading>
    <!-- <thead>
      <tr>
        <th>Lang</th>
        <th class="text-left">Text</th>
      </tr>
    </thead> -->
    <tbody>
      <tr v-for="(item,index) of localizations" :key="index">

        <td style="width: 80px">{{item.languageCode}}</td>
        <td>
          <div class="row">
            <q-input class="col" :disable="loading || (!item.dirty &&editing)" v-model="item.text" autogrow borderless dense @input="textChange(item)" />
            <q-btn class="col-2" icon="save" v-if="item.dirty === true"
                   style="width: 40px" color="green-8" @click="saveItem(item)"/>
            <q-btn class="col-2 q-ml-sm" icon="cancel" v-if="item.dirty === true"
                   style="width: 40px" color="red-8" @click="cancelEdit(item)"/>
          </div>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
      </q-card-section>
    </q-card>
</template>

<script>
import { reactive, toRefs, onMounted } from '@vue/composition-api'
import axios from '../services/axios'
export default {
  props: {
    item: undefined,
    showTitle: { default: true }
  },
  setup (props, { root }) {
    const state = reactive({
      localizations: [],
      loading: false,
      posting: false,
      editing: false
    })
    async function textChange (item) {
      // const idx = state.localizations.findIndex(_localization => _localization.id === item.id)
      if (item.copy === item.text) {
        item.dirty = false
        state.editing = false
      } else {
        item.dirty = true
        state.editing = true
      }
    }
    async function cancelEdit (item) {
      item.dirty = false
      item.text = item.copy
      state.editing = false
    }
    async function saveItem (item) {
      console.log('item', item)
      await postChange(item)
      item.dirty = false
      item.copy = item.text
      state.editing = false
    }
    async function postChange (item) {
      state.posting = true
      try {
        const localizationsResp = await axios.post('slot/localizations_for_crud', { item })
        console.log('resp', localizationsResp)
      } finally {
        setTimeout(() => {
          state.posting = false
        }, 500)
      }
    }
    onMounted(async () => {
      state.loading = true
      try {
        const localizationsResp = await axios.get(`slot/localizations_for_crud?item=${props.item}`)
        state.localizations = localizationsResp.data.map(loc => Object.assign(loc, { dirty: false, copy: loc.text }))
      } finally {
        setTimeout(() => {
          state.loading = false
        }, 500)
      }
    })
    return { ...toRefs(state), textChange, postChange, saveItem, cancelEdit }
  }
}
</script>

<style>

</style>
