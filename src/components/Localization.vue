<template>
      <q-card bordered class="">
      <q-card-section>
        <div class="text-subtitle1">Localization for "{{item}}"</div>
      </q-card-section>

      <q-separator inset />

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

        <td>{{item.languageCode}}</td>
        <td>
          <q-input :disable="loading" v-model="item.text" autogrow borderless dense :debounce="900" @input="textChange(item)">
          </q-input>
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
    item: undefined
  },
  setup (props, { root }) {
    const state = reactive({
      localizations: [],
      loading: false,
      posting: false
    })
    async function textChange (item) {
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
        state.localizations = localizationsResp.data
      } finally {
        setTimeout(() => {
          state.loading = false
        }, 500)
      }
    })
    return { ...toRefs(state), textChange }
  }
}
</script>

<style>

</style>
